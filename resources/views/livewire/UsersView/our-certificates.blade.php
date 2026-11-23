@php
    $certificates = [
        ['img' => 'image/companyreg.jpg', 'title' => 'Company registration'],
        ['img' => 'image/foriegnemp.jpg', 'title' => 'Foreign employment licence'],
        ['img' => 'image/pan.jpg', 'title' => 'PAN registration'],
    ];
@endphp

<div x-data="{ preview: null }">
    <x-page-header title="Our certificates" eyebrow="Who we are">
        Fully licensed and registered with the Government of Nepal.
    </x-page-header>

    <section class="container grid gap-6 py-20 sm:grid-cols-2 lg:grid-cols-3">
        @foreach ($certificates as $cert)
            <button type="button" @click="preview = @js(asset($cert['img']))"
                class="group card overflow-hidden text-left transition hover:border-ink/30">
                <div class="aspect-[3/4] overflow-hidden bg-sand p-4">
                    <img src="{{ asset($cert['img']) }}" alt="{{ $cert['title'] }}" loading="lazy"
                        class="h-full w-full rounded-lg object-contain transition duration-500 group-hover:scale-[1.02]">
                </div>
                <p class="border-t border-line px-5 py-4 text-sm font-medium">{{ $cert['title'] }}</p>
            </button>
        @endforeach
    </section>

    <div x-cloak x-show="preview" x-transition.opacity @click="preview = null" @keydown.escape.window="preview = null"
        class="fixed inset-0 z-50 grid place-items-center bg-ink/80 p-6 backdrop-blur-sm">
        <img :src="preview" alt="" class="max-h-full max-w-full rounded shadow-2xl">
    </div>
</div>
