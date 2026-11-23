@php
    $facts = [
        ['Licence', 'Recruitment licence no. 1657/080/081, Government of Nepal'],
        ['Head office', 'Kathmandu, Nepal'],
        ['Recruiting for', 'Saudi Arabia, Dubai, Qatar, Bahrain, Kuwait, Oman, Malaysia and Europe'],
        ['Experience', 'Recruiting workers for over 10 years'],
    ];
    $purpose = [
        ['Mission', 'Our mission statement is to achieve the vision envisaged, i.e. to exploit the extensive foreign employment opportunities to enhance the progressive indices of economic growth through quality and fully contained services to foreign employers as per their requirements.'],
        ['Vision', 'Our vision is to lead in the creation and delivery of innovative workforce solutions and services that enable our clients to win in the changing world of work.'],
        ['Value', 'To explore foreign employment opportunities in favour of Nepalese labour potential. To export the Nepalese workforce on the ground of trust, mutual respect and all types of human security. To enhance the quality and competencies of Nepalese services as per international standards.'],
    ];
@endphp

<div>
    <x-page-header title="About us" eyebrow="Who we are" />

    <section class="container grid gap-12 py-16 sm:py-20 lg:grid-cols-12 lg:gap-16">
        <div class="lg:col-span-5">
            <img src="{{ asset('image/about.jpg') }}" alt="Workers fixing steel beams on a construction site"
                class="aspect-[4/5] w-full rounded-lg object-cover">
        </div>

        <div class="lg:col-span-7 lg:pt-4">
            <h2 class="text-[1.75rem] leading-snug sm:text-[2rem]">Quality services, at the right time</h2>
            <div class="prose-body mt-6 text-[17px] leading-relaxed text-ink/85">
                <p>We are Alzahra Human Resources Consultancy Ltd, holding Recruitment License No. 1657/080/081 from the
                    Government of Nepal, located in Kathmandu, Nepal.</p>
                <p>Owing to our specialized, strict, diligent and responsible working attitude, highly effective teamwork
                    spirit, experience and network throughout the Gulf countries, we are confident in providing quality
                    services. We have been recruiting workers for Saudi Arabia, Dubai, Qatar, Bahrain, Kuwait, Oman,
                    Malaysia and Europe for the last 10 years.</p>
                <p>We can supply workers as per your requirements, and we assure you that we can provide good services at
                    the right time.</p>
            </div>

            <dl class="mt-10 grid border-t border-line sm:grid-cols-2">
                @foreach ($facts as $i => [$term, $detail])
                    <div class="border-b border-line py-5 {{ $i % 2 ? 'sm:pl-6 sm:border-l' : 'sm:pr-6' }}">
                        <dt class="font-display text-xs font-medium uppercase tracking-[0.14em] text-brand-700">{{ $term }}</dt>
                        <dd class="mt-2 text-[15px]">{{ $detail }}</dd>
                    </div>
                @endforeach
            </dl>

            <div class="mt-10 flex flex-wrap gap-3">
                <a href="/contacts" wire:navigate class="btn-primary">Contact us</a>
                <a href="/our-certificates" wire:navigate class="btn-ghost">Our certificates</a>
            </div>
        </div>
    </section>

    <section class="panel py-16 sm:py-20">
        <div class="container">
            <p class="eyebrow">Why we are here</p>
            <div class="mt-8 grid gap-10 md:grid-cols-3 md:gap-8">
                @foreach ($purpose as [$heading, $text])
                    <div class="border-t-2 border-accent-tertiary/70 pt-6">
                        <h2 class="text-lg">{{ $heading }}</h2>
                        <p class="mt-3 text-[15px] leading-relaxed text-white/75">{{ $text }}</p>
                    </div>
                @endforeach
            </div>
        </div>
    </section>
</div>
