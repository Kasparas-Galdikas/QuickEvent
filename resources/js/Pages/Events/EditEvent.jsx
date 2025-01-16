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

export default function EditEvent({ event, topics: initialTopics }) {
    const [startDate, setStartDate] = useState(new Date(event.event_date + 'T' + event.event_time));
    const [selectedTopics, setSelectedTopics] = useState(event.topics.map(t => t.id));
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [topics, setTopics] = useState(initialTopics);
    const [groupDetails, setGroupDetails] = useState(event.group);
    const [groupImage, setGroupImage] = useState(null);
    const [errors, setErrors] = useState({});
    const [filteredTopics, setFilteredTopics] = useState(initialTopics);

    // Constants for min/max topic selection
    const MIN_TOPICS = 1;
    const MAX_TOPICS = 5;

    // Initialize form data
    const [formData, setFormData] = useState({
        title: event.title,
        description: event.description,
        location: event.location,
        duration: event.duration.toString()
    });

    // Handle form field changes
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    // Paginate displayed topics (15 per page)
    const displayedTopics = filteredTopics.slice(
        currentPage * 15,
        (currentPage + 1) * 15
    );

    // Toggle topic selection
    const handleTopicChange = (topicId) => {
        setSelectedTopics((prev) => {
            if (prev.includes(topicId)) {
                return prev.filter((id) => id !== topicId);
            }
            if (prev.length >= MAX_TOPICS) {
                return prev;
            }
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

    // Submit form with topic validation
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Client-side validation for topics
        const newErrors = {};
        if (selectedTopics.length < MIN_TOPICS) {
            newErrors.topics = 'Please select at least one topic.';
        } else if (selectedTopics.length > MAX_TOPICS) {
            newErrors.topics = 'You can select up to five topics only.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Construct form data for submission
        const updateFormData = new FormData();
        updateFormData.append('_method', 'PUT'); // Laravel method spoofing
        updateFormData.append('title', formData.title);
        updateFormData.append('description', formData.description);
        updateFormData.append('start_date', startDate.toISOString());
        updateFormData.append('duration', formData.duration);
        updateFormData.append('location', formData.location);

        selectedTopics.forEach((topic) => {
            updateFormData.append('topics[]', topic);
        });

        if (groupImage) {
            updateFormData.append('image', groupImage);
        }

        try {
            await axios.post(`/events/${event.id}`, updateFormData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            router.visit('/Home');
        } catch (error) {
            if (error.response?.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                console.error('Error updating event:', error);
            }
        }
    };

    // Calculate how many topics remain
    const topicsSelected = selectedTopics.length;
    const topicsRemaining = MAX_TOPICS - topicsSelected;
    let topicsMessage = topicsSelected === 0 
        ? 'Please select 1–5 topics.' 
        : topicsSelected < MAX_TOPICS 
        ? `You can select ${topicsRemaining} more topic${topicsRemaining === 1 ? '' : 's'}.`
        : 'You have selected all 5 topics.';

    return (
        <div className="d-flex flex-column min-vh-100">
            <Head title="Edit Event" />
            <Navbar />

            <div className="custom-card max-w-4xl mx-auto p-6 my-8 rounded shadow">
                <form onSubmit={handleSubmit}>
                    <h1 className="text-2xl font-bold mb-4">Edit Event</h1>

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
                        <TextInput
                            id="title"
                            type="text"
                            className="w-full"
                            maxLength="80"
                            required
                            value={formData.title}
                            onChange={handleChange}
                        />
                        <InputError message={errors.title} />
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
                        <InputError message={errors.start_date} />
                    </div>

                    {/* Duration */}
                    <div className="mb-6">
                        <InputLabel value="Duration (required)" />
                        <select 
                            className="form-control custom-dropdown" 
                            id="duration" 
                            value={formData.duration}
                            onChange={handleChange}
                        >
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
                            {event.image_path && (
                                <div className="mb-3">
                                    <img 
                                        src={event.image_path} 
                                        alt="Current event image" 
                                        className="rounded w-48 h-32 object-cover"
                                    />
                                </div>
                            )}
                            <button
                                type="button"
                                className="btn mt-2 custom-btn px-3 py-1"
                                style={{ fontSize: '14px' }}
                                onClick={() => document.getElementById('event-image-upload').click()}
                            >
                                {event.image_path ? 'Change Image' : 'Upload Image'}
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
                                Selected new file: {groupImage.name}
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
                            value={formData.description}
                            onChange={handleChange}
                        ></textarea>
                        <InputError message={errors.description} />
                    </div>

                    {/* Topics */}
                    <div className="mb-6">
                        <InputLabel value="Topics" />
                        <p className="text-sm text-gray-500 mb-2">
                            {topicsMessage}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                            {displayedTopics.map((topic) => {
                                const isDisabled =
                                    selectedTopics.length >= MAX_TOPICS &&
                                    !selectedTopics.includes(topic.id);

                                const isSelected = selectedTopics.includes(topic.id);

                                return (
                                    <button
                                        key={topic.id}
                                        type="button"
                                        disabled={isDisabled}
                                        className={`px-4 py-2 rounded-full text-sm border-2 transition-colors ${
                                            isSelected
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
                        >
                            {(currentPage + 1) * 15 >= filteredTopics.length
                                ? 'Back to Start'
                                : 'View More'}
                        </button>
                        <InputError message={errors.topics} />
                    </div>

                    {/* Location */}
                    <div className="mb-6">
                        <InputLabel value="Location" />
                        <TextInput
                            id="location"
                            type="text"
                            placeholder="Search or add a location"
                            className="w-full"
                            value={formData.location}
                            onChange={handleChange}
                        />
                        <InputError message={errors.location} />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-between mt-8">
                        <PrimaryButton 
                            type="button" 
                            onClick={() => router.visit(`/events/details/${event.slug}`)}
                        >
                            Cancel
                        </PrimaryButton>
                        <PrimaryButton type="submit">Save Changes</PrimaryButton>
                    </div>
                </form>
            </div>

            <Footer />
        </div>
    );
}