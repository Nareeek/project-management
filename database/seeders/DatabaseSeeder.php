<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Project;
use App\Models\Task;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create users
        $users = User::factory(10)->create();

        // Create projects
        $projects = Project::factory(5)->create();

        // Create tasks and associate them with projects and users
        Task::factory(20)->create()->each(function ($task) use ($projects, $users) {
            $task->project_id = $projects->random()->id;
            $task->save();
            $task->users()->attach($users->random(2)); // Assign task to 2 random users
        });
    }
}
