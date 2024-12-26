import { useState } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';


export default function CreateGroup() {
    const [location, setLocation] = useState('');
    const [currentStep, setCurrentStep] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [groupName, setGroupName] = useState('');
    const [groupDescription, setGroupDescription] = useState('');

    const allTopics = [
        'Anxiety', 'Work At Home Moms', 'Freedom From Religion', 'Writing Workshops',
        'Personal Development', 'Buddhism', 'Energy Healing', 'Weekend Getaways',
        'Memoir Writing', 'Reiki', 'Real Estate Investment Education', 'Christian Ministry',
        'Big Data', 'Jesus Christ', 'Social Networking', 'Stay-at-Home Moms',
        'Non-Fiction Writing', 'Salsa Lessons', 'Traveling', 'Marketing', 'Fitness',
        'Cooking', 'Art Therapy', 'Gaming', 'Music Production', 'Psychology',
        'Photography', 'Social Media', 'Technology', 'Startup Culture', 'Entrepreneurship'
    ];

    const filteredTopics = allTopics.filter(topic =>
        topic.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const displayedTopics = filteredTopics.slice(currentPage * 15, (currentPage * 15) + 15);

    const handleNext = (e) => {
        e.preventDefault();
        if (currentStep === 1 && !location.trim()) {
            alert('Please enter your location.');
            return;
        }
        if (currentStep === 3 && !groupName.trim()) {
            alert('Please enter a group name.');
            return;
        }
        if (currentStep === 4 && groupDescription.length < 50) {
            alert('Please write at least 50 characters for the group description.');
            return;
        }
        setCurrentStep(currentStep + 1);
    };

    const handleTopicChange = (topic) => {
        setSelectedTopics(selectedTopics.includes(topic)
            ? selectedTopics.filter((t) => t !== topic)
            : [...selectedTopics, topic]
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

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <Head title={
                currentStep === 3 ? "Name Your Group" :
                    currentStep === 4 ? "Describe Your Group" :
                        "Set Location"
            } />

            <div className="w-full bg-[#F3E5AB] h-2 rounded-full relative">
                <div
                    className="h-full rounded-full"
                    style={{
                        backgroundColor: '#F4A261',
                        width: `${(currentStep / 6) * 100}%`,
                    }}
                ></div>
                <div className="absolute top-3 left-0 w-full flex justify-center">
                    <span className="text-xs font-medium text-gray-800 mt-2">
                        STEP {currentStep} OF 6
                    </span>
                </div>
            </div>

            <div className="flex-grow flex items-start justify-center mt-5">
                <div className="w-full max-w-4xl p-4 custom-card">
                    <div className="flex flex-col sm:flex-row">
                        <div className="flex-1 pr-4">
                            {currentStep > 1 && (
                                <button
                                    type="button"
                                    className="text-teal-600 mb-3 flex items-center"
                                    onClick={handleBack}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Back
                                </button>
                            )}

                            <h1 className="text-2xl font-bold text-gray-800 mb-3">
                                {currentStep === 1 && 'First, set your location for your group'}
                                {currentStep === 2 && 'Choose topics for your group'}
                                {currentStep === 3 && 'Name your group'}
                                {currentStep === 4 && 'Describe your group'}
                            </h1>

                            {currentStep === 3 && (
                                <p className="text-gray-600 mb-4">
                                    Choose a name that will give people a clear idea of what the group is about.
                                </p>
                            )}

                            {currentStep === 4 && (
                                <div className="mb-4">
                                    <p className="text-gray-600">
                                        People will see this when we promote your group, but you'll be able to update it later too.
                                        We care about human connection, so someone will review your group to make sure it meets our{' '}
                                        <a href="#" className="text-teal-600 hover:underline">
                                            community guidelines
                                        </a>.
                                    </p>
                                </div>
                            )}

                            <form onSubmit={handleNext} className="space-y-3">
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
                                    </div>
                                )}

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
                                                    key={topic}
                                                    type="button"
                                                    className="px-4 py-2 rounded-full text-sm bg-teal-100 text-teal-600 border-2 border-teal-600"
                                                    onClick={() => handleTopicChange(topic)}
                                                >
                                                    {topic}
                                                </button>
                                            ))}
                                        </div>
                                        <button
                                            type="button"
                                            className="text-teal-600 mt-3"
                                            onClick={handleViewMore}
                                        >
                                            {(currentPage + 1) * 15 >= filteredTopics.length ? 'Back to Start' : 'View More'}
                                        </button>
                                    </div>
                                )}

                                {currentStep === 3 && (
                                    <div>
                                        <TextInput
                                            id="groupName"
                                            name="groupName"
                                            value={groupName}
                                            className="block w-full"
                                            isFocused={true}
                                            onChange={(e) => setGroupName(e.target.value)}
                                        />
                                    </div>
                                )}

                                {currentStep === 4 && (
                                    <div className="space-y-4">
                                        <textarea
                                            value={groupDescription}
                                            onChange={(e) => setGroupDescription(e.target.value)}
                                            className="w-full custom-textarea h-40 p-3 "
                                            placeholder="Write your own description or click the button to generate a description with AI that includes all the information you've already input (group location, name, topics)."
                                        />
                                    </div>
                                )}

                                <PrimaryButton disabled={currentStep === 4 && groupDescription.length < 50}>
                                    Next
                                </PrimaryButton>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}