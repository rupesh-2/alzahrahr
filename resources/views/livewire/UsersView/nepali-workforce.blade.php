@php
    $reasons = [
        ['Reliable and skilled', 'Nepali workers are highly valued for their reliability, discipline, and skills, making them sought after in various industries. Factors like a strong work ethic, adaptability, and a reputation for dedication contribute to the demand for Nepali labor globally. Industries such as construction, hospitality, and security benefit from the qualities that Nepali workers bring to the workforce.'],
        ['Trusted in security roles', 'Nepali workers are also sought after for security-related roles. Many Nepali individuals are employed as security guards in the Middle East due to their reputation for discipline, reliability, and training received from the Gurkha regiment.'],
        ['Quick to adapt', 'Nepali workers often find it easier to adapt to the cultural and linguistic environment in the Middle East, making them preferable candidates for certain jobs.'],
    ];
@endphp

<div>
    <x-page-header title="Why Nepali work force?" eyebrow="Who we are" />

    <section class="container py-16 sm:py-20">
        <div class="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
            <img src="{{ asset('image/Culture-in-Nepal.jpg') }}" alt="Culture in Nepal"
                class="aspect-[16/10] w-full rounded-lg object-cover lg:col-span-7">
            <div class="lg:col-span-5">
                <p class="eyebrow">Demand for Nepali workforce</p>
                <h2 class="section-title">Disciplined, dependable and in demand worldwide</h2>
                <a href="/contacts" wire:navigate class="btn-primary mt-8">Hire Nepali workers</a>
            </div>
        </div>

        <div class="mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
            @foreach ($reasons as $i => [$title, $text])
                <div class="border-t-2 border-brand-700 pt-6">
                    <span class="font-display text-sm text-secondary">0{{ $i + 1 }}</span>
                    <h3 class="mt-2 text-lg">{{ $title }}</h3>
                    <p class="mt-3 text-[15px] leading-relaxed text-muted">{{ $text }}</p>
                </div>
            @endforeach
        </div>
    </section>
</div>
