<div>
    @if (!$job)
        <x-page-header title="Vacancy not found" parent="Vacancies" parent-url="/vacancies">
            This position may have been filled or removed.
        </x-page-header>
    @else
        @php
            $openings = (int) $job->male_required + (int) $job->female_required;
            $details = array_filter([
                'Location' => $job->location,
                'Company name' => $job->company_name,
                'Required total employees' => $openings > 0 ? "{$openings} (Male {$job->male_required}, Female {$job->female_required})" : null,
                'Salary' => $job->salary,
                'Min. qualification' => $job->minimun_qualification,
            ]);
            $points = array_filter(array_map('trim', preg_split('/\r\n|\r|\n/', (string) $job->job_description)));
            $image = $job->getFirstMediaUrl();
        @endphp

        <x-page-header :title="$job->job_title ?: 'Job opening'" parent="Vacancies" parent-url="/vacancies" />

        <section class="container grid gap-10 py-16 lg:grid-cols-5">
            <div class="lg:col-span-3">
                @if ($image)
                    <img src="{{ $image }}" alt="{{ $job->job_title }}" class="w-full rounded-md border border-line">
                @endif

                @if ($points)
                    <h2 class="{{ $image ? 'mt-12' : '' }} text-2xl font-medium">Job description:</h2>
                    <ul class="mt-5 space-y-3">
                        @foreach ($points as $point)
                            <li class="flex gap-3 leading-relaxed text-ink/85">
                                <span class="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"></span>{{ $point }}
                            </li>
                        @endforeach
                    </ul>
                @endif
            </div>

            <aside class="lg:col-span-2">
                <div class="card sticky top-32 p-6">
                    <h2 class="font-sans text-sm font-semibold uppercase tracking-wider text-muted">At a glance</h2>
                    @if ($details)
                        <dl class="mt-4 divide-y divide-line">
                            @foreach ($details as $label => $value)
                                <div class="flex justify-between gap-4 py-3 text-sm">
                                    <dt class="text-muted">{{ $label }}</dt>
                                    <dd class="text-right font-medium">{{ $value }}</dd>
                                </div>
                            @endforeach
                        </dl>
                    @endif
                    <a href="/apply-now" wire:navigate class="btn-primary mt-6 w-full">Apply now
                        <x-glyph name="arrow-right" class="h-4 w-4" /></a>
                    <p class="mt-3 text-center text-xs text-muted">Mention the job title in your application.</p>
                </div>
            </aside>
        </section>
    @endif
</div>
