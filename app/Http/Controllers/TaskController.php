<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Project;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $sort = $request->query('sort', 'title'); // Default sorting by title
        $tasks = Task::with(['project', 'users']) // Include related project and users
            ->orderBy($sort, 'asc')
            ->paginate(10, ['*'], 'tasks_page'); // Use 'tasks_page' for pagination key
    
        return inertia('Dashboard', compact('tasks'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return response()->json([
            'users' => User::all(),
            'projects' => Project::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'project_id' => 'required|exists:projects,id',
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id',
        ]);
    
        $task = Task::create([
            'title' => $validated['title'],
            'project_id' => $validated['project_id'],
        ]);
    
        if ($request->has('user_ids')) {
            $task->users()->attach($validated['user_ids']);
        }
        return response()->json(['task' => $task->load(['project', 'users'])]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Task $task)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'project_id' => 'required|exists:projects,id',
            'user_ids' => 'array',
            'user_ids.*' => 'exists:users,id',
        ]);
    
        $task->update($request->only('title', 'project_id'));
        $task->users()->sync($request->user_ids);
    
        return response()->json(['message' => 'Task updated successfully']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        $task->delete();
        return response()->json(['message' => 'Task deleted successfully']);
    }
}
