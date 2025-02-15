<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;
    
    protected $fillable = ['title', 'description', 'project_id'];

    // Define relationship: Task belongs to a Project
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    // Define relationship: Task has many Users
    public function users()
    {
        return $this->belongsToMany(User::class, 'task_user');
    }
}
