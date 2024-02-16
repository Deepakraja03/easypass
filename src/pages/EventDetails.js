import React, { useState, useEffect } from "react";
import img from '../assets/photo-1522327646852-4e28586a40dd.avif';
import { getAuth } from "firebase/auth";
import { useParams, useLocation } from "react-router-dom";

const bg = {
    backgroundImage: `url(${img})`,
    backgroundSize: "cover",
};

const EventDetails = () => {
    const { id } = useParams();
    const location = useLocation();
    const userEmailParam = new URLSearchParams(location.search).get("userEmail");
    const [userEmail, setUserEmail] = useState(userEmailParam); // Initialize userEmail with the parameter value
    const [event, setEvent] = useState(null);
    const [transactionStatus, setTransactionStatus] = useState(null);
    const [confirmation, setConfirmation] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [approvalModal, setApprovalModal] = useState(false);
    const [alreadyBooked, setAlreadyBooked] = useState(false);

    useEffect(() => {
        const fetchUserDetails = async () => {
            const auth = getAuth();
            const user = auth.currentUser;
            console.log("USER EMAIL IS ", user?.email);
            if (user) {
                setUserEmail(user.email);
            } else {
                console.log("User is not signed in");
            }
        };

        fetchUserDetails();

        const fetchEventDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/events/${id}`);
                if (response.ok) {
                    console.log(response);
                    const eventData = await response.json();
                    setEvent(eventData);
                    if (eventData.bookedBy.includes(userEmail)) {
                        setAlreadyBooked(true);
                    }
                } else {
                    console.error("Failed to fetch event details");
                }
            } catch (error) {
                console.error("Error fetching event details:", error);
            }
        };
        fetchEventDetails();
    }, [id, userEmail]);

    const bookTicket = async () => {
        if (!userEmail) {
            console.log("User is not signed in");
            return;
        }

        if (alreadyBooked) {
            setTransactionStatus("You have already booked a ticket for this event");
            setShowModal(true);
        } else {
            setTransactionStatus("Are you sure you want to book a ticket for this event?");
            setConfirmation(true);
            setShowModal(true);
        }
    };
    
    // Frontend: EventDetails.js

const handleConfirmation = async () => {
    setShowModal(false);
    setConfirmation(false);

    try {
        const response = await fetch(`http://localhost:5000/api/events/book/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userEmail: userEmail
            })
        });

        if (response.ok) {
            const data = await response.json();
            if (data.message === "Ticket booked successfully") {
                // Show ticket booked popup
                alert("Ticket booked successfully");
            } else {
                // Show error message
                alert(data.message);
            }
        } else {
            // Handle other HTTP errors
            console.error("Failed to book ticket:", response.statusText);
        }
    } catch (error) {
        console.error("Error booking ticket:", error);
    }
};

    const closeApprovalModal = () => {
        setApprovalModal(false);
    };

    return (
        <div className="bg-black play-font h-screen" style={bg}>
            <div>
                <h1 className="text-4xl text-yellow-400 flex justify-center pt-5 font-bold">
                    Ticket Booking
                </h1>
            </div>

            <div className="text-white">
                <h2 className="flex justify-center py-7">Event ID: {id}</h2>

                {event ? (
                    <div className="flex justify-center h-full">
                        <div className="bg-yellow-100 w-3/6 h-3/6 p-8 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-bold mb-4 text-gray-900">{event.name}</h2>
                            <div className="text-gray-700 mb-4">
                                <p className="py-2"><span className="font-semibold">Location:</span> {event.location}</p>
                                <p className="py-2"><span className="font-semibold">Total Tickets:</span> {event.totaltickets}</p>
                                <p className="py-2"><span className="font-semibold">Ticket Price:</span> {event.price}</p>
                                <p className="py-2"><span className="font-semibold">Event Date:</span> {event.date}</p>
                                <p className="py-2"><span className="font-semibold">Event Time:</span> {event.time}</p>
                            </div>
                            <div className="flex justify-center">
                                <button onClick={bookTicket} className="text-white bg-gradient-to-r from-red-800 via-yellow-600 to-yellow-500 hover:from-yellow-500 hover:via-yellow-600 hover:to-red-800 items-center text-xl font-semibold rounded-lg px-4 py-2 hover:bg-green-700">
                                    Book Now
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="flex justify-center py-10">Loading event details...</p>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
                    <div className="bg-white rounded-lg p-8 z-10">
                        <h2 className="text-2xl mb-4">{transactionStatus}</h2>
                        <div className="flex justify-center">
                            <button className="mr-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleConfirmation}>
                                Yes
                            </button>
                            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => setShowModal(false)}>
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Approval Modal */}
            {approvalModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
                    <div className="bg-white rounded-lg p-8 z-10">
                        <h2 className="text-2xl mb-4">Request sent, waiting for the host to approve</h2>
                        <div className="flex justify-center">
                            <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded" onClick={closeApprovalModal}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventDetails;
