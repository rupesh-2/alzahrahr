<div>
    <x-page-header title="Get in touch with us" eyebrow="Al Zahra Human Resource Consultancy Pvt. Ltd welcomes you">
        At Al Zahra Human Resource Consultancy, we pride ourselves on delivering unparalleled expertise to our clients. We
        invite you to experience our services firsthand. Please do not hesitate to contact us to discuss how we can
        assist you in achieving your goals.
    </x-page-header>

    <section class="container grid gap-10 py-16 sm:py-20 lg:grid-cols-12 lg:gap-14">
        <div class="lg:col-span-5">
            <dl class="divide-y divide-line border-y border-line">
                @if ($location)
                    <div class="flex gap-4 py-6">
                        <x-glyph name="pin" class="mt-1 h-5 w-5 text-brand-700" />
                        <div>
                            <dt class="font-display font-medium">Our address</dt>
                            <dd class="mt-1 text-muted">{{ $location }}</dd>
                        </div>
                    </div>
                @endif
                <div class="flex gap-4 py-6">
                    <x-glyph name="phone" class="mt-1 h-5 w-5 text-brand-700" />
                    <div>
                        <dt class="font-display font-medium">Contact</dt>
                        @if ($primaryContact)
                            <dd class="mt-1 text-muted">Contact no: <a href="tel:{{ preg_replace('/[^\d+]/', '', $primaryContact) }}" class="text-ink hover:text-brand-700">{{ $primaryContact }}</a></dd>
                        @endif
                        @if ($company_email)
                            <dd class="mt-1 text-muted">Mail: <a href="mailto:{{ $company_email }}" class="text-ink hover:text-brand-700">{{ $company_email }}</a></dd>
                        @endif
                    </div>
                </div>
                <div class="flex gap-4 py-6">
                    <x-glyph name="clock" class="mt-1 h-5 w-5 text-brand-700" />
                    <div>
                        <dt class="font-display font-medium">Working hours</dt>
                        <dd class="mt-1 text-muted">Sunday – Friday (10 am – 6 pm)</dd>
                    </div>
                </div>
            </dl>
            <img src="{{ asset('image/AdminPanelLogo-removebg-preview.png') }}" alt="Al Zahra Human Resource Consultancy" class="mt-10 h-12 w-auto opacity-90">
        </div>

        <form wire:submit="contactUs" class="rounded-lg border border-line p-6 sm:p-10 lg:col-span-7">
            <h2 class="text-[1.6rem]">Ready to get started?</h2>
            <p class="mt-2 text-muted">Send us a message and our team will respond.</p>

            @if (session('success'))
                <p class="mt-6 flex items-center gap-2 rounded-md bg-brand-50 px-4 py-3 text-sm text-brand-800">
                    <x-glyph name="check" class="h-4 w-4" />{{ session('success') }}</p>
            @endif

            <div class="mt-8 grid gap-5 sm:grid-cols-2">
                <div>
                    <label for="name" class="label">Name</label>
                    <input id="name" type="text" wire:model="name" class="field" placeholder="Your name" autocomplete="name">
                    @error('name') <span class="error">{{ $message }}</span> @enderror
                </div>
                <div>
                    <label for="email" class="label">Email</label>
                    <input id="email" type="email" wire:model="email" class="field" placeholder="Your email address" autocomplete="email">
                    @error('email') <span class="error">{{ $message }}</span> @enderror
                </div>
                <div class="sm:col-span-2">
                    <label for="message" class="label">Message</label>
                    <textarea id="message" wire:model="message" rows="6" class="field resize-none" placeholder="Write your message..."></textarea>
                    @error('message') <span class="error">{{ $message }}</span> @enderror
                </div>
            </div>

            <button type="submit" wire:loading.attr="disabled" class="btn-primary mt-8 w-full sm:w-auto">
                <x-glyph name="spinner" class="h-4 w-4 animate-spin" wire:loading wire:target="contactUs" />
                Send message
            </button>
        </form>
    </section>
</div>
