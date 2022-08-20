const express = require('express');
const BookingRouter = new express();
const bookingController = require('../controller/bookings');
const { verifyToken, verifyUserToken } = require('../controller/Token');

BookingRouter.get('/userbookings/:username', verifyUserToken, bookingController.getBookings)
BookingRouter.post('/newBooking', bookingController.newBooking)
BookingRouter.get('/timeslot/:Hall/:Date/:Timeslot/:Username', bookingController.TimeSlot)
BookingRouter.get('/datefilter/:startDate/:EndDate', bookingController.DateFilter)
BookingRouter.get('/events/:username', bookingController.eventsShow)

BookingRouter.get('/bookingdtls', verifyToken, bookingController.AdminBooking)
BookingRouter.get('/bookingHistory', verifyToken, bookingController.AdminBookingHistory)
BookingRouter.get('/upcomingBookings', verifyToken, bookingController.UpcomingBookings)
BookingRouter.delete('/remove_booking/:id', bookingController.RemoveBooking)

module.exports = BookingRouter