export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  sections: Section[];
  createdAt: Date;
}

export interface Section {
  id: string;
  name: string;
  price: number;
  rows: Row[];
}

export interface Row {
  id: string;
  name: string;
  seats: Seat[];
}

export interface Seat {
  id: string;
  number: number;
  isBooked: boolean;
  bookedAt?: Date;
  bookingId?: string;
}

export interface BookingRequest {
  eventId: string;
  sectionId: string;
  rowId: string;
  numberOfTickets: number;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface BookingResponse {
  success: boolean;
  bookingId?: string;
  bookedSeats?: Seat[];
  totalAmount?: number;
  discountApplied?: boolean;
  discountAmount?: number;
  error?: string;
}

export interface EventAvailability {
  eventId: string;
  sections: SectionAvailability[];
}

export interface SectionAvailability {
  sectionId: string;
  name: string;
  price: number;
  rows: RowAvailability[];
}

export interface RowAvailability {
  rowId: string;
  name: string;
  totalSeats: number;
  availableSeats: number;
  bookedSeats: number;
}