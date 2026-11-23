@php
    // Sections and fields as in the original apply form.
    $groups = [
        'User information' => [
            ['userName', 'Full name', 'text', 'name', 'Full name'],
            ['email', 'Email address', 'email', 'email', 'Email'],
            ['firstName', 'First name', 'text', 'given-name', 'First name'],
            ['lastName', 'Last name', 'text', 'family-name', 'Last name'],
        ],
        'Contact information' => [
            ['address', 'Address', 'text', 'street-address', 'Address'],
            ['city', 'City', 'text', 'address-level2', 'City'],
            ['country', 'Country', 'text', 'country-name', 'Country'],
            ['phoneNumber', 'Phone number', 'tel', 'tel', '+977-phone no'],
        ],
    ];
    $uploads = [
        ['cv', 'Upload a C.V', 'C.V'],
        ['passport', 'Upload scanned passport', 'Passport'],
        ['photo', 'Upload your latest photo', 'Photo'],
    ];
@endphp

<div>
    <x-page-header title="Apply form" eyebrow="Apply now">
        Fill in your details and upload your documents. We will respond soon after reviewing your application.
    </x-page-header>

    <section class="container grid gap-10 py-16 sm:py-20 lg:grid-cols-12 lg:gap-14">
        <aside class="lg:col-span-4">
            <div class="rounded-lg bg-grey p-6 sm:p-8 lg:sticky lg:top-40">
                <h2 class="text-lg">What you will need</h2>
                <ul class="mt-5 space-y-4 text-[15px]">
                    @foreach (['Your personal and contact details', 'The company name and job title you want to apply for', 'Your C.V, a scanned passport and your latest photo — up to 1 MB each'] as $i => $item)
                        <li class="flex gap-3">
                            <span class="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-700 font-display text-xs font-medium text-white">{{ $i + 1 }}</span>
                            {{ $item }}
                        </li>
                    @endforeach
                </ul>
                <p class="mt-6 border-t border-line pt-5 text-sm text-muted">Looking for a specific job?
                    <a href="/vacancies" wire:navigate class="link">See current vacancies</a></p>
            </div>
        </aside>

        <form wire:submit="applyNow" class="space-y-6 lg:col-span-8">
            @if (session('success'))
                <p class="flex items-center gap-2 rounded-md bg-brand-50 px-4 py-3 text-sm text-brand-800">
                    <x-glyph name="check" class="h-4 w-4" />{{ session('success') }}</p>
            @endif
            @if (session('error'))
                <p class="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{{ session('error') }}</p>
            @endif

            @foreach ($groups as $heading => $fields)
                <fieldset class="rounded-lg border border-line p-6 sm:p-8">
                    <legend class="sr-only">{{ $heading }}</legend>
                    <h2 class="text-lg">{{ $heading }}</h2>
                    <div class="mt-6 grid gap-5 sm:grid-cols-2">
                        @foreach ($fields as [$model, $label, $type, $autocomplete, $placeholder])
                            <div>
                                <label for="{{ $model }}" class="label">{{ $label }}</label>
                                <input id="{{ $model }}" type="{{ $type }}" wire:model="{{ $model }}" autocomplete="{{ $autocomplete }}"
                                    placeholder="{{ $placeholder }}" class="field">
                                @error($model) <span class="error">{{ $message }}</span> @enderror
                            </div>
                        @endforeach
                    </div>
                </fieldset>
            @endforeach

            <fieldset class="rounded-lg border border-line p-6 sm:p-8">
                <legend class="sr-only">Job description</legend>
                <h2 class="text-lg">Job description</h2>
                <label for="aboutMe" class="label mt-6">About yourself</label>
                <textarea id="aboutMe" wire:model="aboutMe" rows="4" class="field resize-none"
                    placeholder="Please write company name and job title for which you want to apply"></textarea>
                @error('aboutMe') <span class="error">{{ $message }}</span> @enderror

                <div class="mt-8 grid gap-4 sm:grid-cols-3">
                    @foreach ($uploads as [$key, $label, $short])
                        <div>
                            <label for="{{ $key }}" @class([
                                'flex h-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed px-4 py-7 text-center transition hover:border-brand-700 hover:bg-mist',
                                'border-brand-700 bg-mist' => $this->{$key},
                                'border-ink/25' => !$this->{$key},
                            ])>
                                <span wire:loading.remove wire:target="{{ $key }}" class="text-brand-700">
                                    <x-glyph :name="$this->{$key} ? 'check' : 'upload'" class="h-6 w-6" /></span>
                                <span wire:loading wire:target="{{ $key }}" class="text-brand-700">
                                    <x-glyph name="spinner" class="h-6 w-6 animate-spin" /></span>
                                <span class="mt-3 font-display text-sm font-medium">{{ $label }}</span>
                                <span class="mt-1 w-full truncate text-xs text-muted">
                                    {{ $this->{$key} && method_exists($this->{$key}, 'getClientOriginalName') ? $this->{$key}->getClientOriginalName() : 'or drag and drop, up to 1 MB' }}
                                </span>
                                <input id="{{ $key }}" type="file" wire:model="{{ $key }}" class="sr-only">
                            </label>
                            @error($key) <span class="error">{{ $message }}</span> @enderror
                        </div>
                    @endforeach
                </div>
            </fieldset>

            <div class="flex justify-end">
                <button type="submit" wire:loading.attr="disabled" class="btn-primary w-full px-8 sm:w-auto">
                    <x-glyph name="spinner" class="h-4 w-4 animate-spin" wire:loading wire:target="applyNow" />
                    <span wire:loading.remove wire:target="applyNow">Apply now</span>
                    <span wire:loading wire:target="applyNow">Processing…</span>
                </button>
            </div>
        </form>
    </section>
</div>
