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
    const { url } = usePage();
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [groupImage, setGroupImage] = useState(null);

    // On initial load, parse `group_id` from query string, or fall back to the first group in the array.
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

    // Filter topics by search query
    const filteredTopics = topics.filter((topic) =>
        topic.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Paginate displayed topics (15 per page)
    const displayedTopics = filteredTopics.slice(
        currentPage * 15,
        (currentPage + 1) * 15
    );

    // Toggle topic selection
    const handleTopicChange = (topicId) => {
        setSelectedTopics((prev) =>
            prev.includes(topicId)
                ? prev.filter((id) => id !== topicId)
                : [...prev, topicId]
        );
    };

    // Pagination for topics
    const handleViewMore = () => {
        const nextPage = currentPage + 1;
        if (nextPage * 15 < filteredTopics.length) {
            setCurrentPage(nextPage);
        } else {
            setCurrentPage(0);
        }
    };

    // Handle image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setGroupImage(file);
        }
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        // Required fields
        formData.append('group_id', selectedGroup);
        formData.append('title', document.getElementById('title').value);
        formData.append('description', document.getElementById('description').value);

        // Convert date/time to ISO
        formData.append('start_date', startDate.toISOString());

        // IMPORTANT: Get numeric value from #duration (the select element)
        const durationValue = document.getElementById('duration').value;
        formData.append('duration', durationValue);

        formData.append(
            'location',
            document.querySelector('input[placeholder="Search or add a location"]').value
        );

        // Topics array
        selectedTopics.forEach((topic) => {
            formData.append('topics[]', topic);
        });

        // Optional image
        if (groupImage) {
            formData.append('image', groupImage);
        }

        try {
            await axios.post('/events', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('Event created successfully!');
        } catch (error) {
            console.error('Error creating event:', error);
            alert(`Failed to create event: ${error.response?.data.message || 'Unknown error'}`);
        }
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <Head title="Create Event" />
            <Navbar />

            <div className="custom-card max-w-4xl mx-auto p-6 my-8 rounded shadow">
                <form onSubmit={handleSubmit}>
                    <h1 className="text-2xl font-bold mb-4">Create an Event</h1>

                    {/* Display the selected group */}
                    <div className="mb-6">
                        <InputLabel value="Group" />
                        <p className="mb-6">
                            {groups.find((group) => group.id === selectedGroup)?.name || 'Group not found'}
                        </p>
                    </div>

                    {/* Title Field */}
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

                    {/* Date and Time Fields */}
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

                    {/* Duration Dropdown - numeric values */}
                    <div className="mb-6">
                        <InputLabel value="Duration (required)" />
                        <select className="form-control custom-dropdown" id="duration" defaultValue="1">
                            <option value="1">1 hour</option>
                            <option value="2">2 hours</option>
                            <option value="3">3 hours</option>
                            <option value="4">4 hours</option>
                        </select>
                    </div>

                    {/* Event Image */}
                    <div className="mb-6">
                        <InputLabel value="Event Image" />
                        <div>
                            <button
                                type="button"
                                className="btn mt-2 custom-btn px-3 py-1"
                                style={{ fontSize: '14px' }}
                                onClick={() => document.getElementById('event-image-upload').click()}
                            >
                                Upload Image
                            </button>
                            <input
                                id="event-image-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </div>
                        {groupImage && (
                            <p className="mt-2 text-sm text-gray-500">
                                Selected file: {groupImage.name}
                            </p>
                        )}
                    </div>

                    {/* Description Field */}
                    <div className="mb-6">
                        <InputLabel htmlFor="description" value="Description (required)" />
                        <textarea
                            id="description"
                            className="form-control custom-textarea w-full"
                            placeholder="Enter event description"
                            rows="4"
                            required
                        ></textarea>
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
                                    className={`px-4 py-2 rounded-full text-sm border-2 ${
                                        selectedTopics.includes(topic.id)
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

                    {/* Buttons */}
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
