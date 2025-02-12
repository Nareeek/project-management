import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import UsersTable from '@/Components/UsersTable';
import ProjectsTable from '@/Components/ProjectsTable';
import TasksTable from '@/Components/TasksTable';
import { Head, usePage, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';


export default function Dashboard() {
    const { users = { data: [], links: [] }, projects = { data: [], links: [] }, tasks = { data: [], links: [] } } = usePage().props;

    // Get initial section visibility from localStorage or default to true
    const [showUsers, setShowUsers] = useState(() => {
        return localStorage.getItem('showUsers') === 'false' ? false : true;
    });
    const [showProjects, setShowProjects] = useState(() => {
        return localStorage.getItem('showProjects') === 'false' ? false : true;
    });
    const [showTasks, setShowTasks] = useState(() => {
        return localStorage.getItem('showTasks') === 'false' ? false : true;
    });

    // Store section visibility in localStorage to persist across navigation
    useEffect(() => {
        localStorage.setItem('showUsers', showUsers);
        localStorage.setItem('showProjects', showProjects);
        localStorage.setItem('showTasks', showTasks);
    }, [showUsers, showProjects, showTasks]);

    const handlePagination = (url: string, section: string) => {
        if (!url) return;
    
        // Use Inertia's get() to update the state without full reload
        router.get(url, {}, {
            only: ['users', 'projects', 'tasks'],  // Only update these sections
            preserveState: true,  // Keep component state intact
            preserveScroll: true, // Keep scroll position
            replace: true,        // Replace the URL without reloading the page
        });
    };
    

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="container mx-auto mt-5">
                <h2 className="text-center text-2xl font-bold mb-4">Project Management Dashboard</h2>

                {/* Section Toggles */}
                <div className="flex justify-around mb-6">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={() => setShowUsers((prev) => !prev)}
                    >
                        {showUsers ? 'Hide Users' : 'Show Users'}
                    </button>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={() => setShowProjects((prev) => !prev)}
                    >
                        {showProjects ? 'Hide Projects' : 'Show Projects'}
                    </button>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={() => setShowTasks((prev) => !prev)}
                    >
                        {showTasks ? 'Hide Tasks' : 'Show Tasks'}
                    </button>
                </div>

                {/* Users Section */}
                {showUsers && (
                    <div className="bg-white shadow-md rounded p-4 mb-6">
                        <UsersTable users={users} handlePagination={handlePagination} />
                    </div>
                )}

                {/* Projects Section */}
                {showProjects && (
                    <div className="bg-white shadow-md rounded p-4 mb-6">
                        <ProjectsTable projects={projects} handlePagination={handlePagination} />
                    </div>
                )}

                {/* Tasks Section */}
                {showTasks && (
                    <div className="bg-white shadow-md rounded p-4 mb-6">
                        <TasksTable tasks={tasks} handlePagination={handlePagination} />
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
