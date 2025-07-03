import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Event } from "../types";
import { eventService } from "../services/api";
import EventCard from "../components/EventCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { Calendar, Ticket } from "lucide-react";

import CreateEventModal from "../components/CreateEventModal";

const HomePage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleCreateEvent = async (data: {
    title: string;
    date: string;
    venue: string;
    description?: string;
  }) => {
    await eventService.createEvent(data);
    await fetchEvents();
    setShowCreateModal(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const eventsData = await eventService.getAllEvents();
      setEvents(eventsData);
    } catch (err) {
      setError("Failed to load events. Please try again later.");
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  if (loading) {
    return <LoadingSpinner message="Loading events..." />;
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error</h4>
          <p>{error}</p>
          <hr />
          <button className="btn btn-outline-danger" onClick={fetchEvents}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Hero Section */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="jumbotron bg-primary text-white rounded-3 p-5 text-center">
            <div className="flex items-center justify-center">
              <Ticket className="me-3" size={48} />
              <h1 className="display-4 mb-[12px]">Event Ticket Booking</h1>
            </div>
            <p className="lead mb-4">
              Discover amazing events and book your tickets with ease. Get group
              discounts for 4 or more tickets!
            </p>
            <div className="d-flex justify-content-center">
              <div className="badge bg-light text-dark me-3 p-2">
                <Calendar size={16} className="me-1" />
                Secure Booking
              </div>
              <div className="badge bg-light text-dark me-3 p-2">
                <Ticket size={16} className="me-1" />
                Group Discounts
              </div>
              <div className="badge bg-light text-dark p-2">
                <Calendar size={16} className="me-1" />
                Real-time Availability
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Event Modal */}
      <CreateEventModal
        show={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setModalError(null);
        }}
        onEventCreated={() => {
          setShowCreateModal(false);
          setModalError(null);
          fetchEvents();
        }}
        onError={setModalError}
        createEvent={handleCreateEvent}
      />
      {modalError && (
        <div className="alert alert-danger text-center">{modalError}</div>
      )}

      {/* Events Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="flex items-center justify-between mb-4">
            <h2>
              <Calendar className="me-2" size={32} />
              Upcoming Events
            </h2>
            <button
              className="btn btn-warning"
              onClick={() => setShowCreateModal(true)}
            >
              + Create New Event
            </button>
          </div>
          {events.length === 0 ? (
            <div className="alert alert-info text-center">
              <h4>No Events Available</h4>
              <p>Check back later for upcoming events!</p>
            </div>
          ) : (
            <div className="row">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
