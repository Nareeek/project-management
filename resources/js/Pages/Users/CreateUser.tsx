import { useState } from "react";
import axios from 'axios';

export default function CreateUser({ onUserCreated, onClose }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
    
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        if (avatar) formData.append("avatar", avatar);
    
        try {
            const response = await axios.post("/users", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
    
            if (response.status !== 201) {
                throw new Error(response.data.message || "Failed to create user");
            }
            
            const jsonString = response.data.match(/{.*}/)[0];
            const data = JSON.parse(jsonString);
            const newUser = data.user;

            onUserCreated(newUser);            
            onClose();
        } catch (err) {
            if (err.response?.status === 422) {
                const errors = err.response?.data?.errors;
                setError(errors ? Object.values(errors).flat().join(" ") : "Validation failed");
            } else {
                setError(err.response?.data?.message || "Error creating user");
            }
        } finally {
            setLoading(false);
        }
    };    

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
                {/* Close Button */}
                <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-black"
                    onClick={onClose}
                >
                    ✖
                </button>
                <h2 className="text-lg font-bold mb-4">Add User</h2>
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                        type="text" 
                        placeholder="Name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => setAvatar(e.target.files[0])}
                        className="w-full p-2 border rounded"
                    />
                    <button 
                        type="submit" 
                        className="w-full bg-blue-500 text-white p-2 rounded disabled:bg-gray-400"
                        disabled={loading}
                    >
                        {loading ? "Adding..." : "Add User"}
                    </button>
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        className="w-full p-2 border rounded" 
                        required
                    />
                </form>
            </div>
        </div>
    );
}
