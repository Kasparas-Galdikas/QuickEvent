import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';

export default function CreateEvent({ topics = [] }) {
    const [startDate, setStartDate] = useState(new Date());
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(0);

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

    return (
        <div className="d-flex flex-column min-vh-100">
            <Head title="Create Event" />
            <Navbar />

            {/* Wrapped form in custom-card */}
            <div className="custom-card max-w-4xl mx-auto p-6 my-8 rounded shadow">
                <form>
                    <h1 className="text-2xl font-bold mb-4">Create an Event</h1>
                    <p className="text-gray-600 mb-2 fs-6">My Group name</p>
                    <hr />

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
                            <option>2 hours</option>
                            <option>3 hours</option>
                        </select>
                    </div>

                    {/* Featured Photo */}
                    <div className="mb-6">
                        <InputLabel value="Featured photo" />
                        <p className="text-sm text-gray-500 mb-2">
                            Don't have a photo handy? Try using a free image from the Pexels photo library.
                        </p>
                        <PrimaryButton>Upload Photo</PrimaryButton>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <InputLabel value="Description (required)" />
                        <textarea className="form-control custom-textarea" rows="6" />
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
