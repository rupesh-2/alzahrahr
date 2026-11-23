@props(['title', 'accent' => null, 'eyebrow' => null, 'parent' => null, 'parentUrl' => null])

@php($fullTitle = trim($title . ' ' . $accent))

<section class="bg-grey">
    <div class="container py-12 sm:py-16">
        <nav aria-label="Breadcrumb" class="flex flex-wrap items-center gap-1.5 text-sm text-muted">
            <a href="/" wire:navigate class="hover:text-brand-700">Home</a>
            @if ($parent)
                <x-glyph name="chevron-right" class="h-3.5 w-3.5" />
                <a href="{{ $parentUrl }}" wire:navigate class="hover:text-brand-700">{{ $parent }}</a>
            @endif
            <x-glyph name="chevron-right" class="h-3.5 w-3.5" />
            <span class="text-ink" aria-current="page">{{ $fullTitle }}</span>
        </nav>
        @if ($eyebrow)
            <p class="eyebrow mt-8">{{ $eyebrow }}</p>
        @endif
        <h1 class="{{ $eyebrow ? 'mt-3' : 'mt-8' }} max-w-3xl text-[2.2rem] leading-[1.15] sm:text-[2.9rem]">{{ $fullTitle }}</h1>
        @if (trim($slot))
            <p class="lead mt-4 max-w-2xl">{{ $slot }}</p>
        @endif
    </div>
</section>
