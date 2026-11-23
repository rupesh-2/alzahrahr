<?php

namespace App\Livewire;

use App\Models\Advertisement;
use App\Models\Company;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\View\View;
use Livewire\Component;

class Home extends Component
{
    public $jobs;

    public $selectedClientId;

    public $companies;

    public $noOfCompanies;

    public $companyProfile;

    public function mount(): void
    {
        $this->deleteOldAdvertisements();
        $this->jobs = $this->getJobs();
        $this->companies = $this->getCompanies();
        $this->noOfCompanies = $this->companies->count();
    }

    public function render(): View
    {
        return view('livewire.UsersView.home', [
            'jobs' => $this->jobs,
            'companies' => $this->companies,
        ]);
    }

    private function deleteOldAdvertisements(): void
    {
        Advertisement::where('created_at', '<', Carbon::now()->subDays(8))->delete();
    }

    private function getJobs(): Collection
    {
        $ads = Advertisement::take(3)->get();

        return $ads;
    }

    private function getCompanies(): Collection
    {
        $companies = Company::get();

        return $companies;
    }
}
