<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="scroll-smooth">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description"
        content="Al Zahra Human Resource Consultancy — licensed Nepali recruitment agency placing skilled workers across the Gulf, Malaysia and Europe.">
    <title>{{ isset($title) ? $title . ' · Al Zahra HR' : 'Al Zahra Human Resource Consultancy' }}</title>

    <link rel="icon" href="{{ asset('image/favicon-32x32.png') }}" sizes="32x32" type="image/png">
    <link rel="icon" href="{{ asset('image/favicon-16x16.png') }}" sizes="16x16" type="image/png">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&family=Inter:wght@400;500;600&display=swap"
        rel="stylesheet">

    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        // Brand palette carried over unchanged from the original site (tailwind.config.js + emerald
        // greens used throughout the original views). Tints below are only opacity/lightness steps.
        tailwind.config = {
            theme: {
                container: { center: true, padding: { DEFAULT: '1.25rem', lg: '2rem' } },
                extend: {
                    colors: {
                        primary: '#242a2b',
                        secondary: '#808080',
                        accent: { DEFAULT: '#228B22', secondary: '#006D5B', tertiary: '#32CD32' },
                        grey: '#e8f0f1',
                        leaf: '#a1eaa1',
                        brand: {
                            50: '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0', 300: '#6ee7b7', 400: '#34d399',
                            500: '#10b981', 600: '#059669', 700: '#047857', 800: '#065f46', 900: '#064e3b', 950: '#022c22',
                        },
                        ink: '#242a2b',
                        muted: '#5b6567',
                        sand: '#e8f0f1',
                        mist: '#f3f7f7',
                        line: '#d9e2e3',
                    },
                    fontFamily: {
                        sans: ['Inter', 'system-ui', 'sans-serif'],
                        display: ['Poppins', 'system-ui', 'sans-serif'],
                    },
                    boxShadow: { float: '0 1px 2px rgba(36,42,43,.06), 0 10px 30px -12px rgba(36,42,43,.18)' },
                },
            },
        };
    </script>
    <style type="text/tailwindcss">
        @layer base {
            body { @apply bg-white text-ink font-sans text-[16px] leading-relaxed antialiased; }
            h1, h2, h3, h4 { @apply font-display font-semibold text-ink tracking-[-0.01em]; }
        }
        @layer components {
            .container { max-width: 76rem; }
            .accent { color: inherit; font: inherit; }
            .on-dark :is(h1,h2,h3,h4), .panel :is(h1,h2,h3,h4) { @apply text-white; }
            .eyebrow { @apply font-display text-[13px] font-medium uppercase tracking-[0.14em] text-brand-700; }
            .on-dark .eyebrow, .panel .eyebrow { @apply text-leaf; }
            .section-title { @apply mt-3 text-[1.9rem] leading-[1.2] sm:text-[2.4rem]; }
            .lead { @apply text-[17px] leading-relaxed text-muted; }
            .btn { @apply inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 font-display text-[15px] font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 disabled:opacity-60; }
            .btn-primary { @apply btn bg-brand-700 text-white hover:bg-brand-800; }
            .btn-ghost { @apply btn border border-ink/20 bg-white text-ink hover:border-brand-700 hover:text-brand-700; }
            .btn-light { @apply btn bg-white text-brand-800 hover:bg-mist; }
            .btn-on-dark { @apply btn border border-white/40 text-white hover:border-white hover:bg-white/5; }
            .link { @apply font-display font-medium text-brand-700 underline decoration-brand-700/30 underline-offset-4 transition hover:decoration-brand-700; }
            .card { @apply rounded-lg border border-line bg-white; }
            .tile { @apply rounded-lg bg-grey; }
            .panel { @apply bg-brand-900 text-white; }
            .field { @apply block w-full rounded-md border border-line bg-white px-4 py-3 text-[15px] text-ink placeholder:text-secondary transition focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/15; }
            .label { @apply mb-1.5 block font-display text-sm font-medium text-ink; }
            .error { @apply mt-1.5 block text-xs text-red-600; }
            .prose-body p + p { @apply mt-4; }
        }
        .marquee { animation: marquee 40s linear infinite; }
        .marquee:hover { animation-play-state: paused; }
        @keyframes marquee { to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) { .marquee { animation: none; } }
        [x-cloak] { display: none !important; }
    </style>
</head>

<body class="flex min-h-screen flex-col">
    <livewire:header />

    <main class="flex-1">
        {{ $slot }}
    </main>

    <livewire:footer />
</body>

</html>
