<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $users = User::orderBy('created_at', 'desc')->paginate(10);
        return response()->json($users);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('users.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'password' => 'required|min:8',
        ]);
    
        $avatarPath = $request->hasFile('avatar') 
        ? $request->file('avatar')->store('avatars', 'public') 
        : 'avatars/default-avatar.png';

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'avatar' => $avatarPath,
            'password' => bcrypt($validated['password']),
        ]);
    
        return response()->json([
            'message' => 'User created successfully', 
            'user' => $user
        ], 201);
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
    public function edit(User $user)
    {
        return view('users.edit', compact('user'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
    
        $user->avatar = $request->hasFile('avatar') 
        ? $request->file('avatar')->store('avatars', 'public') 
        : 'avatars/default-avatar.png';
        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'avatar' => $user->avatar,
        ]);
    
        return response()->json(['message' => 'User updated successfully']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }
}
