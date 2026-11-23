<div x-data="{ preview: null }">
    <x-page-header :title="$event" eyebrow="Event gallery" parent="Events" parent-url="/events" />

    <section class="container py-20">
        @if ($photos->isNotEmpty())
            <div class="columns-1 gap-4 sm:columns-2 lg:columns-3">
                @foreach ($photos as $photo)
                    @php($url = $photo->getFirstMediaUrl('default'))
                    <button type="button" @click="preview = @js($url)" class="mb-4 block w-full overflow-hidden rounded-md">
                        <img src="{{ $url }}" alt="{{ $event }} photo" loading="lazy"
                            class="w-full transition duration-500 hover:scale-[1.03]">
                    </button>
                @endforeach
            </div>
        @else
            <p class="card p-10 text-center text-muted">No photos in this event yet.</p>
        @endif
    </section>

    <div x-cloak x-show="preview" x-transition.opacity @click="preview = null" @keydown.escape.window="preview = null"
        class="fixed inset-0 z-50 grid place-items-center bg-ink/85 p-6 backdrop-blur-sm">
        <img :src="preview" alt="" class="max-h-full max-w-full rounded shadow-2xl">
    </div>
</div>
