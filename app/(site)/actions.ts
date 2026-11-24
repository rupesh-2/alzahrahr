"use server";

import path from "node:path";
import { z } from "zod";
import { getCompanyProfile } from "@/lib/data";
import { escapeHtml, sendMail } from "@/lib/mail";
import { isFile } from "@/lib/storage";

import type { FormState } from "@/lib/form-state";

const MAX_UPLOAD_BYTES = 1024 * 1024; // 1 MB, as in the Laravel rules (max:1024)

const required = (label: string) => z.string().trim().min(1, `The ${label} field is required.`);

function textValues(formData: FormData, keys: readonly string[]) {
  return Object.fromEntries(keys.map((k) => [k, String(formData.get(k) ?? "")]));
}

function fieldErrors<K extends string>(error: z.ZodError): Partial<Record<K, string>> {
  const out: Partial<Record<K, string>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as K;
    out[key] ??= issue.message;
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Contact form                                                        */
/* ------------------------------------------------------------------ */

const CONTACT_FIELDS = ["name", "email", "message"] as const;
export type ContactField = (typeof CONTACT_FIELDS)[number];

const contactSchema = z.object({
  name: required("name"),
  email: required("email").pipe(z.email("The email field must be a valid email address.")),
  message: required("message"),
});

export async function contactUs(_prev: FormState<ContactField>, formData: FormData): Promise<FormState<ContactField>> {
  const values = textValues(formData, CONTACT_FIELDS);
  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) return { status: "error", errors: fieldErrors(parsed.error), values };

  const profile = await getCompanyProfile();
  if (!profile) return { status: "error", message: "Our contact email is not set up yet. Please call us instead.", values };

  const { name, email, message } = parsed.data;
  try {
    await sendMail({
      to: profile.company_email,
      replyTo: { name, address: email },
      subject: "Thankyou for contacting us, we will respond you ",
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html: `<p>Name: ${escapeHtml(name)}</p><p>Email: ${escapeHtml(email)}</p><p>Message: ${escapeHtml(message).replace(/\n/g, "<br>")}</p>`,
    });
  } catch (e) {
    console.error("Contact form mail failed", e);
    return { status: "error", message: "We could not send your message. Please try again or call us.", values };
  }
  return { status: "success", message: "Mail sent successfully" };
}

/* ------------------------------------------------------------------ */
/* Apply form                                                          */
/* ------------------------------------------------------------------ */

const APPLY_TEXT_FIELDS = [
  "userName",
  "email",
  "firstName",
  "lastName",
  "address",
  "city",
  "country",
  "phoneNumber",
  "aboutMe",
] as const;
const APPLY_FILE_FIELDS = ["cv", "passport", "photo"] as const;
export type ApplyField = (typeof APPLY_TEXT_FIELDS)[number] | (typeof APPLY_FILE_FIELDS)[number];

const applySchema = z.object({
  userName: required("full name"),
  email: required("email").pipe(z.email("The email field must be a valid email address.")),
  firstName: required("first name"),
  lastName: required("last name"),
  address: required("address"),
  city: required("city"),
  country: required("country"),
  phoneNumber: required("phone number"),
  aboutMe: required("about yourself"),
});

const FILE_LABELS: Record<(typeof APPLY_FILE_FIELDS)[number], string> = { cv: "C.V", passport: "passport", photo: "photo" };
const ATTACHMENT_NAMES: Record<(typeof APPLY_FILE_FIELDS)[number], string> = { cv: "CV", passport: "Passport", photo: "Photo" };

export async function applyNow(_prev: FormState<ApplyField>, formData: FormData): Promise<FormState<ApplyField>> {
  const values = textValues(formData, APPLY_TEXT_FIELDS);
  const parsed = applySchema.safeParse(values);
  const errors: Partial<Record<ApplyField, string>> = parsed.success ? {} : fieldErrors(parsed.error);

  const files: Partial<Record<(typeof APPLY_FILE_FIELDS)[number], File>> = {};
  for (const key of APPLY_FILE_FIELDS) {
    const file = formData.get(key);
    if (!isFile(file)) errors[key] = `The ${FILE_LABELS[key]} field is required.`;
    else if (file.size > MAX_UPLOAD_BYTES) errors[key] = `The ${FILE_LABELS[key]} must not be greater than 1 MB.`;
    else files[key] = file;
  }

  if (!parsed.success || Object.keys(errors).length > 0) return { status: "error", errors, values };

  const profile = await getCompanyProfile();
  if (!profile) return { status: "error", message: "Applications are not open yet. Please contact us by phone.", values };

  const data = parsed.data;
  const rows: [string, string][] = [
    ["Full name", data.userName],
    ["Email", data.email],
    ["First Name", data.firstName],
    ["Last Name", data.lastName],
    ["Address", data.address],
    ["City", data.city],
    ["Country", data.country],
    ["Phone number", data.phoneNumber],
    ["About myself", data.aboutMe],
  ];
  const intro = "Thank you for submitting your application. We have received the information you provided:";
  const outro = "We will review your application and get back to you soon. If you have any questions, feel free to contact us.";

  try {
    await sendMail({
      to: profile.company_email,
      replyTo: { name: data.userName, address: data.email },
      subject: "We are very thankyoul to know you choose us to guide you through your career. We will respond you soon",
      text: [`Dear ${data.userName},`, "", intro, "", "Applicant Information", ...rows.map(([k, v]) => `- ${k}: ${v}`), "", outro].join("\n"),
      html: `<p><strong>Dear ${escapeHtml(data.userName)},</strong></p>
<p>${intro}</p>
<p>Applicant Information</p>
<ul>${rows.map(([k, v]) => `<li><strong>${k}:</strong> ${escapeHtml(v)}</li>`).join("")}</ul>
<p>${outro}</p>`,
      attachments: await Promise.all(
        APPLY_FILE_FIELDS.map(async (key) => {
          const file = files[key]!;
          return {
            filename: ATTACHMENT_NAMES[key] + path.extname(file.name).toLowerCase(),
            content: Buffer.from(await file.arrayBuffer()),
            contentType: file.type || "application/octet-stream",
          };
        }),
      ),
    });
  } catch (e) {
    console.error("Apply form mail failed", e);
    return { status: "error", message: "We could not send your application. Please try again.", values };
  }

  return {
    status: "success",
    message: "Mail sent successfully, We will respond you soon after reviewing your application",
  };
}
