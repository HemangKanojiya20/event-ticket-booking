import React, { useState } from "react";

interface CreateEventModalProps {
  show: boolean;
  onClose: () => void;
  onEventCreated: () => void;
  onError: (msg: string) => void;
  createEvent: (data: {
    title: string;
    date: string;
    venue: string;
    description?: string;
  }) => Promise<void>;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({
  show,
  onClose,
  onEventCreated,
  onError,
  createEvent,
}) => {
  const [form, setForm] = useState({
    title: "",
    date: "",
    venue: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.date || !form.venue) {
      onError("Please fill all required fields.");
      return;
    }
    setLoading(true);
    try {
      await createEvent(form);
      onEventCreated();
      setForm({ title: "", date: "", venue: "", description: "" });
    } catch (err) {
      console.log("🚀 ~ handleSubmit ~ err:", err);
      onError("Failed to create event.");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div
      className="modal show d-block"
      tabIndex={-1}
      style={{ background: "rgba(0,0,0,0.3)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Create New Event</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label fw-bold">Title *</label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Date & Time *</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Venue *</label>
                <input
                  type="text"
                  className="form-control"
                  name="venue"
                  value={form.venue}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Event"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEventModal;
