const express = require('express');
const employeeController = require('../controller/employeeController')
const employeeRoute = express.Router();

// Employee model

employeeRoute.route('/create').post(employeeController.newEmployee)
employeeRoute.route('/').get(employeeController.viewEmployees)
employeeRoute.route('/read/:id').get(employeeController.singleEmployee)
employeeRoute.route('/update/:id').put(employeeController.updateEmployee)
employeeRoute.route('/delete/:id').delete(employeeController.removeEmployee)
employeeRoute.get('/usernamecheck/:user', employeeController.userNameAvailability)

module.exports = employeeRoute;