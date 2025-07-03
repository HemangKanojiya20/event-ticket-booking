import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Event,
  EventAvailability,
  BookingRequest,
  BookingResponse,
} from "../types";
import { eventService } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import SeatAvailability from "../components/SeatAvailability";
import BookingForm from "../components/BookingForm";
import {
  Calendar,
  MapPin,
  ArrowLeft,
  CheckCircle,
  XCircle,
} from "lucide-react";

const EventDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [event, setEvent] = useState<Event | null>(null);
  const [availability, setAvailability] = useState<EventAvailability | null>(
    null
  );
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [selectedRow, setSelectedRow] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingResult, setBookingResult] = useState<BookingResponse | null>(
    null
  );

  useEffect(() => {
    if (id) {
      fetchEventDetails();
    }
  }, [id]);

  const fetchEventDetails = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const [eventData, availabilityData] = await Promise.all([
        eventService.getEventById(id),
        eventService.getEventAvailability(id),
      ]);

      setEvent(eventData);
      setAvailability(availabilityData);
    } catch (err) {
      setError("Failed to load event details. Please try again later.");
      console.error("Error fetching event details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSectionChange = (sectionId: string) => {
    setSelectedSection(sectionId);
    setSelectedRow(""); // Reset row selection when section changes
  };

  const handleRowChange = (rowId: string) => {
    setSelectedRow(rowId);
  };

  const handleBookingSubmit = async (bookingData: BookingRequest) => {
    if (!id) return;

    try {
      setBookingLoading(true);
      const result = await eventService.bookTickets(id, bookingData);
      setBookingResult(result);

      if (result.success) {
        // Refresh availability after successful booking
        await fetchEventDetails();
        setSelectedSection("");
        setSelectedRow("");
      }
    } catch (err) {
      setBookingResult({
        success: false,
        error: "Failed to process booking. Please try again.",
      });
      console.error("Error booking tickets:", err);
    } finally {
      setBookingLoading(false);
    }
  };

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

  if (loading) {
    return <LoadingSpinner message="Loading event details..." />;
  }

  if (error || !event || !availability) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error</h4>
          <p>{error || "Event not found"}</p>
          <hr />
          <button
            className="btn btn-outline-danger flex items-center gap-2"
            onClick={() => navigate("/")}
          >
            <ArrowLeft size={16} />
            <span className="mb-1">Back to Events</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Navigation */}
      <div className="row mb-4">
        <div className="col-12">
          <button
            className="btn btn-outline-secondary flex items-center gap-2"
            onClick={() => navigate("/")}
          >
            <ArrowLeft size={16} />
            <span className="mb-1">Back to Events</span>
          </button>
        </div>
      </div>

      {/* Event Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h1 className="display-5 text-primary mb-3">{event.title}</h1>
              <p className="lead text-muted mb-4">{event.description}</p>

              <div className="row">
                <div className="col-md-6">
                  <div className="d-flex align-items-center mb-3">
                    <Calendar size={20} className="text-secondary me-3" />
                    <div>
                      <h6 className="mb-1">Date & Time</h6>
                      <p className="mb-0 text-muted">
                        {formatDate(event.date)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center mb-3">
                    <MapPin size={20} className="text-secondary me-3" />
                    <div>
                      <h6 className="mb-1">Venue</h6>
                      <p className="mb-0 text-muted">{event.venue}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Result */}
      {bookingResult && (
        <div className="row mb-4">
          <div className="col-12">
            <div
              className={`alert ${
                bookingResult.success ? "alert-success" : "alert-danger"
              }`}
            >
              <h4 className="alert-heading d-flex align-items-center">
                {bookingResult.success ? (
                  <CheckCircle size={24} className="me-2" />
                ) : (
                  <XCircle size={24} className="me-2" />
                )}
                {bookingResult.success
                  ? "Booking Successful!"
                  : "Booking Failed"}
              </h4>

              {bookingResult.success ? (
                <div>
                  <p className="mb-2">
                    <strong>Booking ID:</strong> {bookingResult.bookingId}
                  </p>
                  <p className="mb-2">
                    <strong>Tickets:</strong>{" "}
                    {bookingResult.bookedSeats?.length} tickets booked
                  </p>
                  <p className="mb-2">
                    <strong>Total Amount:</strong> $
                    {bookingResult.totalAmount?.toFixed(2)}
                  </p>
                  {bookingResult.discountApplied && (
                    <p className="mb-2 text-success">
                      <strong>Group Discount Applied:</strong> You saved $
                      {bookingResult.discountAmount?.toFixed(2)}!
                    </p>
                  )}
                  <hr />
                  <p className="mb-0">
                    A confirmation email will be sent to you shortly.
                  </p>
                </div>
              ) : (
                <p className="mb-0">{bookingResult.error}</p>
              )}

              <button
                className="btn btn-outline-secondary btn-sm mt-2"
                onClick={() => setBookingResult(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="row">
        {/* Seat Availability */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <SeatAvailability
                sections={availability.sections}
                selectedSection={selectedSection}
                selectedRow={selectedRow}
                onSectionChange={handleSectionChange}
                onRowChange={handleRowChange}
              />
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm sticky-top">
            <div className="card-body p-4">
              <BookingForm
                sections={availability.sections}
                selectedSection={selectedSection}
                selectedRow={selectedRow}
                onBookingSubmit={handleBookingSubmit}
                isLoading={bookingLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
