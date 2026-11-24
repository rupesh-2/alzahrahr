import type { FieldSpec } from "@/components/admin/admin-form";

export function advertisementFields(currentImage: string | null): FieldSpec[] {
  return [
    { name: "job_title", label: "Job title" },
    { name: "location", label: "Location" },
    { name: "company_name", label: "Company name" },
    { name: "minimum_qualification", label: "Minimum qualification" },
    { name: "male_required", label: "No of male required", type: "number" },
    { name: "female_required", label: "No of female required", type: "number" },
    { name: "salary", label: "Salary", type: "number" },
    {
      name: "job_description",
      label: "Job description",
      type: "textarea",
      help: "Enter each point on a new line. It will be displayed as a bulleted list.",
    },
    {
      name: "image",
      label: currentImage ? "Replace image" : "Image",
      type: "file",
      accept: "image/*",
      required: !currentImage,
      current: currentImage ? { url: currentImage, kind: "image" } : undefined,
    },
  ];
}
