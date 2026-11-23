<?php

namespace App\Livewire;

use App\Models\Client;
use Livewire\Component;

class Clients extends Component
{
    public $clients;

    public function mount()
    {
        $this->clients = $this->getClients();
    }

    public function render()
    {
        return view('livewire.UsersView.clients', ['clients' => $this->clients]);
    }

    private function getClients()
    {
        $clients = Client::with('companies')->get();

        return $clients;
    }
}
