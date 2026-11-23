@php
    $openings = (int) $job->male_required + (int) $job->female_required;
    $image = $job->getFirstMediaUrl();
@endphp

<a href="/vacancy/{{ $job->id }}" wire:navigate
    class="group flex flex-col overflow-hidden rounded-lg border border-line bg-white transition hover:border-brand-700/40 hover:shadow-float">
    <div class="aspect-[4/3] overflow-hidden border-b border-line bg-grey">
        @if ($image)
            <img src="{{ $image }}" alt="{{ $job->job_title ?: 'Job advertisement' }}" loading="lazy"
                class="h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.02]">
        @else
            <div class="flex h-full flex-col items-center justify-center gap-2 text-brand-700/60">
                <x-glyph name="briefcase" class="h-9 w-9" />
                <span class="font-display text-xs uppercase tracking-[0.14em]">{{ $job->location ?: 'Overseas' }}</span>
            </div>
        @endif
    </div>
    <div class="flex flex-1 flex-col p-5">
        <h3 class="text-[17px] leading-snug">{{ $job->job_title ?: 'Job opening' }}</h3>
        <dl class="mt-3 grid gap-1.5 text-sm text-muted">
            @if ($job->location)
                <div class="flex items-center gap-2"><x-glyph name="pin" class="h-4 w-4" /><dt class="sr-only">Location</dt><dd>{{ $job->location }}</dd></div>
            @endif
            @if ($openings > 0)
                <div class="flex items-center gap-2"><x-glyph name="users" class="h-4 w-4" /><dt class="sr-only">Vacancies</dt><dd>Vacancies: {{ $openings }}</dd></div>
            @endif
        </dl>
        <span class="mt-auto flex items-center gap-1.5 pt-5 font-display text-sm font-medium text-brand-700">Read more
            <x-glyph name="arrow-right" class="h-4 w-4 transition group-hover:translate-x-1" /></span>
    </div>
</a>
