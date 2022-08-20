
const BookingData = require('../model/bookings');
const eventdata = require('../model/events');
const userData = require('../model/users')
const transporter=require('../controller/nodemailer')

//get bookings
const getBookings = (req, res) => {
  const username = req.params.username;
  const date = new Date();
  var dates = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().substring(0, 10);

  let next = new Date();
  next.setDate(date.getDate() + 7)

  var today = dates.slice(0, 10);
  var nextDate = new Date(next.getTime() - (next.getTimezoneOffset() * 60000)).toISOString().substring(0, 10);
  BookingData.find({ "UserName": username, "DateOfBooking": { $gte: today, $lt: nextDate } }).sort([['DateOfBooking']])
    .then((data) => {
      res.send(data);

    });
}

// new booking
const newBooking = (req, res) => {
  Hall = req.body.BookingDetails.Hallname,
    BookingDate = req.body.BookingDetails.Date,
    Time = req.body.BookingDetails.Time,
    User = req.body.BookingDetails.Username

  //converting time to 12hr
  EndTime = Time.slice(Time.length - 8);
  StartTime = Time.substring(0, 8);
  random_id = User + BookingDate + (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2)
  const StartTimeStr = new Date('1970-01-01T' + StartTime + 'Z')
    .toLocaleTimeString('en-US',
      { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' }
    );
  const EndTimeStr = new Date('1970-01-01T' + EndTime + 'Z')
    .toLocaleTimeString('en-US',
      { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' }
    );
  //
  var bookingdtls = {
    _id: random_id,
    HallName: Hall,
    DateOfBooking: BookingDate,
    TimeSlot: StartTimeStr + ' to ' + EndTimeStr,
    UserName: User,
    Class: req.body.BookingDetails.Class
  }
  var bookingdtls = new BookingData(bookingdtls);
  bookingdtls.save();

  var events = {
    _id: random_id,
    title: Hall,
    start: BookingDate + 'T' + StartTime,
    end: BookingDate + 'T' + EndTime,
    username: User,
  }
  var events = new eventdata(events);
  events.save();

  userData.findOne({ "username": User }).then((data) => {
    userMail = data.email;
    async function main() {
      transporter 
      let info = await transporter.sendMail({
        from: 'fsdcgroup5@gmail.com',
        to: userMail,
        subject: "ICT Hall Booking Confirmation",
        html: "<h3>Hello <b style='text-transform: uppercase'>" + User + "</b> Your Booking Has Been confirmed</h3> <br><b>Booking Date : " + BookingDate + "</b> <br> <b>HallName : " + Hall + "</b> <br> <b>TimeSlot : " + StartTimeStr + ' to ' + EndTimeStr + "</b>",

      });
    }

    main().catch(console.error);
  });
  res.status(200).send('success');
}

// events
const eventsShow = (req, res) => {
  const username = req.params.username;
  eventdata.find({ 'username': username }).then(function (data) {
    res.send(data);

  });
}

// timeslot
const TimeSlot = async (req, res) => {
  dt = req.params.Date
  hall = req.params.Hall
  Time = req.params.Timeslot
  user = req.params.Username

  EndTime = Time.slice(Time.length - 8);
  StartTime = Time.substring(0, 8);
  const StartTimeStr = new Date('1970-01-01T' + StartTime + 'Z').toLocaleTimeString('en-US',
    { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' });

  const EndTimeStr = new Date('1970-01-01T' + EndTime + 'Z').toLocaleTimeString('en-US',
    { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' });
  CheckTime = StartTimeStr + ' to ' + EndTimeStr;
  const data = await BookingData.find({ DateOfBooking: dt, HallName: hall, TimeSlot: CheckTime });
  const data1 = await BookingData.find({ DateOfBooking: dt, UserName: user, TimeSlot: CheckTime });
  if (data.length === 0 && data1.length === 0) {
    res.status(200).send('success');
  }
  else if (data.length > 0 && data1.length > 0) {
    res.status(202).send('error');

  }
  else if (data.length > 0) {
    res.status(401).send('error');
  }
  else if (data1.length > 0) {
    res.status(404).send('success')
  }
}

const DateFilter = (req, res) => {
  startDate = req.params.startDate
  endDate = req.params.EndDate
  newdate = new Date(endDate + 'T00:00:00Z')
  newdate.setDate(newdate.getDate() + 1)
  var endDate = newdate.toISOString().substring(0, 10);
  BookingData.find({ "DateOfBooking": { $gte: startDate, $lt: endDate } }).sort({ "DateOfBooking": 1 })
    .then((data) => {
      res.send(data);
    });
}



//Admin-booking Details
const AdminBooking = function (req, res) {
  BookingData.find().sort([['DateOfBooking']]).then(function (dtls) {
    res.send(dtls);

  });
}

//Admin-booking History
const AdminBookingHistory = function (req, res) {
  const date = new Date();
  var today = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().substring(0, 10);
  BookingData.find({ "DateOfBooking": { $lt: today } }).sort([['DateOfBooking']])
    .then(function (dtls) {
      res.send(dtls);

    });
}

const UpcomingBookings = function (req, res) {
  const date = new Date();
  var today = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().substring(0, 10);

  BookingData.find({ "DateOfBooking": { $gte: today } }).sort([['DateOfBooking']])
    .then(function (dtls) {
      res.send(dtls);

    });
}

// remove booking
const RemoveBooking = (req, res) => {
  id = req.params.id;
  BookingData.findOne({ "_id": id }).then((data) => {
    UserName = data.UserName
    today=new Date().toISOString().substring(0, 10);
    if(today<data.DateOfBooking){
      userData.findOne({ "username": UserName }).then((data1) => {
        mailId = data1.email
        async function main() {
        transporter 
          let info = await transporter.sendMail({
  
            from: 'fsdcgroup5@gmail.com',
            to: mailId,
            subject: "ICT Hall Booking Cancelled!!",
            html: "<h3>Hello <b style='text-transform: uppercase'>" + UserName + "</b> Your Booking Has Been cancelled</h3> <br><b>Booking Date : " + data.DateOfBooking + "</b> <br> <b>HallName : " + data.HallName + "</b> <br> <b>TimeSlot : " + data.TimeSlot + "</b>",
  
          });
        }
  
        main().catch(console.error);
      })
    }
    

  });


  BookingData.findByIdAndDelete({ "_id": id })
    .then(() => {
      res.send();
    })
  eventdata.findByIdAndDelete({ "_id": id })
    .then(() => {
      res.send();
    })
}

module.exports = {
  getBookings,
  newBooking,
  eventsShow,
  AdminBooking,
  AdminBookingHistory,
  UpcomingBookings,
  RemoveBooking,
  TimeSlot,
  DateFilter
};