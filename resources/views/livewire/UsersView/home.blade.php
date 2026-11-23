@php
    // Counter values from the original home page.
    $stats = [
        ['12,000+', 'Happy employees'],
        ['12+', 'Years of experience'],
        ['50', 'Consultants'],
        ['2', 'Total branches'],
    ];
    $services = [
        [
            'title' => 'Documentation',
            'img' => 'image/documentation.png',
            'text' => 'Basically, we demand two types of documents before making a final deal for sending workers overseas. We follow the in-detail government provisions to avoid unnecessary hassles to the workers. Documents needed for the recruitment company include demand letter, power of attorney, guarantee letter, employment contract & agency agreement — which should be attested at least by the chambers of commerce and the embassy of Nepal in the related country.',
        ],
        [
            'title' => 'Selection',
            'img' => 'image/selection.jpg',
            'text' => 'Embarking on a career abroad is an exciting prospect for Nepali professionals, and at Alzahra Human Resource, we specialize in facilitating this journey. Our rigorous selection process ensures that candidates are matched with opportunities that align with their skills and aspirations. From evaluating qualifications to providing interview preparation, we guide candidates every step of the way towards securing rewarding positions overseas.',
        ],
        [
            'title' => 'Recruitment',
            'img' => 'image/recquirement.jpg',
            'text' => 'For people working in competitive industries such as construction, engineering, security, oil & gas and hospitality, it’s important to consider how overseas recruitment and overseas projects could benefit their careers in the long term. Although the Nepal market is growing and creating opportunities for its people, it is still important to explore the global market and its new challenges.',
        ],
        [
            'title' => 'Deployment',
            'img' => 'image/deployment.jpg',
            'text' => 'Once candidates secure employment opportunities abroad, our commitment to their success continues. Our deployment services ensure a smooth transition, offering pre-departure orientations, logistical support, and ongoing assistance throughout their overseas journey. With our personalized approach and dedication to ethical practices, we strive to make the experience of working abroad a positive and enriching one for Nepali professionals.',
        ],
    ];
    $purpose = [
        ['Mission', 'Our mission statement is to achieve the vision envisaged, i.e. to exploit the extensive foreign employment opportunities to enhance the progressive indices of economic growth through quality and fully contained services to foreign employers as per their requirements.'],
        ['Vision', 'Our vision is to lead in the creation and delivery of innovative workforce solutions and services that enable our clients to win in the changing world of work.'],
        ['Value', 'To explore foreign employment opportunities in favour of Nepalese labour potential. To export the Nepalese workforce on the ground of trust, mutual respect and all types of human security. To enhance the quality and competencies of Nepalese services as per international standards.'],
    ];
    $executives = [
        ['name' => 'Kshitij Dhungana', 'role' => 'Chairman', 'img' => 'image/chairman.png', 'as' => 'chairman'],
        ['name' => 'Ashish Singh', 'role' => 'CEO', 'img' => 'image/ceo.jpg', 'as' => 'CEO'],
    ];
    $feedback = [
        'I am extremely grateful to the Alzahra Human Resource for connecting me with an amazing foreign employment opportunity. The professionalism and support extended by the team were exceptional. From handling documentation to guiding me through the entire process, they were with me every step of the way. Thanks to them, I now have a rewarding career abroad that I wouldn’t have imagined without their assistance.',
        'I couldn’t be happier with the service provided by Alzahra. They not only helped me secure a fantastic job abroad but also ensured that the transition was smooth and hassle-free. Their attention to detail and commitment to customer satisfaction are truly commendable. I highly recommend their services to anyone seeking employment opportunities overseas.',
        'My experience with the Alzahra family exceeded all expectations. They didn’t just find me a job abroad; they found me the perfect fit for my skills and aspirations. Their guidance and support were instrumental in making the entire process stress-free. I am grateful for their dedication and professionalism, and I wouldn’t hesitate to work with them again in the future.',
    ];
@endphp

<div>
    {{-- ============ Hero ============ --}}
    <section class="relative bg-grey">
        <div class="lg:grid lg:min-h-[560px] lg:grid-cols-2">
            <div class="flex items-center px-5 py-14 sm:py-20 lg:py-24 lg:pl-[max(2rem,calc((100vw-76rem)/2+2rem))] lg:pr-14">
                <div>
                    <p class="eyebrow">Alzahra Human Resource Consultancy welcomes you</p>
                    <h1 class="mt-5 text-[2.4rem] leading-[1.12] sm:text-[3.1rem]">Fulfilling all your HR&nbsp;needs</h1>
                    <p class="lead mt-6 max-w-lg">
                        A Government of Nepal licensed recruitment agency (licence no. 1657/080/081) supplying workers to
                        Saudi Arabia, Dubai, Qatar, Bahrain, Kuwait, Oman, Malaysia and Europe.
                    </p>
                    <div class="mt-9 flex flex-wrap gap-3">
                        <a href="/contacts" wire:navigate class="btn-primary">Hire workers</a>
                        <a href="/vacancies" wire:navigate class="btn-ghost">Find a job abroad</a>
                    </div>
                    <a href="{{ route('download.pdf') }}" class="mt-7 inline-flex items-center gap-2 text-sm text-muted hover:text-brand-700">
                        <x-glyph name="download" class="h-4 w-4" />
                        <span><span class="link">Download company profile</span> <span class="text-secondary">· PDF, 20 MB</span></span>
                    </a>
                </div>
            </div>
            <div class="relative h-72 sm:h-96 lg:h-auto">
                <img src="{{ asset('image/hero.jpg') }}" alt="Workers on a construction project"
                    class="absolute inset-0 h-full w-full object-cover">
            </div>
        </div>

        {{-- Counters --}}
        <div class="bg-brand-800">
            <dl class="container grid grid-cols-2 lg:grid-cols-4">
                @foreach ($stats as $i => [$value, $label])
                    <div @class([
                        'py-7 sm:py-9',
                        'border-l border-white/10 pl-6 sm:pl-8' => $i % 2 === 1,
                        'border-t border-white/10 lg:border-t-0' => $i >= 2,
                        'lg:border-l lg:pl-8' => $i === 2,
                    ])>
                        <dd class="font-display text-[2rem] font-semibold leading-none text-white sm:text-[2.5rem]">{{ $value }}</dd>
                        <dt class="mt-2 text-sm text-leaf">{{ $label }}</dt>
                    </div>
                @endforeach
            </dl>
        </div>
    </section>

    {{-- ============ Two journeys ============ --}}
    <section class="container py-20 sm:py-24">
        <div class="max-w-2xl">
            <p class="eyebrow">How we can help</p>
            <h2 class="section-title">Whether you are hiring or looking for work, we guide you every step of the way</h2>
        </div>

        <div class="mt-12 grid gap-6 lg:grid-cols-2">
            {{-- Employers --}}
            <article class="flex flex-col rounded-lg border border-line p-8 sm:p-10">
                <p class="font-display text-sm font-medium text-brand-700">For employers</p>
                <h3 class="mt-3 text-2xl">Hire skilled Nepali workers</h3>
                <p class="mt-4 text-muted">We source, select and deploy workers to your exact requirements, following
                    government provisions at every step.</p>
                <ul class="mt-6 divide-y divide-line border-y border-line">
                    @foreach (['Documentation handled in detail', 'Rigorous candidate selection', 'Recruitment across construction, engineering, security, oil & gas and hospitality', 'Pre-departure orientation and ongoing support'] as $point)
                        <li class="flex gap-3 py-3 text-[15px]"><x-glyph name="check" class="mt-1 h-4 w-4 text-brand-700" />{{ $point }}</li>
                    @endforeach
                </ul>
                <div class="mt-8 flex flex-wrap gap-3 pt-1 lg:mt-auto lg:pt-8">
                    <a href="/contacts" wire:navigate class="btn-primary">Send an enquiry</a>
                    <a href="/clients" wire:navigate class="btn-ghost">Our clients</a>
                </div>
            </article>

            {{-- Candidates --}}
            <article class="on-dark flex flex-col rounded-lg bg-brand-700 p-8 text-white sm:p-10">
                <p class="font-display text-sm font-medium text-leaf">For job seekers</p>
                <h3 class="mt-3 text-2xl">Build your career abroad</h3>
                <p class="mt-4 text-white/80">We match you with opportunities that fit your skills and aspirations — from
                    interview preparation to your arrival overseas.</p>
                <div class="mt-6 border-y border-white/15">
                    @forelse ($jobs as $job)
                        <a href="/vacancy/{{ $job->id }}" wire:navigate class="group flex items-center justify-between gap-4 border-b border-white/15 py-3 last:border-b-0">
                            <span class="min-w-0">
                                <span class="block truncate font-display text-[15px] font-medium">{{ $job->job_title ?: 'Job opening' }}</span>
                                @if ($job->location)<span class="block truncate text-[13px] text-white/65">{{ $job->location }}</span>@endif
                            </span>
                            <x-glyph name="arrow-right" class="h-4 w-4 text-leaf transition group-hover:translate-x-1" />
                        </a>
                    @empty
                        <p class="py-3 text-[15px] text-white/75">No jobs are currently available.</p>
                    @endforelse
                </div>
                <div class="mt-8 flex flex-wrap gap-3 lg:mt-auto lg:pt-8">
                    <a href="/apply-now" wire:navigate class="btn-light">Apply now</a>
                    <a href="/vacancies" wire:navigate class="btn-on-dark">All vacancies</a>
                </div>
            </article>
        </div>
    </section>

    {{-- ============ Services ============ --}}
    <section class="border-t border-line bg-mist py-20 sm:py-24">
        <div class="container grid gap-12 lg:grid-cols-12">
            <div class="lg:col-span-4">
                <div class="lg:sticky lg:top-40">
                    <p class="eyebrow">Our services</p>
                    <h2 class="section-title">From documentation to deployment</h2>
                    <p class="lead mt-5">Four services, one accountable partner — for employers and for the workers we
                        send overseas.</p>
                </div>
            </div>
            <ol class="lg:col-span-8">
                @foreach ($services as $i => $service)
                    <li class="grid gap-6 border-t border-line py-8 first:border-t-0 first:pt-0 sm:grid-cols-[8.5rem_1fr] sm:gap-8">
                        <img src="{{ asset($service['img']) }}" alt="" loading="lazy"
                            class="aspect-[4/3] w-full rounded-md bg-white object-cover sm:w-[8.5rem]">
                        <div>
                            <div class="flex items-baseline gap-3">
                                <span class="font-display text-sm text-secondary">0{{ $i + 1 }}</span>
                                <h3 class="text-xl">{{ $service['title'] }}</h3>
                            </div>
                            <p class="mt-3 text-[15px] leading-relaxed text-muted">{{ $service['text'] }}</p>
                        </div>
                    </li>
                @endforeach
            </ol>
        </div>
    </section>

    {{-- ============ Current vacancies ============ --}}
    <section class="container py-20 sm:py-24">
        <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
                <p class="eyebrow">Now hiring</p>
                <h2 class="section-title">Our current vacancies</h2>
            </div>
            <a href="/vacancies" wire:navigate class="link self-start sm:self-auto">View all vacancies</a>
        </div>

        @if ($jobs->isNotEmpty())
            <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                @foreach ($jobs as $job)
                    @include('livewire.UsersView.partials.vacancy-card', ['job' => $job])
                @endforeach
            </div>
        @else
            <p class="mt-10 rounded-lg border border-line p-8 text-muted">No jobs are currently available.
                <a href="/apply-now" wire:navigate class="link">Send us your CV</a> and we’ll contact you when a suitable role opens.</p>
        @endif
    </section>

    {{-- ============ Why we are here ============ --}}
    <section class="panel py-20 sm:py-24">
        <div class="container">
            <div class="max-w-2xl">
                <p class="eyebrow">Why we are here</p>
                <h2 class="section-title">Trust, mutual respect and quality service</h2>
            </div>
            <div class="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
                @foreach ($purpose as [$title, $text])
                    <div class="border-t-2 border-accent-tertiary/70 pt-6">
                        <h3 class="text-lg">{{ $title }}</h3>
                        <p class="mt-3 text-[15px] leading-relaxed text-white/75">{{ $text }}</p>
                    </div>
                @endforeach
            </div>
        </div>
    </section>

    {{-- ============ Executive team ============ --}}
    <section class="container py-20 sm:py-24">
        <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
                <p class="eyebrow">Leadership</p>
                <h2 class="section-title">Executive team</h2>
            </div>
            <a href="/expertise-saying" wire:navigate class="link self-start sm:self-auto">Read the message from our expertise</a>
        </div>
        <div class="mt-10 grid gap-6 md:grid-cols-2">
            @foreach ($executives as $exec)
                <figure class="grid overflow-hidden rounded-lg border border-line sm:grid-cols-[13rem_1fr]">
                    <img src="{{ asset($exec['img']) }}" alt="{{ $exec['name'] }}" loading="lazy"
                        class="aspect-[4/3] h-full w-full object-cover object-top sm:aspect-auto">
                    <figcaption class="flex flex-col p-6 sm:p-7">
                        <p class="font-display text-xs font-medium uppercase tracking-[0.14em] text-brand-700">{{ $exec['role'] }}</p>
                        <p class="mt-1 font-display text-xl font-semibold">{{ $exec['name'] }}</p>
                        <blockquote class="mt-4 text-[15px] leading-relaxed text-muted">“Dear Guests, I am delighted to welcome
                            you as {{ $exec['as'] === 'CEO' ? 'the CEO' : 'the chairman' }} of Alzahra Human Resource.”</blockquote>
                    </figcaption>
                </figure>
            @endforeach
        </div>
    </section>

    {{-- ============ Clients ============ --}}
    @if ($companies->isNotEmpty())
        <section class="border-t border-line py-16 sm:py-20">
            <div class="container flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p class="eyebrow">Our clients</p>
                    <h2 class="section-title">Our prestigious clients</h2>
                </div>
                <a href="/clients" wire:navigate class="link self-start sm:self-auto">View all clients</a>
            </div>
            <div class="relative mt-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
                <div class="marquee flex w-max gap-4">
                    @foreach ([0, 1] as $copy)
                        @foreach ($companies as $company)
                            <div class="grid h-24 w-48 shrink-0 place-items-center rounded-md border border-line bg-white px-6" @if ($copy) aria-hidden="true" @endif>
                                <img src="{{ $company->getFirstMediaUrl() }}" alt="{{ $company->name ?? 'Client logo' }}" class="max-h-12 w-auto max-w-full object-contain">
                            </div>
                        @endforeach
                    @endforeach
                </div>
            </div>
        </section>
    @endif

    {{-- ============ Feedback ============ --}}
    <section class="border-t border-line bg-mist py-20 sm:py-24">
        <div class="container">
            <p class="eyebrow">Testimonials</p>
            <h2 class="section-title">Feedback from our happy clients</h2>
            <div class="mt-12 grid gap-6 lg:grid-cols-5">
                <figure class="flex flex-col rounded-lg bg-brand-800 p-8 text-white sm:p-10 lg:col-span-3">
                    <x-glyph name="quote" class="h-8 w-8 text-leaf" />
                    <blockquote class="mt-5 font-display text-lg font-normal leading-relaxed sm:text-[1.3rem] sm:leading-[1.6]">{{ $feedback[0] }}</blockquote>
                </figure>
                <div class="grid gap-6 lg:col-span-2">
                    @foreach (array_slice($feedback, 1) as $quote)
                        <figure class="rounded-lg border border-line bg-white p-6 sm:p-7">
                            <blockquote class="text-[15px] leading-relaxed text-ink/85">“{{ $quote }}”</blockquote>
                        </figure>
                    @endforeach
                </div>
            </div>
        </div>
    </section>
</div>
