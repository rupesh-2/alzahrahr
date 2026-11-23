<div>
    <x-page-header title="Latest events" eyebrow="Events">
        Photos from our events and activities.
    </x-page-header>

    <section class="container py-20">
        @if ($events->isNotEmpty())
            <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                @foreach ($events as $event)
                    <a href="/photos/{{ $event->id }}" wire:navigate
                        class="group relative block aspect-[4/3] overflow-hidden rounded-md bg-sand">
                        <img src="{{ $event->getFirstMediaUrl() }}" alt="{{ $event->name }}" loading="lazy"
                            class="h-full w-full object-cover transition duration-500 group-hover:scale-105">
                        <div class="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent"></div>
                        <div class="absolute inset-x-0 bottom-0 p-5 text-white">
                            <p class="flex items-center gap-1.5 text-xs text-white/70"><x-glyph name="image" class="h-3.5 w-3.5" />
                                {{ $event->photos->count() }} photos</p>
                            <h2 class="mt-1 font-sans text-lg font-semibold text-white">{{ $event->name }}</h2>
                            @if ($event->description)
                                <p class="mt-1 line-clamp-2 text-sm text-white/80">{{ $event->description }}</p>
                            @endif
                        </div>
                    </a>
                @endforeach
            </div>
        @else
            <p class="card p-10 text-center text-muted">No events to show yet.</p>
        @endif
    </section>
</div>
