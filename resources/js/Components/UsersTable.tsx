import { useState, useEffect } from "react";
import Notification from '@/Components/Notification';
import CreateUser from '@/Pages/Users/CreateUser';

export default function UsersTable({ users = { data: [] }, handlePagination }) {
    const [sortedUsers, setSortedUsers] = useState(users.data || []);
    const [sortDirection, setSortDirection] = useState("asc");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (users.data?.length) {
            setSortedUsers(prev => (users.data?.length ? users.data : prev));
        }
    }, [users]);

    const addNotification = (message, type) => {
        setNotifications((prev) => [...prev, { id: Date.now(), message, type }]);
    };

    const toggleSort = () => {
        const sorted = [...sortedUsers].sort((a, b) =>
            sortDirection === "asc"
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name)
        );
        setSortedUsers(sorted);
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    };

    const handleUserCreated = (newUser) => {
        if (!newUser || !newUser.id || !newUser.name) {
            addNotification("Failed to add user", "error");
            return;
        }
        setSortedUsers(prev => [newUser, ...prev]);
        addNotification("User added successfully!", "success");
    };

    return (
        <div className="p-2 bg-white shadow rounded border">
            {/* Display Toast Notifications */}
            {notifications.map(({ id, message, type }) => (
                <Notification 
                    key={id} 
                    message={message} 
                    type={type} 
                    onClose={() => setNotifications((prev) => prev.filter(n => n.id !== id))} 
                />
            ))}
            {/* Add User Button */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-md font-semibold">Users</h3>
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={() => setIsModalOpen(true)}
                >
                    + Add User
                </button>
            </div>

            {/* CreateUser Modal */}
            {isModalOpen && (
                <CreateUser onUserCreated={handleUserCreated} onClose={() => setIsModalOpen(false)} />
            )}

            <table className="w-full border-collapse border border-gray-300 text-sm table-fixed">
                <thead>
                    <tr className="bg-gray-100">
                        <th
                            className="border border-gray-400 px-2 py-1 cursor-pointer hover:bg-gray-200"
                            onClick={toggleSort}
                        >
                            Name {sortDirection === "asc" ? "⬆" : "⬇"}
                        </th>
                        <th className="border border-gray-400 px-2 py-1">Email</th>
                        <th className="border border-gray-400 px-2 py-1">Avatar</th>
                    </tr>
                </thead>
                <tbody>
                { sortedUsers && sortedUsers.length > 0 ? (
                    sortedUsers.map(user => (
                        <tr key={user.id} className="hover:bg-gray-100">
                            <td className="border border-gray-400 px-2 py-1 truncate" title={user.name}>{user.name}</td>
                            <td className="border border-gray-400 px-2 py-1 truncate" title={user.email}>{user.email}</td>
                            <td className="border border-gray-400 px-2 py-1">
                                <div className="relative group">
                                    <img
                                        src={user.avatar && !user.avatar.includes('default-avatar.png')
                                            ? `/storage/${user.avatar}`
                                            : '/images/default-avatar.png'
                                        }
                                        onError={(e) => e.currentTarget.src = '/images/default-avatar.jpg'}
                                        width="40"
                                        className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm"
                                        alt="User Avatar"
                                    />

                                    <div className="absolute hidden group-hover:flex items-center justify-center bg-white p-1 rounded-lg shadow-lg border border-gray-300 top-[-30px] left-[50%] translate-x-[-50%] w-48 h-48 z-10">
                                        <img
                                            src={user.avatar && !user.avatar.includes('default-avatar.png')
                                                ? `/storage/${user.avatar}`
                                                : '/images/default-avatar.png'
                                            }
                                            onError={(e) => e.currentTarget.src = '/images/default-avatar.jpg'}
                                            className="w-full h-full rounded object-cover"
                                            alt="User Avatar Enlarged"
                                        />
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ))
                ): (
                    <tr>
                        <td colSpan={3} className="text-center p-4">No users available</td>
                    </tr>
                )}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="mt-2 flex justify-center">
                {users?.links?.map((link) => (
                    link.url ? (
                        <button
                            key={link.label}
                            onClick={() => handlePagination(link.url, "users")}
                            className={`px-4 py-2 border rounded-lg text-sm transition-all duration-200
                                ${link.active ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-blue-400 hover:text-white"}`}
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
