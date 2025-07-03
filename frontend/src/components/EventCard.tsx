import React from "react";
import { Event } from "../types";
import { Calendar, MapPin, Users } from "lucide-react";

interface EventCardProps {
  event: Event;
  onViewDetails: (eventId: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onViewDetails }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTotalSeats = () => {
    return event?.sections?.reduce((total, section) => {
      return (
        total +
        section.rows.reduce((sectionTotal, row) => {
          return sectionTotal + row.seats.length;
        }, 0)
      );
    }, 0);
  };

  const getAvailableSeats = () => {
    return event?.sections?.reduce((total, section) => {
      return (
        total +
        section.rows.reduce((sectionTotal, row) => {
          return (
            sectionTotal + row.seats.filter((seat) => !seat.isBooked).length
          );
        }, 0)
      );
    }, 0);
  };

  const getMinPrice = () => {
    return Math.min(
      ...(event?.sections
        ? event?.sections?.map((section) => section.price) || []
        : [])
    );
  };

  const availableSeats = getAvailableSeats();
  const totalSeats = getTotalSeats();
  const minPrice = getMinPrice();

  return (
    <div className="col-lg-4 col-md-6 mb-4">
      <div className="card h-100 shadow-sm border-0 event-card">
        <div className="card-body d-flex flex-column">
          <h5 className="card-title text-primary mb-3">{event.title}</h5>
          <p className="card-text text-muted mb-3">{event.description}</p>

          <div className="mb-3">
            <div className="d-flex align-items-center mb-2">
              <Calendar size={16} className="text-secondary me-2" />
              <small className="text-muted">{formatDate(event.date)}</small>
            </div>
            <div className="d-flex align-items-center mb-2">
              <MapPin size={16} className="text-secondary me-2" />
              <small className="text-muted">{event.venue}</small>
            </div>
            <div className="d-flex align-items-center">
              <Users size={16} className="text-secondary me-2" />
              <small className="text-muted">
                {availableSeats} of {totalSeats} seats available
              </small>
            </div>
          </div>

          <div className="mt-auto">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="badge bg-success">From ${minPrice}</span>
              <span
                className={`badge ${
                  availableSeats > 0 ? "bg-info" : "bg-danger"
                }`}
              >
                {availableSeats > 0 ? "Available" : "Sold Out"}
              </span>
            </div>

            <button
              className="btn btn-primary w-100"
              onClick={() => onViewDetails(event.id)}
              disabled={availableSeats === 0}
            >
              {availableSeats > 0 ? "View Details & Book" : "Sold Out"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
