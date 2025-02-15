import { useState, useEffect } from 'react';
import CreateProject from '@/Pages/Projects/CreateProject';
import Notification from '@/Components/Notification';

export default function ProjectsTable({ projects, handlePagination }) {
    const [sortedProjects, setSortedProjects] = useState(projects.data || []);
    const [sortDirection, setSortDirection] = useState('asc');
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        setSortedProjects(prev => (projects.data?.length ? projects.data : prev));
    }, [projects]);

    const addNotification = (message, type) => {
        setNotifications((prev) => [...prev, { id: Date.now(), message, type }]);
    };

    // Sorting function
    const toggleSort = () => {
        const sorted = [...sortedProjects].sort((a, b) =>
            sortDirection === 'asc' 
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name)
        );
        setSortedProjects(sorted);
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    };

    const addProjectToState = (newProject) => {
        if (!newProject || typeof newProject !== 'object' || !newProject.id || !newProject.name) {
            addNotification("Failed to add project!", "error");
            return;
        }

        const formattedProject = {
            ...newProject,
            description: newProject.description ?? "No description available"
        };
    
        setSortedProjects(prevProjects => {
            if (prevProjects.some(project => project.id === newProject.id)) {
                return prevProjects;
            }
            return [...prevProjects, formattedProject];
        });
        addNotification("Project added successfully!", "success");
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
                <h3 className="text-md font-semibold">Projects</h3>
                {/* Add Project Button */}
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={() => setShowProjectModal(true)}
                >
                    + Add Project
                </button>
            </div>

            <table className="w-full border-collapse border border-gray-300 text-sm table-fixed">
                <thead>
                    <tr className="bg-gray-100">
                        <th 
                            className="border border-gray-400 px-2 py-1 cursor-pointer hover:bg-gray-200"
                            onClick={toggleSort}
                        >
                            Name {sortDirection === 'asc' ? '⬆' : '⬇'}
                        </th>
                        <th className="border border-gray-400 px-2 py-1">Description</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedProjects.map((project) => (
                        <tr key={project.id} className="hover:bg-gray-100">
                            <td className="border border-gray-400 px-2 py-1 truncate" title={project.name}>
                                {project.name}
                            </td>
                            <td className="border border-gray-400 px-2 py-1 truncate" title={project.description}>
                                {project.description}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="mt-2 flex justify-center">
                {projects?.links?.map((link) => (
                    link.url ? (
                        <button
                            key={link.label}
                            onClick={() => handlePagination(link.url, "projects")}
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
            
            {/* Project Creation Modal */}
            {showProjectModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Create Project</h2>
                        
                        {/* CreateProject Component (Form) */}
                        <CreateProject
                            setShowProjectModal={setShowProjectModal}
                            addProjectToState={addProjectToState}
                        />

                        {/* Close Button */}
                        <button 
                            onClick={() => setShowProjectModal(false)}
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
