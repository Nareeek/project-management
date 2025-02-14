import { useState, useEffect } from "react";

export default function UsersTable({ users, handlePagination }) {
    const [sortedUsers, setSortedUsers] = useState(users.data || []);
    const [sortDirection, setSortDirection] = useState("asc");


    useEffect(() => {
        setSortedUsers(prev => (users.data?.length ? users.data : prev));
    }, [users]);

    const toggleSort = () => {
        const sorted = [...sortedUsers].sort((a, b) =>
            sortDirection === "asc"
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name)
        );
        setSortedUsers(sorted);
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    };

    return (
        <div className="p-2 bg-white shadow rounded border">
            {/* Add "Add User" button */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-md font-semibold">Users</h3>
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={() => window.location.href = route('users.create')}
                >
                    + Add User
                </button>
            </div>

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
                    {sortedUsers.map(user => (
                        <tr key={user.id} className="hover:bg-gray-100">
                            <td className="border border-gray-400 px-2 py-1 truncate" title={user.name}>{user.name}</td>
                            <td className="border border-gray-400 px-2 py-1 truncate" title={user.email}>{user.email}</td>
                            <td className="border border-gray-400 px-2 py-1">
                                <img
                                    src={user.avatar && !user.avatar.includes('default-avatar.png')
                                        ? `/storage/${user.avatar}`
                                        
                                        : '/images/default-avatar.png'
                                    }
                                    width="40"
                                    className="rounded-full"
                                    alt="User Avatar"
                                />
                            </td>
                        </tr>
                    ))}
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
