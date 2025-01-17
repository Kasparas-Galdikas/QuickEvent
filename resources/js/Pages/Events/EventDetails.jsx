import React from 'react';
import { Head } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import { router } from '@inertiajs/react';
export default function EventDetails() {
    const { auth, event, host, topics, attendees } = usePage().props;

    function attendEvent(eventId) {
        axios
            .post(`/events/${eventId}/attend`)
            .then(response => {
                alert(response.data.message);
            })
            .catch(error => {
                if (error.response) {
                    alert(error.response.data.message);
                } else {
                    console.error(error);
                    alert('An error occurred while attending the event.');
                }
            });
    }


    // Debug props to ensure data is passed correctly
    console.log('Auth:', auth);
    return (
        <div className="min-h-screen flex flex-col">
            <Head title={event.title} />
            <Navbar />

            {/* Event Header Section */}
            <div className="px-5 w-full custom-card border-b border-gray-200 py-2 lg:py-6">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-3xl font-bold leading-snug overflow-hidden overflow-ellipsis">
                        {event.title}
                    </h1>

                    {/* Host Information */}
                    <div className="block w-fit hover:no-underline">
                        <div className="mt-4 flex lg:mt-5">
                            <div>
                                <img
                                    src="https://via.placeholder.com/48"
                                    alt="Host"
                                    className="rounded-full w-12 h-12 object-cover"
                                />
                            </div>
                            <div className="ml-6">
                                <div className="text-gray-600">Hosted By</div>
                                <div className="font-medium">{host}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Main Content Section - Meetup style */}
            <div className="flex w-full flex-col items-center justify-between border-t border-gray-200 pb-6 lg:px-5">
                <div className="max-w-5xl w-full">
                    <div className="flex flex-col-reverse lg:flex-row">
                        {/* Left Column */}
                        <div className="flex flex-grow flex-col lg:mt-5 lg:max-w-2xl">
                            {/* Event Image */}
                            <div className="mt-0 w-full lg:mt-8">

                                <img
                                    src={event.image_path || '/images/default-event.png'}
                                    alt="Event Cover"
                                    className="rounded-lg"
                                    style={{
                                        width: '800px', // Set the desired width
                                        height: 'auto', // Maintain aspect ratio
                                        border: '1px solid black', // Add a 1px black border
                                    }}
                                />


                            </div>

                            {/* Event Details */}
                            <div className="px-6 sm:px-4 xl:px-0 mt-5 w-full">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold">Details</h2>
                                </div>
                                <div className="break-words">
                                    <p className="mb-4">
                                        {event.description
                                            ? event.description
                                            : 'No description available for this event.'}
                                    </p>

                                    {topics && topics.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {topics.map((topic) => (
                                                <button
                                                    key={topic.id}
                                                    type="button"
                                                    className="text-teal-600 bg-teal-100 px-3 py-1 rounded-lg hover:bg-teal-200 transition-all"
                                                >
                                                    {topic.name}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>No topics associated with this event.</p>
                                    )}

                                </div>
                            </div>

                            {/* Attendees Section */}
                            <div className="px-6 sm:px-4 xl:px-0 mt-5 w-full">
                                <div className="custom-card p-6 rounded-lg">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-semibold">
                                            Attendees ({attendees && attendees.length > 0 ? attendees.length : 0})
                                        </h2>
                                        <button className="text-green-600 hover:underline">
                                            See all
                                        </button>
                                    </div>
                                    {attendees && attendees.length > 0 ? (
                                        <div className="grid grid-cols-4 gap-4">
                                            {attendees.map((attendee) => (
                                                <div key={attendee.id} className="text-center">
                                                    <img
                                                        src={`https://via.placeholder.com/64`} // Replace with actual profile image if available
                                                        alt={`Attendee ${attendee.name}`}
                                                        className="w-16 h-16 rounded-full mx-auto mb-2"
                                                    />
                                                    <p className="text-sm font-medium">{attendee.name}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : auth?.user && auth.user.id === event?.group?.user_id ? (
                                        <p className="text-gray-500 text-center mt-4">
                                            You are the host of this event. No attendees have joined yet.
                                        </p>
                                    ) : (
                                        <p className="text-gray-500 text-center mt-4">
                                            No attendees yet. Be the first to join this event!
                                        </p>
                                    )}

                                </div>
                            </div>

                        </div>

                        {/* Right Column - Event Info */}
                        <div className="w-full lg:mx-0 lg:ml-28 lg:mt-10 lg:w-90">
                            <div className="sticky top-24">
                                <div className="custom-card p-6 rounded-2xl">

                                    {/* Date and Time */}
                                    <div className="flex gap-x-4 md:gap-x-4.5 lg:gap-x-5 mb-4">
                                        <div className="w-6 h-6 mt-1">
                                            <i className="fas fa-clock"></i>
                                        </div>
                                        {/* Event Date and Time */}
                                        <div>
                                            {/* Display Date */}
                                            <div>
                                                {new Date(event.event_date).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </div>

                                            {/* Display Time Range with Custom Time Zone */}
                                            <div className="text-gray-600">
                                                {new Date(`1970-01-01T${event.event_time}`).toLocaleTimeString('en-US', {
                                                    hour: 'numeric',
                                                    minute: 'numeric',
                                                })}
                                                {' '}
                                                to{' '}
                                                {new Date(
                                                    new Date(`1970-01-01T${event.event_time}`).getTime() + event.duration * 60 * 60 * 1000
                                                ).toLocaleTimeString('en-US', {
                                                    hour: 'numeric',
                                                    minute: 'numeric',
                                                })}
                                                {' '}
                                                EET
                                            </div>
                                        </div>

                                    </div>

                                    {/* Location */}
                                    <div className="flex mt-5">
                                        <div className="w-6 h-6 mt-1">
                                            <i className="fas fa-video"></i>
                                        </div>
                                        <div className="overflow-hidden pl-4">
                                            <div>Online event</div>
                                            <div className="text-gray-600">Link visible for attendees</div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
<div className="space-y-3 mt-6">
    {auth?.user && event?.group && auth.user.id === event.group.user_id ? (
        <>
            <button
                className="w-full custom-btn py-3 px-4 rounded-lg"
                onClick={() => router.visit(`/events/edit/${event.id}`)}
            >
                Edit Event Information
            </button>
            {/* Remove Button */}
            <button
                className="w-full custom-btn py-3 px-4 rounded-lg bg-red-600 hover:bg-red-700"
                onClick={() => {
                    if(confirm('Are you sure you want to delete this event?')) {
                        axios.delete(`/events/${event.id}`)
                            .then(() => {
                                router.visit('/Home'); // Redirect to home after deletion
                            })
                            .catch((error) => {
                                console.error('Error deleting event:', error);
                                alert('Failed to delete event');
                            });
                    }
                }}
            >
                <i className="fas fa-trash me-1"></i>
                Remove Event
            </button>
        </>
    ) : (
        // Display Attend and Share buttons for non-hosts
        <>
            <button
                className="w-full custom-btn bg-green-600 py-3 px-4 rounded-lg"
                onClick={() => attendEvent(event.id)}
            >
                Attend Online
            </button>
            <button className="w-full bg-white custom-btn bg-green-600 py-3 px-4 rounded-lg">
                Share
            </button>
        </>
    )}
</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-grow"></div>
            <Footer />

            {/* Mobile Action Bar - Meetup style */}
            <div className="sticky bottom-0 z-10 w-full bg-white px-5 py-5 border-t lg:hidden">
                <div className="max-w-5xl mx-auto">
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="font-semibold">FREE</div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button className="border-2 border-green-600 text-green-600 px-4 py-2 rounded-lg hover:bg-green-50">
                                Share
                            </button>
                            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                                Attend Online
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}