import { useState, useEffect } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, router } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import axios from 'axios';

export default function EditGroup({ group }) {
    const [groupData, setGroupData] = useState({
        name: group.name,
        description: group.description,
        location: group.location
    });
    const [errors, setErrors] = useState({});
    const [topics, setTopics] = useState([]);
    const [selectedTopics, setSelectedTopics] = useState(group.topics?.map(t => t.id) || []);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const response = await axios.get('/topics');
                setTopics(response.data);
            } catch (error) {
                console.error('Error fetching topics:', error);
            }
        };

        fetchTopics();
    }, []);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setGroupData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    // Filter and paginate topics
    const filteredTopics = topics.filter((topic) =>
        topic.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const displayedTopics = filteredTopics.slice(
        currentPage * 15,
        (currentPage + 1) * 15
    );

    const handleTopicChange = (topicId) => {
        setSelectedTopics((prev) =>
            prev.includes(topicId)
                ? prev.filter((id) => id !== topicId)
                : [...prev, topicId]
        );
    };

    const handleViewMore = () => {
        const nextPage = currentPage + 1;
        if (nextPage * 15 < filteredTopics.length) {
            setCurrentPage(nextPage);
        } else {
            setCurrentPage(0);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const submitData = {
            name: groupData.name,
            description: groupData.description,
            location: groupData.location,
            topics: selectedTopics // Make sure this is included
        };

        router.put(`/groups/${group.id}`, submitData, {
            onSuccess: () => {
                router.visit(`/groups/show/${group.id}`);
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

                            {/* Topics Section */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Topics
                                </label>
                                <TextInput
                                    id="searchTopics"
                                    value={searchQuery}
                                    placeholder="Search for topics"
                                    className="block w-full mb-3"
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(0);
                                    }}
                                />
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {displayedTopics.map((topic) => (
                                        <button
                                            key={topic.id}
                                            type="button"
                                            className={`px-4 py-2 rounded-full text-sm border-2 ${selectedTopics.includes(topic.id)
                                                    ? 'bg-teal-600 text-white border-teal-600'
                                                    : 'bg-teal-100 text-teal-600 border-teal-600'
                                                }`}
                                            onClick={() => handleTopicChange(topic.id)}
                                        >
                                            {topic.name}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    className="text-teal-600 mt-3"
                                    onClick={handleViewMore}
                                >
                                    {(currentPage + 1) * 15 >= filteredTopics.length
                                        ? 'Back to Start'
                                        : 'View More'}
                                </button>
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