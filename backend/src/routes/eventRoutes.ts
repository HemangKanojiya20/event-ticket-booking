import { Router } from 'express';
import EventController from '../controllers/EventController';

const router = Router();
const eventController = new EventController();

// GET /api/events - Get all events
router.get('/', eventController.getAllEvents);

// POST /api/events - Create a new event
router.post('/', eventController.createEvent);

// GET /api/events/:id - Get event by ID
router.get('/:id', eventController.getEventById);

// GET /api/events/:id/availability - Get event availability
router.get('/:id/availability', eventController.getEventAvailability);

// POST /api/events/:id/purchase - Book tickets
router.post('/:id/purchase', eventController.bookTickets);

export default router;