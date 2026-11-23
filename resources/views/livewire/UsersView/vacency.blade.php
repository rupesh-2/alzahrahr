<div>
    <x-page-header title="Vacancies" eyebrow="Latest jobs">
        Current openings with our partner employers abroad. Don’t see a fit? Send us your CV anyway.
    </x-page-header>

    <section class="container py-20">
        @if ($jobs->isNotEmpty())
            <p class="text-sm text-muted">{{ $jobs->count() }} open {{ Str::plural('position', $jobs->count()) }}</p>
            <div class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                @foreach ($jobs as $job)
                    @include('livewire.UsersView.partials.vacancy-card', ['job' => $job])
                @endforeach
            </div>
        @else
            <div class="card p-10 text-center">
                <p class="font-display text-xl">No open vacancies right now</p>
                <p class="mt-2 text-sm text-muted">New roles are posted every week. Send us your CV and we’ll be in touch.</p>
                <a href="/apply-now" wire:navigate class="btn-primary mt-6">Submit your CV</a>
            </div>
        @endif
    </section>
</div>
