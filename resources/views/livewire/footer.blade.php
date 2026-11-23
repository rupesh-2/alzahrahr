@php
    $tel = $primaryContact ? preg_replace('/[^\d+]/', '', $primaryContact) : null;
@endphp

<footer>
    {{-- Enquiry band --}}
    @unless (request()->is('apply-now') || request()->is('contacts'))
        <section class="bg-grey">
            <div class="container grid items-center gap-8 py-14 lg:grid-cols-12 lg:py-16">
                <div class="lg:col-span-5">
                    <p class="eyebrow">Get in touch with us</p>
                    <h2 class="section-title">Ready to get started?</h2>
                </div>
                <div class="grid gap-4 sm:grid-cols-2 lg:col-span-7">
                    <div class="rounded-lg bg-white p-6">
                        <p class="font-display text-[15px] font-medium">Employers</p>
                        <p class="mt-1 text-sm text-muted">Send us your requirement and our team will respond.</p>
                        <div class="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
                            <a href="/contacts" wire:navigate class="btn-primary">Send an enquiry</a>
                            @if ($primaryContact)
                                <a href="tel:{{ $tel }}" class="flex items-center gap-2 font-display text-sm font-medium text-ink hover:text-brand-700">
                                    <x-glyph name="phone" class="h-4 w-4" />{{ $primaryContact }}</a>
                            @endif
                        </div>
                    </div>
                    <div class="rounded-lg bg-white p-6">
                        <p class="font-display text-[15px] font-medium">Job seekers</p>
                        <p class="mt-1 text-sm text-muted">Apply online with your CV, passport and photo.</p>
                        <div class="mt-5 flex flex-wrap gap-3">
                            <a href="/apply-now" wire:navigate class="btn-primary">Apply now</a>
                            <a href="/vacancies" wire:navigate class="btn-ghost">Vacancies</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    @endunless

    <div class="panel">
        <div class="container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12 lg:py-16">
            <div class="lg:col-span-3">
                <img src="{{ asset('image/AdminPanelLogo-removebg-preview.png') }}" alt="Al Zahra Human Resource Consultancy"
                    class="h-10 w-auto rounded bg-white px-3 py-2">
                <p class="mt-5 max-w-xs text-sm leading-relaxed text-white/70">Alzahra Human Resource Consultancy Pvt. Ltd.
                    Recruitment licence no. 1657/080/081, Government of Nepal.</p>
                <nav class="mt-6 grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-white/80" aria-label="Footer">
                    <a href="/about-us" wire:navigate class="hover:text-white">About us</a>
                    <a href="/vacancies" wire:navigate class="hover:text-white">Vacancies</a>
                    <a href="/clients" wire:navigate class="hover:text-white">Our clients</a>
                    <a href="/events" wire:navigate class="hover:text-white">Events</a>
                    <a href="/our-certificates" wire:navigate class="hover:text-white">Certificates</a>
                    <a href="/contacts" wire:navigate class="hover:text-white">Contacts</a>
                </nav>
            </div>

            <div class="lg:col-span-3">
                <h3 class="font-display text-[15px] font-medium text-white">Nepal Office</h3>
                <ul class="mt-4 space-y-3 text-sm text-white/75">
                    @if ($location)
                        <li class="flex gap-3"><x-glyph name="pin" class="mt-0.5 h-4 w-4 text-leaf" />{{ $location }}</li>
                    @endif
                    @if ($primaryContact)
                        <li class="flex gap-3"><x-glyph name="phone" class="mt-0.5 h-4 w-4 text-leaf" />
                            <span>{{ $primaryContact }}@if ($secondaryContact)<br>{{ $secondaryContact }}@endif</span></li>
                    @endif
                    @if ($email)
                        <li class="flex gap-3"><x-glyph name="mail" class="mt-0.5 h-4 w-4 text-leaf" />
                            <a href="mailto:{{ $email }}" class="hover:text-white">{{ $email }}</a></li>
                    @endif
                    <li class="flex gap-3"><x-glyph name="clock" class="mt-0.5 h-4 w-4 text-leaf" />Sunday – Friday (10 am – 6 pm)</li>
                </ul>
            </div>

            <div class="lg:col-span-3">
                <h3 class="font-display text-[15px] font-medium text-white">Dubai Office</h3>
                <ul class="mt-4 space-y-3 text-sm text-white/75">
                    <li class="flex gap-3"><x-glyph name="pin" class="mt-0.5 h-4 w-4 text-leaf" />Tower, Business Bay, Dubai, United Arab Emirates</li>
                    <li class="flex gap-3"><x-glyph name="phone" class="mt-0.5 h-4 w-4 text-leaf" />+971 559 997 6543</li>
                    <li class="flex gap-3"><x-glyph name="mail" class="mt-0.5 h-4 w-4 text-leaf" />
                        <a href="mailto:info@alzahrahr.com" class="hover:text-white">info@alzahrahr.com</a></li>
                </ul>
            </div>

            <div class="sm:col-span-2 lg:col-span-3">
                <h3 class="font-display text-[15px] font-medium text-white">Map</h3>
                <iframe title="Al Zahra office map"
                    src="https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d3532.5114777824447!2d85.34012922618014!3d27.70148997618596!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x39eb199c57ba27b5%3A0xde93b6685bb60872!2sOld%20Baneshwor%2C%20Kathmandu!3m2!1d27.7024708!2d85.34140269999999!4m5!1s0x39eb190025b96a67%3A0xbf2daabad513b674!2sAl%20Zahra%20Human%20Resources%20Consultancy%20Pvt.%20Ltd.%2C%20P82V%2B5FH%2C%20Kathmandu%2044600!3m2!1d27.700432!2d85.3437495!5e0!3m2!1sen!2snp!4v1703860852990!5m2!1sen!2snp"
                    class="mt-4 h-40 w-full rounded-md" style="border:0" loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
        </div>
        <div class="border-t border-white/10">
            <p class="container py-6 text-xs text-white/55">&copy; {{ $currentYear }} Alzahra Human Resource Pvt. Ltd. All rights reserved.</p>
        </div>
    </div>
</footer>
