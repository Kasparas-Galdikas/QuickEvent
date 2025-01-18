import React, { useState, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

export default function CreateEvent({ group_id = [], initialTopics = [] }) {
    const [startDate, setStartDate] = useState(new Date());
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [topics, setTopics] = useState(initialTopics);
    const [groupDetails, setGroupDetails] = useState(null);
    const [groupImage, setGroupImage] = useState(null);
    const [errors, setErrors] = useState({});
    const [filteredTopics, setFilteredTopics] = useState([]);
    const [eventType, setEventType] = useState('in-person');

    // Constants for min/max topic selection
    const MIN_TOPICS = 1;
    const MAX_TOPICS = 5;


    // Fetch group details and related topics
    useEffect(() => {
        if (group_id) {
            // Fetch group details
            axios
                .get(`/groups/${group_id}`)
                .then((response) => setGroupDetails(response.data))
                .catch((error) => console.error('Error fetching group details:', error));

            // Fetch topics related to the group
            axios
                .get(`/topics/filter-by-group`, { params: { group_id } })
                .then((response) => {
                    setTopics(response.data);
                    setFilteredTopics(response.data); // Initialize filtered topics
                })
                .catch((error) => console.error('Error fetching topics:', error));
        }
    }, [group_id]);

    // Filter topics by search query


    // Paginate displayed topics (15 per page)
    const displayedTopics = filteredTopics.slice(
        currentPage * 15,
        (currentPage + 1) * 15
    );

    // Toggle topic selection
    const handleTopicChange = (topicId) => {
        setSelectedTopics((prev) => {
            // If user is removing an already selected topic
            if (prev.includes(topicId)) {
                return prev.filter((id) => id !== topicId);
            }
            // If user has max topics, do nothing
            if (prev.length >= MAX_TOPICS) {
                return prev;
            }
            // Otherwise, add the new topic
            return [...prev, topicId];
        });
    };

    // View more / back to start for topics pagination
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

    const [submitting, setSubmitting] = useState(false);

    // Submit form with topic validation
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prevent double submissions (safeguard against async timing issues)
        if (submitting) return;
        setSubmitting(true); // Disable button immediately

        // Client-side validation for topics
        const newErrors = {};
        if (selectedTopics.length < MIN_TOPICS) {
            newErrors.topics = 'Please select at least one topic.';
        } else if (selectedTopics.length > MAX_TOPICS) {
            newErrors.topics = 'You can select up to five topics only.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setSubmitting(false); // Stop submission process if validation fails
            return;
        } else {
            setErrors({});
        }

        // Construct form data for submission
        const formData = new FormData();
        formData.append('group_id', group_id);
        formData.append('title', document.getElementById('title').value);
        formData.append('description', document.getElementById('description').value);
        formData.append('start_date', startDate.toISOString());
        formData.append('duration', document.getElementById('duration').value);
        formData.append('type', eventType); 
        formData.append(
            'location',
            document.querySelector('input[placeholder="Search or add a location"]').value
        );

        // Add selected topics
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
            // Redirect to Home page if successful
            router.visit('/Home');
        } catch (error) {
            if (error.response?.data.errors) {
                setErrors(error.response.data.errors); // Store server validation errors
            } else {
                console.error('Error creating event:', error);
            }
        } finally {
            setSubmitting(false); // Re-enable button after process
        }
    };


    // Calculate how many topics remain
    const topicsSelected = selectedTopics.length;
    const topicsRemaining = MAX_TOPICS - topicsSelected;

    // Build dynamic topic message
    let topicsMessage = 'Please select 1–5 topics.';
    if (topicsSelected === 0) {
        topicsMessage = 'Please select 1–5 topics.';
    } else if (topicsSelected < MAX_TOPICS) {
        topicsMessage = `You can select ${topicsRemaining} more topic${topicsRemaining === 1 ? '' : 's'}.`;
    } else if (topicsSelected === MAX_TOPICS) {
        topicsMessage = 'You have selected all 5 topics.';
    }

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (group_id) {
            setLoading(true); // Start loading
            Promise.all([
                // Fetch group details
                axios.get(`/groups/${group_id}`).then((response) => setGroupDetails(response.data)),

                // Fetch topics related to the group
                axios.get(`/topics/filter-by-group`, { params: { group_id } }).then((response) => {
                    setTopics(response.data);
                    setFilteredTopics(response.data); // Initialize filtered topics
                }),
            ])
                .catch((error) => console.error('Error fetching data:', error))
                .finally(() => setLoading(false)); // End loading
        }
    }, [group_id]);

    if (loading) {
        return (
            <>
                <Navbar />
                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ height: '100vh' }}
                >
                    <div
                        className="spinner-border"
                        role="status"
                        style={{
                            width: '3rem',
                            height: '3rem',
                            color: '#B0AB8C',
                        }}
                    >
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
                <Footer />
            </>
        );
    }



    return (
        <div className="d-flex flex-column min-vh-100">
            <Head title="Create Event" />
            <Navbar />

            <div className="custom-card max-w-4xl mx-auto p-6 my-8 rounded shadow">
                <form onSubmit={handleSubmit}>
                    <h1 className="text-2xl font-bold mb-4">Create an Event</h1>

                    {/* Group */}
                    <div className="mb-6">
                        <InputLabel value="Group" />
                        <p className="font-bold text-gray-500 mb-6">
                            {groupDetails ? groupDetails.name : 'Loading...'}
                        </p>
                    </div>

                    {/* Title */}
                    <div className="mb-6">
                        <InputLabel htmlFor="title" value="Title (required)" />
                        <TextInput id="title" type="text" className="w-full" maxLength="80" required disabled={submitting} />
                        <InputError message={errors.title} />
                    </div>

                    {/* Date and Time */}
                    <div className="mb-6">
                        <InputLabel value="Date and Time" />
                        <div className="flex gap-4 items-center">
                            {/* Date Picker */}
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                className="form-control custom-date-time"
                                dateFormat="MMMM d, yyyy"
                                disabled={submitting}
                            />

                            {/* Time Picker with EET Adjustments */}
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                className="form-control custom-date-time custom-time-box"
                                showTimeSelect
                                showTimeSelectOnly
                                disabled={submitting}
                                timeIntervals={15}
                                timeCaption="Time"
                                dateFormat="HH:mm" // Display hours in 24-hour format
                                timeFormat="HH:mm" // Use 24-hour format
                                renderCustomHeader={({ date, changeTime }) => {
                                    const eetTime = new Intl.DateTimeFormat("en-US", {
                                        timeZone: "Europe/Athens",
                                        hour: "numeric",
                                        minute: "numeric",
                                        hour12: false,
                                    }).format(date);
                                    return (
                                        <div className="text-center font-medium text-gray-700">
                                            Current EET Time: {eetTime}
                                        </div>
                                    );
                                }}
                            />

                            <span className="text-gray-700">EET</span>
                        </div>
                        <InputError message={errors.start_date} />
                    </div>


                    {/* Duration */}
                    <div className="mb-6">
                        <InputLabel value="Duration (required)" />
                        <select className="form-control custom-dropdown" id="duration" defaultValue="1" disabled={submitting}>
                            <option value="1">1 hour</option>
                            <option value="2">2 hours</option>
                            <option value="3">3 hours</option>
                            <option value="4">4 hours</option>
                        </select>
                        <InputError message={errors.duration} />
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
                                disabled={submitting}
                            >
                                Upload Image
                            </button>
                            <input
                                id="event-image-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                disabled={submitting}
                            />
                        </div>
                        {groupImage && (
                            <p className="mt-2 text-sm text-gray-500">
                                Selected file: {groupImage.name}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <InputLabel htmlFor="description" value="Description (required)" />
                        <textarea
                            id="description"
                            className="form-control custom-textarea w-full"
                            placeholder="Enter event description"
                            rows="4"
                            required
                            disabled={submitting}
                        ></textarea>
                        <InputError message={errors.description} />
                    </div>

                    {/* Topics */}
                    <div className="mb-6">
                        <InputLabel value="Topics" />
                        {/* Dynamic topics message */}
                        <p className="text-sm text-gray-500 mb-2">
                            {topicsMessage}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                            {displayedTopics.map((topic) => {
                                // If user has 5 topics and this one isn't selected, disable it
                                const isDisabled =
                                    selectedTopics.length >= MAX_TOPICS &&
                                    !selectedTopics.includes(topic.id);

                                const isSelected = selectedTopics.includes(topic.id);

                                return (
                                    <button
                                        key={topic.id}
                                        type="button"
                                        disabled={isDisabled || submitting}
                                        className={`px-4 py-2 rounded-full text-sm border-2 ${isSelected
                                            ? 'bg-teal-600 text-white border-teal-600'
                                            : 'bg-teal-100 text-teal-600 border-teal-600'
                                            } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        onClick={() => handleTopicChange(topic.id)}
                                    >
                                        {topic.name}
                                    </button>
                                );
                            })}
                        </div>
                        <button
                            type="button"
                            className="text-teal-600 mt-3"
                            onClick={handleViewMore}
                            disabled={submitting}
                        >
                            {(currentPage + 1) * 15 >= filteredTopics.length
                                ? 'Back to Start'
                                : 'View More'}
                        </button>
                        <InputError message={errors.topics} />
                    </div>

                    {/* Event Type */}
                    <div className="mb-6">
                        <InputLabel value="Event Type (required)" />
                        <select
                            id="event-type"
                            className="form-control custom-dropdown w-full"
                            value={eventType} // State to hold the selected event type
                            onChange={(e) => setEventType(e.target.value)} // Update the event type
                            disabled={submitting}
                            required
                        >
                            <option value="" disabled>Select event type</option>
                            <option value="in-person">In-Person</option>
                            <option value="online">Online Meeting</option>
                        </select>
                        <InputError message={errors.eventType} />
                    </div>


                    {/* Location */}
                    <div className="mb-6">
                        <InputLabel value="Location" />
                        <TextInput
                            type="text"
                            placeholder="Search or add a location"
                            className="w-full"
                            disabled={submitting}
                        />
                        <InputError message={errors.location} />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-between mt-8">
                        <PrimaryButton
                            type="button"
                            onClick={() => router.visit('/Home')}
                            disabled={submitting}
                        >
                            Cancel
                        </PrimaryButton>
                        <PrimaryButton type="submit" disabled={submitting}>Publish</PrimaryButton>
                    </div>
                </form>
            </div>

            <Footer />
        </div>
    );
}
