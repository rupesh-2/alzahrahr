import Link from "next/link";
import { Glyph } from "@/components/glyph";
import { VacancyCard } from "@/components/vacancy-card";
import { getAdvertisements, getCompanies } from "@/lib/data";
import { mediaUrl } from "@/lib/format";
import { EXECUTIVES, PURPOSE } from "@/lib/content";

// Counter values from the original home page.
const STATS = [
  ["12,000+", "Happy employees"],
  ["12+", "Years of experience"],
  ["50", "Consultants"],
  ["2", "Total branches"],
] as const;

const SERVICES = [
  {
    title: "Documentation",
    img: "/image/documentation.png",
    text: "Basically, we demand two types of documents before making a final deal for sending workers overseas. We follow the in-detail government provisions to avoid unnecessary hassles to the workers. Documents needed for the recruitment company include demand letter, power of attorney, guarantee letter, employment contract & agency agreement — which should be attested at least by the chambers of commerce and the embassy of Nepal in the related country.",
  },
  {
    title: "Selection",
    img: "/image/selection.jpg",
    text: "Embarking on a career abroad is an exciting prospect for Nepali professionals, and at Alzahra Human Resource, we specialize in facilitating this journey. Our rigorous selection process ensures that candidates are matched with opportunities that align with their skills and aspirations. From evaluating qualifications to providing interview preparation, we guide candidates every step of the way towards securing rewarding positions overseas.",
  },
  {
    title: "Recruitment",
    img: "/image/recquirement.jpg",
    text: "For people working in competitive industries such as construction, engineering, security, oil & gas and hospitality, it’s important to consider how overseas recruitment and overseas projects could benefit their careers in the long term. Although the Nepal market is growing and creating opportunities for its people, it is still important to explore the global market and its new challenges.",
  },
  {
    title: "Deployment",
    img: "/image/deployment.jpg",
    text: "Once candidates secure employment opportunities abroad, our commitment to their success continues. Our deployment services ensure a smooth transition, offering pre-departure orientations, logistical support, and ongoing assistance throughout their overseas journey. With our personalized approach and dedication to ethical practices, we strive to make the experience of working abroad a positive and enriching one for Nepali professionals.",
  },
];

const EMPLOYER_POINTS = [
  "Documentation handled in detail",
  "Rigorous candidate selection",
  "Recruitment across construction, engineering, security, oil & gas and hospitality",
  "Pre-departure orientation and ongoing support",
];

const FEEDBACK = [
  "I am extremely grateful to the Alzahra Human Resource for connecting me with an amazing foreign employment opportunity. The professionalism and support extended by the team were exceptional. From handling documentation to guiding me through the entire process, they were with me every step of the way. Thanks to them, I now have a rewarding career abroad that I wouldn’t have imagined without their assistance.",
  "I couldn’t be happier with the service provided by Alzahra. They not only helped me secure a fantastic job abroad but also ensured that the transition was smooth and hassle-free. Their attention to detail and commitment to customer satisfaction are truly commendable. I highly recommend their services to anyone seeking employment opportunities overseas.",
  "My experience with the Alzahra family exceeded all expectations. They didn’t just find me a job abroad; they found me the perfect fit for my skills and aspirations. Their guidance and support were instrumental in making the entire process stress-free. I am grateful for their dedication and professionalism, and I wouldn’t hesitate to work with them again in the future.",
];

export default async function HomePage() {
  const [jobs, companies] = await Promise.all([getAdvertisements(3), getCompanies()]);

  return (
    <div>
      {/* ============ Hero ============ */}
      <section className="relative bg-grey">
        <div className="lg:grid lg:min-h-[560px] lg:grid-cols-2">
          <div className="flex items-center px-5 py-14 sm:py-20 lg:py-24 lg:pr-14 lg:pl-[max(2rem,calc((100vw-76rem)/2+2rem))]">
            <div>
              <p className="eyebrow">Alzahra Human Resource Consultancy welcomes you</p>
              <h1 className="mt-5 text-[2.4rem] leading-[1.12] sm:text-[3.1rem]">Fulfilling all your HR&nbsp;needs</h1>
              <p className="lead mt-6 max-w-lg">
                A Government of Nepal licensed recruitment agency (licence no. 1657/080/081) supplying workers to Saudi
                Arabia, Dubai, Qatar, Bahrain, Kuwait, Oman, Malaysia and Europe.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href="/contacts" className="btn-primary">
                  Hire workers
                </Link>
                <Link href="/vacancies" className="btn-ghost">
                  Find a job abroad
                </Link>
              </div>
              <a
                href="/download-pdf"
                className="mt-7 inline-flex items-center gap-2 text-sm text-muted hover:text-brand-700"
              >
                <Glyph name="download" className="h-4 w-4" />
                <span>
                  <span className="link">Download company profile</span>{" "}
                  <span className="text-secondary">· PDF, 20 MB</span>
                </span>
              </a>
            </div>
          </div>
          <div className="relative h-72 sm:h-96 lg:h-auto">
            <img
              src="/image/hero.jpg"
              alt="Workers on a construction project"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Counters */}
        <div className="bg-brand-800">
          <dl className="container grid grid-cols-2 lg:grid-cols-4">
            {STATS.map(([value, label], i) => (
              <div
                key={label}
                className={[
                  "flex flex-col-reverse py-7 sm:py-9",
                  i % 2 === 1 && "border-l border-white/10 pl-6 sm:pl-8",
                  i >= 2 && "border-t border-white/10 lg:border-t-0",
                  i === 2 && "lg:border-l lg:pl-8",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <dt className="mt-2 text-sm text-leaf">{label}</dt>
                <dd className="font-display text-[2rem] leading-none font-semibold text-white sm:text-[2.5rem]">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ============ Two journeys ============ */}
      <section className="container py-20 sm:py-24">
        <div className="max-w-2xl">
          <p className="eyebrow">How we can help</p>
          <h2 className="section-title">
            Whether you are hiring or looking for work, we guide you every step of the way
          </h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* Employers */}
          <article className="flex flex-col rounded-lg border border-line p-8 sm:p-10">
            <p className="font-display text-sm font-medium text-brand-700">For employers</p>
            <h3 className="mt-3 text-2xl">Hire skilled Nepali workers</h3>
            <p className="mt-4 text-muted">
              We source, select and deploy workers to your exact requirements, following government provisions at every
              step.
            </p>
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {EMPLOYER_POINTS.map((point) => (
                <li key={point} className="flex gap-3 py-3 text-[15px]">
                  <Glyph name="check" className="mt-1 h-4 w-4 text-brand-700" />
                  {point}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3 pt-1 lg:mt-auto lg:pt-8">
              <Link href="/contacts" className="btn-primary">
                Send an enquiry
              </Link>
              <Link href="/clients" className="btn-ghost">
                Our clients
              </Link>
            </div>
          </article>

          {/* Candidates */}
          <article className="on-dark flex flex-col rounded-lg bg-brand-700 p-8 text-white sm:p-10">
            <p className="font-display text-sm font-medium text-leaf">For job seekers</p>
            <h3 className="mt-3 text-2xl">Build your career abroad</h3>
            <p className="mt-4 text-white/80">
              We match you with opportunities that fit your skills and aspirations — from interview preparation to your
              arrival overseas.
            </p>
            <div className="mt-6 border-y border-white/15">
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <Link
                    key={job.id}
                    href={`/vacancy/${job.id}`}
                    className="group flex items-center justify-between gap-4 border-b border-white/15 py-3 last:border-b-0"
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-display text-[15px] font-medium">
                        {job.job_title || "Job opening"}
                      </span>
                      {job.location && <span className="block truncate text-[13px] text-white/65">{job.location}</span>}
                    </span>
                    <Glyph name="arrow-right" className="h-4 w-4 text-leaf transition group-hover:translate-x-1" />
                  </Link>
                ))
              ) : (
                <p className="py-3 text-[15px] text-white/75">No jobs are currently available.</p>
              )}
            </div>
            <div className="mt-8 flex flex-wrap gap-3 lg:mt-auto lg:pt-8">
              <Link href="/apply-now" className="btn-light">
                Apply now
              </Link>
              <Link href="/vacancies" className="btn-on-dark">
                All vacancies
              </Link>
            </div>
          </article>
        </div>
      </section>

      {/* ============ Services ============ */}
      <section className="border-t border-line bg-mist py-20 sm:py-24">
        <div className="container grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-40">
              <p className="eyebrow">Our services</p>
              <h2 className="section-title">From documentation to deployment</h2>
              <p className="lead mt-5">
                Four services, one accountable partner — for employers and for the workers we send overseas.
              </p>
            </div>
          </div>
          <ol className="lg:col-span-8">
            {SERVICES.map((service, i) => (
              <li
                key={service.title}
                className="grid gap-6 border-t border-line py-8 first:border-t-0 first:pt-0 sm:grid-cols-[8.5rem_1fr] sm:gap-8"
              >
                <img
                  src={service.img}
                  alt=""
                  loading="lazy"
                  className="aspect-[4/3] w-full rounded-md bg-white object-cover sm:w-[8.5rem]"
                />
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="font-display text-sm text-secondary">0{i + 1}</span>
                    <h3 className="text-xl">{service.title}</h3>
                  </div>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">{service.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ Current vacancies ============ */}
      <section className="container py-20 sm:py-24">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Now hiring</p>
            <h2 className="section-title">Our current vacancies</h2>
          </div>
          <Link href="/vacancies" className="link self-start sm:self-auto">
            View all vacancies
          </Link>
        </div>

        {jobs.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <VacancyCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <p className="mt-10 rounded-lg border border-line p-8 text-muted">
            No jobs are currently available.{" "}
            <Link href="/apply-now" className="link">
              Send us your CV
            </Link>{" "}
            and we’ll contact you when a suitable role opens.
          </p>
        )}
      </section>

      {/* ============ Why we are here ============ */}
      <section className="panel py-20 sm:py-24">
        <div className="container">
          <div className="max-w-2xl">
            <p className="eyebrow">Why we are here</p>
            <h2 className="section-title">Trust, mutual respect and quality service</h2>
          </div>
          <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            {PURPOSE.map(([title, text]) => (
              <div key={title} className="border-t-2 border-accent-tertiary/70 pt-6">
                <h3 className="text-lg">{title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-white/75">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Executive team ============ */}
      <section className="container py-20 sm:py-24">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Leadership</p>
            <h2 className="section-title">Executive team</h2>
          </div>
          <Link href="/expertise-saying" className="link self-start sm:self-auto">
            Read the message from our expertise
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {EXECUTIVES.map((exec) => (
            <figure
              key={exec.name}
              className="grid overflow-hidden rounded-lg border border-line sm:grid-cols-[13rem_1fr]"
            >
              <img
                src={exec.img}
                alt={exec.name}
                loading="lazy"
                className="aspect-[4/3] h-full w-full object-cover object-top sm:aspect-auto"
              />
              <figcaption className="flex flex-col p-6 sm:p-7">
                <p className="font-display text-xs font-medium tracking-[0.14em] text-brand-700 uppercase">
                  {exec.role}
                </p>
                <p className="mt-1 font-display text-xl font-semibold">{exec.name}</p>
                <blockquote className="mt-4 text-[15px] leading-relaxed text-muted">
                  “Dear Guests, I am delighted to welcome you as {exec.as} of Alzahra Human Resource.”
                </blockquote>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ============ Clients ============ */}
      {companies.length > 0 && (
        <section className="border-t border-line py-16 sm:py-20">
          <div className="container flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">Our clients</p>
              <h2 className="section-title">Our prestigious clients</h2>
            </div>
            <Link href="/clients" className="link self-start sm:self-auto">
              View all clients
            </Link>
          </div>
          <div className="relative mt-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
            <div className="marquee flex w-max gap-4">
              {[0, 1].map((copy) =>
                companies.map((company) => (
                  <div
                    key={`${copy}-${company.id}`}
                    className="grid h-24 w-48 shrink-0 place-items-center rounded-md border border-line bg-white px-6"
                    aria-hidden={copy === 1 || undefined}
                  >
                    <img
                      src={mediaUrl(company.logo)!}
                      alt={copy === 1 ? "" : "Client logo"}
                      className="max-h-12 w-auto max-w-full object-contain"
                    />
                  </div>
                )),
              )}
            </div>
          </div>
        </section>
      )}

      {/* ============ Feedback ============ */}
      <section className="border-t border-line bg-mist py-20 sm:py-24">
        <div className="container">
          <p className="eyebrow">Testimonials</p>
          <h2 className="section-title">Feedback from our happy clients</h2>
          <div className="mt-12 grid gap-6 lg:grid-cols-5">
            <figure className="flex flex-col rounded-lg bg-brand-800 p-8 text-white sm:p-10 lg:col-span-3">
              <Glyph name="quote" className="h-8 w-8 text-leaf" />
              <blockquote className="mt-5 font-display text-lg leading-relaxed font-normal sm:text-[1.3rem] sm:leading-[1.6]">
                {FEEDBACK[0]}
              </blockquote>
            </figure>
            <div className="grid gap-6 lg:col-span-2">
              {FEEDBACK.slice(1).map((quote) => (
                <figure key={quote.slice(0, 24)} className="rounded-lg border border-line bg-white p-6 sm:p-7">
                  <blockquote className="text-[15px] leading-relaxed text-ink/85">“{quote}”</blockquote>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
