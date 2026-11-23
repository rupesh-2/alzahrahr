<?php

namespace Tests\Feature;

use App\Livewire\ApplyNow;
use App\Livewire\Contacts;
use App\Mail\ApplyNowMail;
use App\Mail\ContactUsMail;
use App\Models\CompanyProfile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Livewire\Livewire;
use Tests\TestCase;

class FormsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        CompanyProfile::forceCreate([
            'company_name' => 'Al Zahra', 'company_email' => 'office@example.test',
            'primary_contact' => '1', 'secondary_contact' => '2', 'location' => 'Kathmandu',
        ]);
    }

    public function test_contact_form_validates_and_sends(): void
    {
        Mail::fake();

        Livewire::test(Contacts::class)
            ->assertSee('office@example.test')
            ->call('contactUs')
            ->assertHasErrors(['name', 'email', 'message']);

        Livewire::test(Contacts::class)
            ->set('name', 'Ram')->set('email', 'ram@example.test')->set('message', 'Hello')
            ->call('contactUs')
            ->assertHasNoErrors();

        Mail::assertSent(ContactUsMail::class);
    }

    public function test_apply_form_validates_and_sends(): void
    {
        Mail::fake();
        Storage::fake('public');

        Livewire::test(ApplyNow::class)
            ->call('applyNow')
            ->assertHasErrors(['userName', 'email', 'firstName', 'lastName', 'cv', 'passport', 'photo']);

        Livewire::test(ApplyNow::class)
            ->set('userName', 'Ram Bahadur Thapa')->set('email', 'ram@example.test')
            ->set('firstName', 'Ram')->set('lastName', 'Thapa')
            ->set('address', 'Ward 4')->set('city', 'Pokhara')->set('country', 'Nepal')
            ->set('phoneNumber', '9800000000')->set('aboutMe', 'Security guard, Dubai')
            ->set('cv', UploadedFile::fake()->create('cv.pdf', 200))
            ->set('passport', UploadedFile::fake()->image('passport.jpg'))
            ->set('photo', UploadedFile::fake()->image('me.jpg'))
            ->call('applyNow')
            ->assertHasNoErrors();

        Mail::assertSent(ApplyNowMail::class, fn ($m) => $m->mailData['firstName'] === 'Ram'
            && $m->mailData['lastName'] === 'Thapa');
    }

    public function test_every_public_page_renders(): void
    {
        foreach (['/', '/about-us', '/expertise-saying', '/nepali-workers', '/our-certificates',
            '/events', '/clients', '/vacancies', '/vacancy/999', '/contacts', '/apply-now'] as $uri) {
            $this->get($uri)->assertOk()->assertSee('Al Zahra', false);
        }
    }
}
