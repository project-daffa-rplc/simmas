<?php

namespace App\Livewire\Dudi\Action;

use App\Models\dudi;
use Livewire\Component;

class Action extends Component
{
    public $data;
    public $isOpen = false;


    public function mount($id)
    {
        $dudi = dudi::query()->with(['user', 'guru'])->find($id);
        $this->data = $dudi;
    }

    public function openModal()
    {
        $this->isOpen = true;
    }

    public function closeModal()
    {
        $this->isOpen = false;
    }
    public function render()
    {
        return view('livewire.dudi.action.action');
    }
}
