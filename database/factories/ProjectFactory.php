<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

     protected $model = Project::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->sentence(6), // Generates a random project name
            'description' => $this->faker->sentence(15), // Add random description
        ];
    }
}
