import { useState, useEffect } from 'react';

export default function TasksTable({ tasks, handlePagination }) {
    const [sortedTasks, setSortedTasks] = useState(tasks.data || []);
    const [sortDirection, setSortDirection] = useState('asc'); // Track sorting direction

    useEffect(() => {
        setSortedTasks(tasks.data || []);
    }, [tasks]);

    // Sorting function for Task Title
    const toggleSort = () => {
        const sorted = [...sortedTasks].sort((a, b) =>
            sortDirection === 'asc' 
                ? a.title.localeCompare(b.title)
                : b.title.localeCompare(a.title)
        );
        setSortedTasks(sorted);
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'); // Toggle sorting direction
    };

    return (
        <div className="p-2 bg-white shadow rounded border">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-md font-semibold">Tasks</h3>
                {/* Add Task Button */}
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={() => window.location.href = route('tasks.create')} // Redirect to create form
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
                        <tr key={task.id} className="hover:bg-gray-100">
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
        </div>
    );
}
