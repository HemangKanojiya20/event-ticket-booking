# Event Ticket Booking System

A full-stack event ticket booking application built with React (frontend) and Node.js + Express (backend).

### Prerequisites

- Node.js (v18 or later)
- npm

### Installation and running the application

1. **Backend Setup**
   cd backend
   npm install
   npm run dev

2. **Frontend Setup**
   cd frontend
   npm install
   npm run dev

### Backend

- **REST API** with TypeScript and Express
- **Event Management**: Create and manage events with sections and rows
- **Seat Availability**: Real-time seat tracking and availability checking
- **Atomic Booking**: Prevents race conditions and double-booking
- **Group Discounts**: 10% discount for 4+ tickets
- **Concurrency Handling**: Locking mechanism for seat reservations
- **Error Handling**: Comprehensive error handling and validation

### Frontend

- **Modern React**: TypeScript, React Router, Bootstrap styling
- **Real-time Updates**: Live seat availability display
- **Responsive Design**: Mobile-friendly interface
- **Booking Flow**: Intuitive seat selection and booking process
- **Group Discount UI**: Visual feedback for group discounts
- **Loading States**: Smooth UX with loading indicators

### Concurrency Control

- Implements locking mechanism to prevent race conditions
- Atomic seat booking operations
- Prevents double-booking of seats

### Group Discounts

- Automatic 10% discount for 4 or more tickets
- Visual feedback in the UI applied at booking time

### Seat Management

- Section-based organization (VIP, Premium, General)
- Row-level seat tracking
- Real-time availability updates

### Error Handling

- Comprehensive validation
- User-friendly error messages
- Graceful failure handling

## Sample Data

The application comes with pre-loaded sample events:

- **Rock Concert 2024** at Narendra Modi Stadium
- **Classical Music Evening** at Town Hall

Each event has multiple sections (VIP, Premium, General) with different pricing and seating arrangements.

## Security Features

- Helmet.js for security headers
- Rate limiting
- CORS configuration
