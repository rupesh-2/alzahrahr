<div>
    <x-page-header title="Message from our expertise" eyebrow="Meet our executive team" />

    <section class="container grid gap-12 py-16 sm:py-20 lg:grid-cols-12 lg:gap-16">
        <article class="lg:col-span-7">
            <x-glyph name="quote" class="h-9 w-9 text-brand-700/40" />
            <div class="prose-body mt-6 text-[17px] leading-[1.8] text-ink/85">
                <p class="font-display text-xl font-medium text-ink">Dear Valued Guests,</p>
                <p>As the administrators of Alzahra Human Resources, we are honored to reach out to you and share a few
                    words about our shared journey toward new horizons.</p>
                <p>At Alzahra, we recognize the dreams and aspirations that fuel your desire to explore employment
                    opportunities in the Middle East and Europe. Your courage and determination to seek new experiences and
                    contribute your skills to the global workforce are truly commendable.</p>
                <p>Our commitment goes beyond just facilitating job placements; we are dedicated to ensuring a supportive
                    and transparent process that prioritizes your well-being and success. Alzahra is driven by ethical
                    recruitment practices, focusing on creating opportunities that empower individuals like yourself to
                    build a brighter future.</p>
                <p>As you embark on this journey, rest assured that you are not alone. Our team is here to guide you every
                    step of the way, providing assistance, resources, and a commitment to your personal and professional
                    growth. Your success is our success, and we take pride in being a part of your transformative journey.</p>
                <p>Thank you for choosing Alzahra Human Resources as your partner in this endeavor. Together, let’s make
                    your dreams a reality and pave the way for a promising future.</p>
                <p>Wishing you all the best,</p>
            </div>
        </article>

        <aside class="lg:col-span-5">
            <div class="grid gap-6 sm:grid-cols-2 lg:sticky lg:top-40 lg:grid-cols-1">
                @foreach ([['Kshitij Dhungana', 'Chairman', 'image/chairman.png'], ['Ashish Singh', 'CEO', 'image/ceo.jpg']] as [$name, $role, $img])
                    <figure class="grid grid-cols-[7rem_1fr] items-center gap-5 rounded-lg border border-line p-4">
                        <img src="{{ asset($img) }}" alt="{{ $name }}" class="aspect-square w-full rounded-md object-cover object-top">
                        <figcaption>
                            <p class="font-display text-xs font-medium uppercase tracking-[0.14em] text-brand-700">{{ $role }}</p>
                            <p class="mt-1 font-display text-lg font-semibold">{{ $name }}</p>
                        </figcaption>
                    </figure>
                @endforeach
            </div>
        </aside>
    </section>
</div>
