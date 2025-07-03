import React, { useState } from 'react';
import { BookingRequest, SectionAvailability } from '../types';

interface BookingFormProps {
  sections: SectionAvailability[];
  selectedSection: string;
  selectedRow: string;
  onBookingSubmit: (bookingData: BookingRequest) => void;
  isLoading: boolean;
}

const BookingForm: React.FC<BookingFormProps> = ({
  sections,
  selectedSection,
  selectedRow,
  onBookingSubmit,
  isLoading
}) => {
  const [numberOfTickets, setNumberOfTickets] = useState<number>(1);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const selectedSectionData = sections.find(s => s.sectionId === selectedSection);
  const selectedRowData = selectedSectionData?.rows.find(r => r.rowId === selectedRow);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSection || !selectedRow || !customerInfo.name || !customerInfo.email) {
      alert('Please fill in all required fields');
      return;
    }

    const bookingData: BookingRequest = {
      sectionId: selectedSection,
      rowId: selectedRow,
      numberOfTickets,
      customerInfo
    };

    onBookingSubmit(bookingData);
  };

  const calculateTotal = () => {
    if (!selectedSectionData) return 0;
    const baseAmount = selectedSectionData.price * numberOfTickets;
    const discount = numberOfTickets >= 4 ? baseAmount * 0.1 : 0;
    return baseAmount - discount;
  };

  const getDiscount = () => {
    if (!selectedSectionData || numberOfTickets < 4) return 0;
    return selectedSectionData.price * numberOfTickets * 0.1;
  };

  const maxTickets = selectedRowData ? Math.min(selectedRowData.availableSeats, 10) : 10;

  if (!selectedSection || !selectedRow) {
    return (
      <div className="alert alert-info">
        <h6>Ready to book?</h6>
        <p className="mb-0">Please select a section and row to proceed with booking.</p>
      </div>
    );
  }

  return (
    <div className="booking-form">
      <h5 className="mb-4">Book Your Tickets</h5>
      
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="tickets" className="form-label fw-bold">Number of Tickets</label>
              <select
                id="tickets"
                className="form-select"
                value={numberOfTickets}
                onChange={(e) => setNumberOfTickets(parseInt(e.target.value))}
                required
              >
                {Array.from({ length: maxTickets }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>
                    {num} ticket{num > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
              <div className="form-text">
                Maximum {maxTickets} tickets per booking
              </div>
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label fw-bold">Price Summary</label>
              <div className="card bg-light">
                <div className="card-body p-3">
                  <div className="d-flex justify-content-between">
                    <span>Base Price:</span>
                    <span>${selectedSectionData?.price} x {numberOfTickets}</span>
                  </div>
                  {numberOfTickets >= 4 && (
                    <div className="d-flex justify-content-between text-success">
                      <span>Group Discount (10%):</span>
                      <span>-${getDiscount().toFixed(2)}</span>
                    </div>
                  )}
                  <hr className="my-2" />
                  <div className="d-flex justify-content-between fw-bold">
                    <span>Total:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="name" className="form-label fw-bold">Full Name *</label>
              <input
                type="text"
                id="name"
                className="form-control"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                required
              />
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-bold">Email Address *</label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                required
              />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="phone" className="form-label fw-bold">Phone Number</label>
          <input
            type="tel"
            id="phone"
            className="form-control"
            value={customerInfo.phone}
            onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
          />
        </div>

        {numberOfTickets >= 4 && (
          <div className="alert alert-success mb-3">
            <strong>Group Discount Applied!</strong> You're saving ${getDiscount().toFixed(2)} (10% off) for booking 4 or more tickets.
          </div>
        )}

        <button 
          type="submit" 
          className="btn btn-primary btn-lg w-100"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Processing...
            </>
          ) : (
            `Book ${numberOfTickets} Ticket${numberOfTickets > 1 ? 's' : ''} - $${calculateTotal().toFixed(2)}`
          )}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;