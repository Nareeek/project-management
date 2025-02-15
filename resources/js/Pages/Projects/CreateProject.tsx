import { useState } from 'react';
import axios from 'axios';

export default function CreateProject({ setShowProjectModal, addProjectToState }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data } = await axios.post('/projects', { name, description });
            if (!data.project) {
                throw new Error("Invalid API response: missing project object");
            }
            addProjectToState(data.project);
            setShowProjectModal(false);
        } catch (err) {
            console.error("Error creating project:", err);
            setError('Failed to create project.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500">{error}</p>}

            <div>
                <label className="block text-sm font-medium">Project Name</label>
                <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                />
            </div>

            <button 
                type="submit" 
                className="w-full bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                disabled={loading}
            >
                {loading ? 'Adding...' : 'Add Project'}
            </button>
        </form>
    );
}
