import { useForm } from '@inertiajs/react';
import axios from "axios";

export default function CreateTask({ projects, users, setShowTaskModal, addTaskToState }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        project_id: '',
        user_ids: [],
    });

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post(route("tasks.store"), data);

            if (data.title.length > 255) {
                alert("The title must not exceed 255 characters")
            }
    
            if (response.data.task) {
                addTaskToState(response.data.task); // Update local state
            }
    
            setData({ title: "", project_id: "", user_ids: [] }); // Reset form
            setShowTaskModal(false); // Close modal
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setData("errors", error.response.data.errors); // Update errors in useForm
            } else {
                console.error("Error adding task", error);
            }
            setShowTaskModal(false); // Close modal
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Add New Task</h2>

            <form onSubmit={submit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Task Title</label>
                    <input
                        type="text"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        required
                    />
                    {errors.title && <span className="text-sm text-red-600">{errors.title}</span>}
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Project</label>
                    <select
                        value={data.project_id}
                        onChange={(e) => setData('project_id', e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-lg p-2"
                        required
                    >
                        <option value="">Select a project</option>
                        {(projects || []).map((project) => (
                            <option key={project.id} value={project.id}>
                                {project.name}
                            </option>
                        ))}
                    </select>
                    {errors.project_id && <span className="text-sm text-red-600">{errors.project_id}</span>}
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Assign Users</label>
                    <select
                        multiple
                        value={data.user_ids}
                        onChange={(e) =>
                            setData('user_ids', Array.from(e.target.selectedOptions, (option) => option.value))
                        }
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        required
                    >
                    {(users || []).map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.name}
                        </option>
                    ))}
                    </select>
                    {errors.user_ids && <span className="text-sm text-red-600">{errors.user_ids}</span>}
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    disabled={processing}
                >
                    Add Task
                </button>
            </form>
        </div>
    );
}
