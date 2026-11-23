@php
    $links = [
        ['label' => 'Home', 'url' => '/'],
        ['label' => 'Vacancies', 'url' => '/vacancies'],
        ['label' => 'Clients', 'url' => '/clients'],
        ['label' => 'Events', 'url' => '/events'],
        ['label' => 'Contacts', 'url' => '/contacts'],
    ];
    $about = [
        ['label' => 'About us', 'url' => '/about-us', 'desc' => 'Our licence, experience and reach'],
        ['label' => 'Message from our expertise', 'url' => '/expertise-saying', 'desc' => 'A welcome from our executive team'],
        ['label' => 'Why Nepali workforce', 'url' => '/nepali-workers', 'desc' => 'Why employers choose Nepali workers'],
        ['label' => 'Our certificates', 'url' => '/our-certificates', 'desc' => 'Registration and licences'],
    ];
    $isActive = fn($url) => $url === '/' ? request()->is('/') : request()->is(ltrim($url, '/') . '*');
    $aboutActive = collect($about)->contains(fn($a) => $isActive($a['url']));
    $tel = $contact ? preg_replace('/[^\d+]/', '', $contact) : null;
@endphp

<header x-data="{ open: false }" @keydown.escape.window="open = false" class="sticky top-0 z-40">
    {{-- Utility bar --}}
    <div class="hidden bg-brand-800 text-[13px] text-white/85 md:block">
        <div class="container flex h-10 items-center justify-between gap-6">
            <div class="flex items-center gap-6">
                @if ($location)
                    <span class="flex items-center gap-2"><x-glyph name="pin" class="h-4 w-4 text-leaf" />{{ $location }}</span>
                @endif
                @if ($contact)
                    <a href="tel:{{ $tel }}" class="flex items-center gap-2 hover:text-white"><x-glyph name="phone" class="h-4 w-4 text-leaf" />{{ $contact }}</a>
                @endif
                <span class="hidden items-center gap-2 lg:flex"><x-glyph name="clock" class="h-4 w-4 text-leaf" />Sunday – Friday, 10 am – 6 pm</span>
            </div>
            <a href="{{ route('download.pdf') }}" class="flex items-center gap-2 font-display font-medium text-white hover:text-leaf">
                <x-glyph name="download" class="h-4 w-4" />Company profile</a>
        </div>
    </div>

    {{-- Main bar --}}
    <div class="border-b border-line bg-white">
        <div class="container flex h-[72px] items-center justify-between gap-8 lg:h-[84px]">
            <a href="/" wire:navigate class="shrink-0">
                <img src="{{ asset('image/AdminPanelLogo-removebg-preview.png') }}" alt="Al Zahra Human Resource Consultancy"
                    class="h-9 w-auto lg:h-11">
            </a>

            <nav class="hidden items-center gap-1 lg:flex" aria-label="Main">
                @foreach ($links as $i => $link)
                    <a href="{{ $link['url'] }}" wire:navigate @class([
                        'relative px-3 py-2 font-display text-[15px] transition',
                        'text-brand-700 after:absolute after:inset-x-3 after:-bottom-[23px] after:h-0.5 after:bg-brand-700' => $isActive($link['url']),
                        'text-ink hover:text-brand-700' => !$isActive($link['url']),
                    ])>{{ $link['label'] }}</a>

                    @if ($i === 0)
                        <div class="relative" x-data="{ drop: false }" @mouseenter="drop = true" @mouseleave="drop = false">
                            <button type="button" @click="drop = !drop" :aria-expanded="drop" @class([
                                'flex items-center gap-1 px-3 py-2 font-display text-[15px] transition hover:text-brand-700',
                                'text-brand-700' => $aboutActive,
                                'text-ink' => !$aboutActive,
                            ])>
                                Who we are <x-glyph name="chevron-down" class="h-4 w-4 transition" ::class="drop && 'rotate-180'" />
                            </button>
                            <div x-cloak x-show="drop" x-transition.origin.top @click.outside="drop = false"
                                class="absolute left-0 top-full w-80 pt-[22px]">
                                <div class="rounded-lg border border-line bg-white p-2 shadow-float">
                                    @foreach ($about as $item)
                                        <a href="{{ $item['url'] }}" wire:navigate class="block rounded-md px-4 py-3 transition hover:bg-mist">
                                            <span class="block font-display text-[15px] font-medium text-ink">{{ $item['label'] }}</span>
                                            <span class="block text-[13px] text-muted">{{ $item['desc'] }}</span>
                                        </a>
                                    @endforeach
                                </div>
                            </div>
                        </div>
                    @endif
                @endforeach
            </nav>

            <div class="flex items-center gap-3">
                <a href="/apply-now" wire:navigate class="btn-primary hidden sm:inline-flex">Apply now</a>
                <button type="button" @click="open = !open" :aria-expanded="open" aria-label="Toggle menu"
                    class="grid h-11 w-11 place-items-center rounded-md border border-line lg:hidden">
                    <x-glyph name="menu" class="h-5 w-5" x-show="!open" />
                    <x-glyph name="x" class="h-5 w-5" x-show="open" x-cloak />
                </button>
            </div>
        </div>

        {{-- Mobile menu --}}
        <div x-cloak x-show="open" x-transition.opacity class="border-t border-line lg:hidden">
            <nav class="container grid gap-1 py-4" aria-label="Mobile">
                @foreach ($links as $link)
                    <a href="{{ $link['url'] }}" wire:navigate @click="open = false"
                        class="rounded-md px-3 py-2.5 font-display text-[15px] {{ $isActive($link['url']) ? 'bg-mist text-brand-700' : 'text-ink' }}">{{ $link['label'] }}</a>
                @endforeach
                <p class="mt-3 px-3 text-xs font-medium uppercase tracking-[0.14em] text-secondary">Who we are</p>
                @foreach ($about as $link)
                    <a href="{{ $link['url'] }}" wire:navigate @click="open = false"
                        class="rounded-md px-3 py-2.5 font-display text-[15px] {{ $isActive($link['url']) ? 'bg-mist text-brand-700' : 'text-ink' }}">{{ $link['label'] }}</a>
                @endforeach
                <div class="mt-4 grid gap-2 border-t border-line px-3 pt-4 text-sm text-muted">
                    @if ($location)<span class="flex items-center gap-2"><x-glyph name="pin" class="h-4 w-4" />{{ $location }}</span>@endif
                    @if ($contact)<a href="tel:{{ $tel }}" class="flex items-center gap-2"><x-glyph name="phone" class="h-4 w-4" />{{ $contact }}</a>@endif
                    <a href="{{ route('download.pdf') }}" class="flex items-center gap-2"><x-glyph name="download" class="h-4 w-4" />Company profile</a>
                </div>
                <a href="/apply-now" wire:navigate @click="open = false" class="btn-primary mt-4">Apply now</a>
            </nav>
        </div>
    </div>
</header>
