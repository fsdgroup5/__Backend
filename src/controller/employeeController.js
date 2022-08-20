const express = require('express');
const BookingData = require('../model/bookings');
const eventdata = require('../model/events');
const nodemailer = require("nodemailer");
const transporter=require('../controller/nodemailer')

// Employee model
let Employee = require('../model/users');

// Add Employee
const newEmployee = (req, res, next) => {
  Employee.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
    
      userMail = data.email;
      async function main() {
        transporter
  
        let info = await transporter.sendMail({
          from: 'fsdcgroup5@gmail.com',
          to: userMail,
          subject: "Welcome "+data.name+", to ICT Hall Booking Portal ",
          html: "<h4>New User Account Created</h4><br><h4>Username:"+data.username+"<br>Password:"+data.password+"</h4>",
  
        });
      }
  
      main().catch(console.error);
      res.json(data)
    }
  })
}
// Get All Employees
const viewEmployees = (req, res) => {
  Employee.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
      // console.log('Data displayed successfully')
    }
  })
}

// Get single employee
const singleEmployee = (req, res) => {
  Employee.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
      // console.log('Data read successfully')
    }
  })
}

// Update employee
const updateEmployee = (req, res, next) => {
  Employee.findByIdAndUpdate(req.params.id, {

    $set: req.body
  }, (error, data) => {
    if (error) {
      return next(error);
    } else {
      BookingData.updateMany({ "UserName": data.username },
        {
          $set: {
            "UserName": req.body.username,
          }
        })
        .then(function () {
          res.send();
        })
        eventdata.updateMany({ "username": data.username },
        {
          $set: {
            "username": req.body.username,
          }
        })
        .then(function () {
          res.send();
        })
      res.json(data)
      // console.log('Data updated successfully')
    }
  })

}

// Delete employee
const removeEmployee = (req, res, next) => {
  Employee.findByIdAndDelete(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      username = data.username
      today=new Date().toISOString().substring(0, 10);
      BookingData.deleteMany({ "UserName": username ,"DateOfBooking": { $gte: today}}).then(() => {
        res.send();
      })
      eventdata.deleteMany({ "username": username }).then(() => {
        res.send();
      })
      res.status(200).json({
        msg: data
      })
    }
  })
}

// Username Availability check
const userNameAvailability = async (req, res, next) => {
  username = req.params.user
  const datas = await Employee.find({ "username": username })
  if (datas.length > 0) {
    res.status(401).send('not available')
  }
  else if (datas.length == 0) {
    res.status(200).send('success');
  }
}

module.exports = {
  newEmployee,
  viewEmployees,
  singleEmployee,
  updateEmployee,
  removeEmployee,
  userNameAvailability
}