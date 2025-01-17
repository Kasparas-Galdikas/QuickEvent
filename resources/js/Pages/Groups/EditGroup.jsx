import { useState } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, router } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';

export default function EditGroup({ group }) {
    const [groupData, setGroupData] = useState({
        name: group.name,
        description: group.description,
        location: group.location
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { id, value } = e.target;
        setGroupData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Updated URL to include 'groups' in the path
        router.put(`/groups/${group.id}`, groupData, {
            onSuccess: () => {
                console.log('Group updated successfully');
            },
            onError: (errors) => {
                setErrors(errors);
            }
        });
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <Head title="Edit Group" />

            <div className="flex-grow flex items-start justify-center mt-5">
                <div className="w-full max-w-4xl p-4 custom-card">
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-bold text-gray-800 mb-6">
                                Edit Group Details
                            </h1>

                            {/* Group Name Input */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Group Name
                                </label>
                                <TextInput
                                    id="name"
                                    value={groupData.name}
                                    className="block w-full"
                                    onChange={handleChange}
                                />
                                {errors.name && (
                                    <span className="text-red-500 text-sm">
                                        {errors.name}
                                    </span>
                                )}
                            </div>

                            {/* Location Input */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Location
                                </label>
                                <TextInput
                                    id="location"
                                    value={groupData.location}
                                    className="block w-full"
                                    onChange={handleChange}
                                />
                                {errors.location && (
                                    <span className="text-red-500 text-sm">
                                        {errors.location}
                                    </span>
                                )}
                            </div>

                            {/* Group Description Input */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    value={groupData.description}
                                    onChange={handleChange}
                                    className="w-full custom-textarea h-40 p-3"
                                    placeholder="Describe your group (min. 50 characters)"
                                />
                                {errors.description && (
                                    <span className="text-red-500 text-sm">
                                        {errors.description}
                                    </span>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-between mt-6">
                                <PrimaryButton
                                    type="button"
                                    onClick={() => router.visit(`/groups/show/${group.id}`)}
                                >
                                    Cancel
                                </PrimaryButton>
                                <PrimaryButton type="submit">
                                    Save Changes
                                </PrimaryButton>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}