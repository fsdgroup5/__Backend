const express = require('express');
const HallRouter = new express();
const { verifyToken, verifyUserToken } = require('../controller/Token');
const HallController = require('../controller/HallController')


HallRouter.post('/addnewhall', verifyToken, HallController.NewHall)
HallRouter.get('/update:id', verifyToken, HallController.SingleHall)
HallRouter.put('/update', verifyToken, HallController.EditHall)
HallRouter.delete('/removehall:id', verifyToken, HallController.RemoveHall)
HallRouter.get('/halldetails', verifyUserToken, HallController.HallDetails)

module.exports = HallRouter