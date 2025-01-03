import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';

export default function CreateEvent({ groups = [], initialTopics = [] }) {
    const [startDate, setStartDate] = useState(new Date());
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [topics, setTopics] = useState(initialTopics);
    const { url } = usePage(); // Get the current URL from Inertia.js
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [groupImage, setGroupImage] = useState(null); // State for group image upload

    // Extract the `group_id` from the query parameters
    useEffect(() => {
        const queryParams = new URLSearchParams(url.split('?')[1]);
        const groupId = queryParams.get('group_id');
        setSelectedGroup(parseInt(groupId, 10) || (groups[0]?.id || null));
    }, [url]);

   
    // Fetch topics for the selected group
    useEffect(() => {
        if (selectedGroup) {
            axios
                .get('/topics/filter-by-group', { params: { group_id: selectedGroup } })
                .then((response) => setTopics(response.data))
                .catch((error) => console.error('Error fetching topics:', error));
        }
    }, [selectedGroup]);


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

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setGroupImage(file);
        }
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <Head title="Create Event" />
            <Navbar />

            {/* Wrapped form in custom-card */}
            <div className="custom-card max-w-4xl mx-auto p-6 my-8 rounded shadow">
                <form>
                    <h1 className="text-2xl font-bold mb-4">Create an Event</h1>

                    {/* Group Name Display */}
                    <div className="mb-6">
                        <InputLabel value="Group" />
                        <p className="mb-6">
                            {groups.find((group) => group.id === selectedGroup)?.name || 'Group not found'}
                        </p>
                    </div>

                    {/* Title */}
                    <div className="mb-6">
                        <InputLabel htmlFor="title" value="Title (required)" />
                        <TextInput
                            id="title"
                            type="text"
                            className="w-full"
                            maxLength="80"
                            required
                        />
                    </div>

                    {/* Date and Time */}
                    <div className="mb-6">
                        <InputLabel value="Date and Time" />
                        <div className="flex gap-4 items-center">
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                className="form-control custom-date-time"
                                dateFormat="MMMM d, yyyy"
                            />
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                className="form-control custom-date-time custom-time-box"
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                timeCaption="Time"
                                dateFormat="h:mm aa"
                            />
                            <span className="text-gray-700">EET</span>
                        </div>
                    </div>

                    {/* Duration */}
                    <div className="mb-6">
                        <InputLabel value="Duration" />
                        <select className="form-control custom-dropdown">
                            <option>1 hour</option>
                            <option>2 hours</option>
                            <option>3 hours</option>
                            <option>4 hours</option>
                        </select>
                    </div>

                    {/* Event Image Upload */}
                    <div className="mb-6">
                        <InputLabel value="Event Image" />
                        <div>
                            <button
                                type="button"
                                className="btn mt-2 custom-btn px-3 py-1"
                                style={{ fontSize: '14px' }} // Inline style to override font size
                                onClick={() => document.getElementById('event-image-upload').click()}
                            >
                                Upload Image
                            </button>
                            <input
                                id="event-image-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden" // Hide the file input
                            />
                        </div>
                        {groupImage && (
                            <p className="mt-2 text-sm text-gray-500">
                                Selected file: {groupImage.name}
                            </p>
                        )}
                    </div>


                    {/* Topics */}
                    <div className="mb-6">
                        <InputLabel value="Topics" />
                        <p className="text-sm text-gray-500 mb-2">You can add up to 5 topics.</p>
                        <TextInput
                            type="text"
                            placeholder="Search topic"
                            className="w-full"
                            value={searchQuery}
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

                    {/* Location */}
                    <div className="mb-6">
                        <InputLabel value="Location" />
                        <TextInput
                            type="text"
                            placeholder="Search or add a location"
                            className="w-full"
                        />
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-between mt-8">
                        <PrimaryButton type="button">Cancel</PrimaryButton>
                        <PrimaryButton type="submit">Publish</PrimaryButton>
                    </div>
                </form>
            </div>

            <Footer />
        </div>
    );
}
