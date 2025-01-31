import { useState, useEffect } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import axios from 'axios';
import { router } from '@inertiajs/react';

export default function CreateGroup() {
    const [topics, setTopics] = useState([]); // Dynamically fetched topics
    const [location, setLocation] = useState('');
    const [currentStep, setCurrentStep] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [groupName, setGroupName] = useState('');
    const [groupDescription, setGroupDescription] = useState('');
    const [errors, setErrors] = useState({}); // Store validation errors

    // Fetch topics from TopicsController
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

    // Fetch user location from the back-end
    useEffect(() => {
        const fetchUserLocation = async () => {
            try {
                const response = await axios.get('/get-location'); // Back-end route
                setLocation(response.data.location || ''); // Set location if available
            } catch (error) {
                console.error('Error fetching user location:', error);
            }
        };

        fetchUserLocation();
    }, []);


    // Filter and paginate topics
    const filteredTopics = topics.filter((topic) =>
        topic.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const displayedTopics = filteredTopics.slice(
        currentPage * 15,
        (currentPage + 1) * 15
    );

    // Form navigation logic
    const handleNext = (e) => {
        e.preventDefault();
        const newErrors = {};

        if (currentStep === 1 && !location.trim()) {
            newErrors.location = 'Location is required.';
        }
        if (currentStep === 2 && selectedTopics.length < 1) {
            newErrors.topics = 'Please select at least one topic.';
        }
        if (currentStep === 3 && !groupName.trim()) {
            newErrors.groupName = 'Group name is required.';
        }
        if (currentStep === 4 && groupDescription.length < 50) {
            newErrors.groupDescription = 'Description must be at least 50 characters.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors); // Show errors
        } else {
            setErrors({});
            if (currentStep < 4) {
                setCurrentStep(currentStep + 1); // Proceed to the next step
            }
        }
    };

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

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const [submitting, setSubmitting] = useState(false); // Ensure this is declared

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (submitting) return; // Prevent multiple submissions
        setSubmitting(true);
    
        router.post('/groups', {
            location,
            groupName,
            groupDescription,
            topics: selectedTopics,
        }, {
            preserveScroll: true, // Prevents jumping to the top
            preserveState: true, // Keeps form inputs if validation fails
            onSuccess: () => setSubmitting(false), // Reset submitting state
            onError: (errors) => {
                setSubmitting(false); // Re-enable button if there's an error
                setErrors(errors); // Store validation errors
            },
        });
    };
    
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <Head
                title={
                    currentStep === 3
                        ? 'Name Your Group'
                        : currentStep === 4
                            ? 'Describe Your Group'
                            : 'Set Location'
                }
            />

            {/* Progress Bar */}
            <div className="w-full bg-[#F3E5AB] h-2 rounded-full relative">
                <div
                    className="h-full rounded-full"
                    style={{
                        backgroundColor: '#F4A261',
                        width: `${(currentStep / 4) * 100}%`,
                    }}
                ></div>
                <div className="absolute top-3 left-0 w-full flex justify-center">
                    <span className="text-xs font-medium text-gray-800 mt-2">
                        STEP {currentStep} OF 4
                    </span>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-grow flex items-start justify-center mt-5">
                <div className="w-full max-w-4xl p-4 custom-card">
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col sm:flex-row">
                            <div className="flex-1 pr-4">
                                {/* Back Button */}
                                {currentStep > 1 && (
                                    <button
                                        type="button"
                                        className="text-teal-600 mb-3 flex items-center"
                                        onClick={handleBack}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-5 h-5 mr-2"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M15 19l-7-7 7-7"
                                            />
                                        </svg>
                                        Back
                                    </button>
                                )}

                                {/* Step Titles */}
                                <h1 className="text-2xl font-bold text-gray-800 mb-3">
                                    {currentStep === 1 && 'First, set your location for your group'}
                                    {currentStep === 2 && 'Choose topics for your group'}
                                    {currentStep === 3 && 'Name your group'}
                                    {currentStep === 4 && 'Describe your group'}
                                </h1>

                                {/* Location Input */}
                                {currentStep === 1 && (
                                    <div>
                                        <TextInput
                                            id="location"
                                            name="location"
                                            value={location}
                                            placeholder="Enter your city, e.g., Klaipeda, LT"
                                            className="block w-full"
                                            isFocused={true}
                                            onChange={(e) => setLocation(e.target.value)}
                                        />
                                        {errors.location && (
                                            <span className="text-red-500 text-sm">
                                                {errors.location}
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* Topics Selection */}
                                {currentStep === 2 && (
                                    <div>
                                        <h2 className="text-lg font-bold">Search topics for your group</h2>
                                        <TextInput
                                            id="searchTopics"
                                            name="searchTopics"
                                            value={searchQuery}
                                            placeholder="Search for topics"
                                            className="block w-full mt-2"
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

                                        {/* Error message for topics */}
                                        {errors.topics && (
                                            <div>
                                                <span className="text-red-500 text-sm">{errors.topics}</span>
                                            </div>

                                        )}

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
                                )}


                                {/* Group Name Input */}
                                {currentStep === 3 && (
                                    <div>
                                        <TextInput
                                            id="groupName"
                                            name="groupName"
                                            value={groupName}
                                            placeholder="Enter group name"
                                            className="block w-full"
                                            onChange={(e) => setGroupName(e.target.value)}
                                        />
                                        {errors.groupName && (
                                            <span className="text-red-500 text-sm">
                                                {errors.groupName}
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* Group Description Input */}
                                {currentStep === 4 && (
                                    <div>
                                        <textarea
                                            value={groupDescription}
                                            onChange={(e) => setGroupDescription(e.target.value)}
                                            className="w-full custom-textarea h-40 p-3"
                                            placeholder="Describe your group (min. 50 characters)"
                                        />
                                        {errors.groupDescription && (
                                            <span className="text-red-500 text-sm">
                                                {errors.groupDescription}
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* Submit Button */}
                                <PrimaryButton
                                    className="mt-4"
                                    disabled={
                                        submitting || // Disable when submitting
                                        (currentStep === 4 && groupDescription.length < 50) // Additional conditions
                                    }
                                    type={currentStep === 4 ? 'submit' : 'button'}
                                    onClick={currentStep === 4 ? undefined : handleNext}
                                >
                                    {currentStep === 4 ? 'Create' : 'Next'}
                                </PrimaryButton>

                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
