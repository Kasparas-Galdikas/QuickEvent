import React, { useState, useEffect } from "react";
import { Head } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import Swal from "sweetalert2";
import { router } from '@inertiajs/react';
import Register from "../Auth/Register";
import axios from 'axios';
import { DateTime } from 'luxon';

export default function EventDetails() {
    const { auth, event, host, topics } = usePage().props; // Remove attendees from here
    const [isAttending, setIsAttending] = useState(false);
    const [attendees, setAttendees] = useState([]); // State to manage attendees list
    const startDateTime = new Date(`${event.event_date}T${event.event_time}`);
    const endDateTime = new Date(startDateTime.getTime() + event.duration * 60 * 60 * 1000);
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    const openRegisterModal = () => setShowRegisterModal(true);
    const closeRegisterModal = () => setShowRegisterModal(false);


    useEffect(() => {
        // Check if the user is attending the event
        axios
            .get(`/events/${event.id}/is-attending`)
            .then((response) => {
                setIsAttending(response.data.isAttending);
            })
            .catch((error) => {
                console.error("Error checking attendance status:", error);
            });

        // Fetch the initial list of attendees
        fetchUpdatedAttendees(event.id, setAttendees);
    }, [event.id]);

    function toggleAttendance(eventId, isAttending, setIsAttending, setAttendees) {
        if (isAttending) {
            Swal.fire({
                title: "Are you sure?",
                text: "Do you want to stop attending this event?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, leave",
                cancelButtonText: "Cancel",
                reverseButtons: true,
                customClass: {
                    confirmButton: "custom-confirm-button",
                    cancelButton: "custom-cancel-button",
                    popup: "custom-popup", // Add a custom popup class
                },
            }).then((result) => {
                if (result.isConfirmed) {
                    axios
                        .delete(`/events/${eventId}/attend`)
                        .then(() => {
                            Swal.fire({
                                title: "Removed",
                                text: "You have stopped attending the event.",
                                icon: "success",
                                confirmButtonText: "OK",
                                customClass: {
                                    confirmButton: "custom-confirm-button",
                                    popup: "custom-popup", // Add the custom popup class
                                },
                            });
                            setIsAttending(false);
                            fetchUpdatedAttendees(eventId, setAttendees);
                        })
                        .catch((error) => {
                            console.error("Error stopping attendance:", error);
                            Swal.fire({
                                title: "Error",
                                text: "Failed to stop attending the event.",
                                icon: "error",
                                confirmButtonText: "OK",
                                customClass: {
                                    confirmButton: "custom-confirm-button",
                                    popup: "custom-popup", // Add the custom popup class
                                },
                            });
                        });
                }
            });
        } else {
            axios
                .post(`/events/${eventId}/attend`)
                .then(() => {
                    Swal.fire({
                        title: "Joined",
                        text: "You are now attending this event.",
                        icon: "success",
                        confirmButtonText: "OK",
                        customClass: {
                            confirmButton: "custom-confirm-button",
                            popup: "custom-popup", // Add the custom popup class
                        },
                    });
                    setIsAttending(true);
                    fetchUpdatedAttendees(eventId, setAttendees);
                })
                .catch((error) => {
                    console.error("Error attending event:", error);
                    Swal.fire({
                        title: "Error",
                        text: "Failed to attend the event.",
                        icon: "error",
                        confirmButtonText: "OK",
                        customClass: {
                            confirmButton: "custom-confirm-button",
                            popup: "custom-popup", // Add the custom popup class
                        },
                    });
                });
        }
    }

    const handleEventDeletion = (eventId, router) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you really want to delete this event? This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it",
            cancelButtonText: "Cancel",
            reverseButtons: true,
            customClass: {
                confirmButton: "custom-confirm-button",
                cancelButton: "custom-cancel-button",
                popup: "custom-popup", // Add a custom popup class
            },
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(`/events/${eventId}`)
                    .then(() => {
                        Swal.fire({
                            title: "Deleted",
                            text: "The event has been successfully deleted.",
                            icon: "success",
                            confirmButtonText: "OK",
                            customClass: {
                                confirmButton: "custom-confirm-button",
                                popup: "custom-popup", // Add the custom popup class
                            },
                        }).then(() => {
                            router.visit('/Home');
                        });
                    })
                    .catch((error) => {
                        console.error("Error deleting event:", error);
                        Swal.fire({
                            title: "Error",
                            text: "Failed to delete the event.",
                            icon: "error",
                            confirmButtonText: "OK",
                            customClass: {
                                confirmButton: "custom-confirm-button",
                                popup: "custom-popup", // Add the custom popup class
                            },
                        });
                    });
            }
        });
    };

    // Fetch updated attendees
    function fetchUpdatedAttendees(eventId, setAttendees) {
        axios
            .get(`/events/${eventId}/attendees`)
            .then((response) => {
                setAttendees(response.data.attendees);
            })
            .catch((error) => {
                console.error("Error fetching updated attendees:", error);
            });
    }

    const isJoinButtonDisabled = (eventDate, eventTime, duration) => {
        const eventStart = DateTime.fromISO(`${eventDate}T${eventTime}`, { zone: 'Europe/Vilnius' }); // EET
        const eventEnd = eventStart.plus({ minutes: duration * 60 }); // Convert hours to minutes
        const now = DateTime.now().setZone('Europe/Vilnius'); // Current time in EET

        return now < eventStart || now > eventEnd; // Disable before start or after end
    };


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

                    {/* Registration Modal */}
                    <Register
                        show={showRegisterModal}
                        onClose={closeRegisterModal}

                    />


                    {/* Host Information */}
                    <div className="block w-fit hover:no-underline">
                        <div className="mt-4 flex lg:mt-5">
                            <div>
                                <img
                                    src="/images/default-profile.png"
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
                                    src={
                                        event.image_path
                                            ? `/storage/${event.image_path}` // Ensure relative paths are prefixed correctly
                                            : '/images/default-event.png' // Fallback image
                                    }
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
                                            Attendees ({attendees.length})
                                        </h2>
                                    </div>
                                    {attendees.length > 0 ? (
                                        <div className="grid grid-cols-4 gap-4">
                                            {attendees.map((attendee) => (
                                                <div key={attendee.id} className="text-center">
                                                    <img
                                                        src={attendee.image_path ? `/storage/${attendee.image_path}` : '/images/default-profile.png'}
                                                        alt={attendee.name}
                                                        className="w-16 h-16 rounded-full mx-auto mb-2"
                                                    />

                                                    <p className="text-sm font-medium">{attendee.name}</p>
                                                </div>
                                            ))}
                                        </div>
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
                                                {new Intl.DateTimeFormat('en-US', {
                                                    timeZone: 'Europe/Athens', // Specify the desired European time zone
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                }).format(new Date(event.event_date))}
                                            </div>

                                            {/* Display Time Range with Europe Time Zone */}
                                            <div className="text-gray-600">
                                                {new Intl.DateTimeFormat('en-US', {
                                                    timeZone: 'Europe/Athens',
                                                    hour: 'numeric',
                                                    minute: 'numeric',
                                                    hour12: false,
                                                }).format(startDateTime)}
                                                {' '}
                                                to{' '}
                                                {new Intl.DateTimeFormat('en-US', {
                                                    timeZone: 'Europe/Athens',
                                                    hour: 'numeric',
                                                    minute: 'numeric',
                                                    hour12: false,
                                                }).format(endDateTime)}
                                                {' '}
                                                EET
                                            </div>
                                        </div>

                                    </div>

                                    {/* Location */}
                                    {event.type === 'online' ? (
                                        <div className="flex mt-5">
                                            <div className="w-6 h-6 mt-1">
                                                <i className="fas fa-video"></i>
                                            </div>
                                            <div className="overflow-hidden pl-4">
                                                <div>Online event</div>
                                                <div className="text-gray-600">Button below visible for attendees</div>
                                            </div>
                                        </div>
                                    ) : event.type === 'in-person' ? (
                                        <div className="flex mt-5">
                                            <div className="w-6 h-6 mt-1">
                                                <i className="fas fa-map-marker-alt"></i>
                                            </div>
                                            <div className="overflow-hidden pl-4">
                                                <div>In-person event</div>
                                                <div className="text-gray-600">{event.location}</div>
                                            </div>
                                        </div>
                                    ) : null}



                                    <div className="space-y-3 mt-6">
                                        {auth?.user ? (
                                            <>
                                                {/* CASE 1: Host */}
                                                {auth.user.id === event?.group?.user_id ? (
                                                    <>
                                                        {/* Edit Event */}
                                                        <button
                                                            className="w-full custom-btn py-3 px-4 rounded-lg"
                                                            onClick={() => router.get(`/events/edit/${event.id}`)}
                                                        >
                                                            Edit Event Information
                                                        </button>

                                                        {/* Join Online Meeting (Host as Moderator) */}
                                                        {event.type === 'online' && (
                                                            <button
                                                                className={`w-full custom-btn py-3 px-4 rounded-lg ${isJoinButtonDisabled(event.event_date, event.event_time, event.duration)
                                                                    ? 'opacity-50 cursor-not-allowed'
                                                                    : ''
                                                                    }`}
                                                                onClick={() => {
                                                                    // Open the meeting in a new tab
                                                                    const meetingUrl = `/meetings/${event.slug}`;
                                                                    window.open(meetingUrl, '_blank');
                                                                }}
                                                                disabled={isJoinButtonDisabled(event.event_date, event.event_time, event.duration)}
                                                            >
                                                                Join Online Meeting
                                                            </button>
                                                        )}

                                                        {/* Remove Event */}
                                                        <button
                                                            className="w-full custom-btn py-3 px-4 rounded-lg"
                                                            onClick={() => handleEventDeletion(event.id, router)}
                                                        >
                                                            Remove Event
                                                        </button>
                                                    </>
                                                ) : (
                                                    /* CASE 2: Attendees */
                                                    <>
                                                        {/* Join Online Meeting (Only for attendees) */}
                                                        {isAttending && event.type === 'online' && (
                                                            <button
                                                                className={`w-full custom-btn py-3 px-4 rounded-lg ${isJoinButtonDisabled(event.event_date, event.event_time, event.duration)
                                                                    ? 'opacity-50 cursor-not-allowed'
                                                                    : ''
                                                                    }`}
                                                                onClick={() => {
                                                                    // Open the meeting in a new tab
                                                                    const meetingUrl = `/meetings/${event.slug}`;
                                                                    window.open(meetingUrl, '_blank');
                                                                }}
                                                                disabled={isJoinButtonDisabled(event.event_date, event.event_time, event.duration)}
                                                            >
                                                                Join Online Meeting
                                                            </button>
                                                        )}

                                                        {/* Attend or Stop Attend */}
                                                        {isAttending ? (
                                                            <button
                                                                className="w-full custom-btn py-3 px-4 rounded-lg bg-gray-400"
                                                                onClick={() =>
                                                                    toggleAttendance(event.id, isAttending, setIsAttending, setAttendees)
                                                                }
                                                            >
                                                                Stop Attend
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className="w-full custom-btn py-3 px-4 rounded-lg bg-green-600"
                                                                onClick={() =>
                                                                    toggleAttendance(event.id, isAttending, setIsAttending, setAttendees)
                                                                }
                                                            >
                                                                Attend
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            </>
                                        ) : (
                                            /* CASE 3: Not Authenticated (Prompt to Register/Log In) */
                                            <>
                                                <button
                                                    className="w-full custom-btn py-3 px-4 rounded-lg"
                                                    onClick={openRegisterModal}
                                                >
                                                    Register to Attend
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
        </div>
    );
}