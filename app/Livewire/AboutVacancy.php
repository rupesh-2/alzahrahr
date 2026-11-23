<?php

namespace App\Livewire;

use App\Models\Advertisement;
use Livewire\Component;

class AboutVacancy extends Component
{
    public $jobDesc;
    public function mount($vacancyId)
    {
        $this->jobDesc = Advertisement::find($vacancyId);
    }
    public function render()
    {
        return view('livewire.UsersView.about-vacancy', ['job' => $this->jobDesc]);
    }
}
