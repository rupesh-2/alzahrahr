<?php

namespace App\Livewire;

use App\Models\CompanyProfile;
use Livewire\Component;

class Header extends Component
{
    public $location;

    public $contact;

    public function mount()
    {
        $companyProfile = CompanyProfile::get()->first();
        if ($companyProfile) {
            $this->location = $companyProfile->location;
            $this->contact = $companyProfile->primary_contact;
        }
    }

    public function render()
    {
        return view('livewire.header', ['location' => $this->location, 'contact' => $this->contact]);
    }
}
