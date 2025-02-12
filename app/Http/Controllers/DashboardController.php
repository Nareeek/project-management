<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $sort = $request->query('sort', 'created_at');
    
        // Redirect to login if not authenticated
        if (!Auth::check()) {
            return redirect()->route('login');
        }
    
        $user = Auth::user();
    
        // ✅ Get correct pagination pages from query parameters
        $usersPage = $request->query('users_page', 1);
        $projectsPage = $request->query('projects_page', 1);
        $tasksPage = $request->query('tasks_page', 1);

        // ✅ Fetch paginated data
        $users = User::orderBy($sort, 'asc')->paginate(10, ['*'], 'users_page', $usersPage);
        $projects = Project::orderBy($sort, 'asc')->paginate(10, ['*'], 'projects_page', $projectsPage);
        $tasks = Task::with(['project', 'users'])->orderBy($sort, 'asc')->paginate(10, ['*'], 'tasks_page');

        // ✅ Convert pagination data to array for Inertia.js
        return inertia('Dashboard', compact('user', 'users', 'projects', 'tasks'));
    }
}
