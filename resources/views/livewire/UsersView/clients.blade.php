<div>
    <x-page-header title="Our clients" eyebrow="Our prestigious clients">
        Employers we proudly supply, grouped by country.
    </x-page-header>

    <section class="container space-y-14 py-20">
        @forelse ($clients as $client)
            <div>
                <div class="flex items-baseline justify-between border-b border-line pb-3">
                    <h2 class="text-2xl font-medium">{{ $client->country_name }}</h2>
                    <span class="text-sm text-muted">{{ $client->companies->count() }} clients</span>
                </div>
                <div class="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    @foreach ($client->companies as $company)
                        <div class="card grid aspect-[3/2] place-items-center p-5 transition hover:border-brand-200 ">
                            <img src="{{ $company->getFirstMediaUrl() }}" alt="{{ $company->name ?? 'Client logo' }}"
                                loading="lazy" class="max-h-full max-w-full object-contain">
                        </div>
                    @endforeach
                </div>
            </div>
        @empty
            <p class="card p-10 text-center text-muted">Client list coming soon.</p>
        @endforelse
    </section>
</div>
