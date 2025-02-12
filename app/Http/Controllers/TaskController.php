<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

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
    
        return inertia('Dashboard', compact('tasks')); // Pass paginated tasks to frontend
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'project_id' => 'required|exists:projects,id',
            'user_ids' => 'array',
            'user_ids.*' => 'exists:users,id',
        ]);
    
        $task = Task::create($request->only('title', 'project_id'));
    
        if ($request->has('user_ids')) {
            $task->users()->attach($request->user_ids);
        }
    
        return response()->json(['message' => 'Task created successfully']);
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
