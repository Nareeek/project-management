import { useState, useEffect } from 'react';
import CreateTask from '@/Pages/Tasks/CreateTask';
import Notification from '@/Components/Notification';
import axios from 'axios';

export default function TasksTable({ tasks, projects, users, handlePagination }) {
    const [sortedTasks, setSortedTasks] = useState(tasks.data || []);
    const [sortDirection, setSortDirection] = useState('asc');
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [projectList, setProjectList] = useState(projects.data || []);
    const [userList, setUserList] = useState(users.data || []);
    const [notifications, setNotifications] = useState([]);
    
    const fetchAllUsersAndProjects = async () => {
        try {
            const { data } = await axios.get('/tasks/create');
            setProjectList(data.projects);
            setUserList(data.users);
        } catch (error) {
            console.error("Error fetching users and projects:", error);
        }
    };

    const addNotification = (message, type) => {
        setNotifications((prev) => [...prev, { id: Date.now(), message, type }]);
    };

    useEffect(() => {
        setSortedTasks(prev => (tasks.data?.length ? tasks.data : prev));
    }, [tasks]);

    // Sorting function for Task Title
    const toggleSort = () => {
        const sorted = [...sortedTasks].sort((a, b) =>
            sortDirection === 'asc' 
                ? a.title.localeCompare(b.title)
                : b.title.localeCompare(a.title)
        );
        setSortedTasks(sorted);
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    };

    const addTaskToState = (newTask) => {
        if (!newTask || typeof newTask !== 'object' || !newTask.id || !newTask.title) {
            addNotification("Failed to add task!", "error");
            return;
        }

        setSortedTasks((prevTasks) => {
            const isDuplicate = prevTasks.some(task => task.id === newTask.id);
            return isDuplicate ? prevTasks : [...prevTasks, newTask];
        });
        addNotification("Task added successfully!", "success");
    };

    return (
        <div className="p-2 bg-white shadow rounded border">
            {notifications.map(({ id, message, type }) => (
                <Notification 
                    key={id} 
                    message={message} 
                    type={type} 
                    onClose={() => setNotifications((prev) => prev.filter(n => n.id !== id))} 
                />
            ))}

            <div className="flex justify-between items-center mb-4">
                <h3 className="text-md font-semibold">Tasks</h3>
                {/* Add Task Button */}
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={async () => {
                        await fetchAllUsersAndProjects();
                        setShowTaskModal(true);
                    }}
                >
                    + Add Task
                </button>
            </div>

            <table className="w-full border-collapse border border-gray-300 text-sm table-fixed">
                <thead>
                    <tr className="bg-gray-100">
                        <th 
                            className="border border-gray-400 px-2 py-1 cursor-pointer hover:bg-gray-200"
                            onClick={toggleSort}
                        >
                            Title {sortDirection === 'asc' ? '⬆' : '⬇'}
                        </th>
                        <th className="border border-gray-400 px-2 py-1">Project</th>
                        <th className="border border-gray-400 px-2 py-1">Assigned Users</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedTasks.map((task) => (
                        <tr key={`${task.id}-${task.title}`} className="hover:bg-gray-100">
                            <td className="border border-gray-400 px-2 py-1 truncate" title={task.title}>
                                {task.title}
                            </td>
                            <td className="border border-gray-400 px-2 py-1 truncate" title={task.project.name}>
                                {task.project.name}
                            </td>
                            <td className="border border-gray-400 px-2 py-1">
                                {task.users.map((user) => (
                                    <span key={user.id} className="inline-block bg-gray-200 px-2 py-1 rounded mr-1">
                                        {user.name}
                                    </span>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="mt-2 flex justify-center">
                {tasks?.links?.map((link) => (
                    link.url ? (
                        <button
                            key={link.label}
                            onClick={() => handlePagination(link.url, "tasks")}
                            className={`px-4 py-2 border rounded-lg text-sm transition-all duration-200
                                ${link.active ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-blue-400 hover:text-white"}
                            `}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ) : (
                        <span
                            key={link.label}
                            className="px-2 py-1 border rounded mx-1 text-sm text-gray-400 cursor-not-allowed"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    )
                ))}
            </div>
            {/* Task Creation Modal */}
            {showTaskModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Create Task</h2>
                        {/* CreateTask Component (Form) */}
                        <CreateTask 
                            projects={projectList || []}
                            users={userList || []}
                            setShowTaskModal={setShowTaskModal}
                            addTaskToState={addTaskToState}
                        />

                        {/* Close Button */}
                        <button 
                            onClick={() => setShowTaskModal(false)}
                            className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
