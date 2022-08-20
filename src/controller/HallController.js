
const HallData = require('../model/hall')
const BookingData = require('../model/bookings');
const eventdata = require('../model/events');

// full hall details
const HallDetails = (req, res) => {
    HallData.find().then(function (Halls) {
        res.send(Halls);
    })
}

// new hall 
const NewHall = async (req, res) => {
    hall = req.body.Hall.HallName;
    const data = await HallData.find({ "HallName": hall });
    if (data.length > 0) {
        res.status(401).send('error');
    }
    else {
        var Hall = {
            HallName: req.body.Hall.HallName,
            Seats: req.body.Hall.Seats,
            Location: req.body.Hall.Location,
            Image: req.body.Hall.Image
        }
        var Hall = new HallData(Hall);
        Hall.save();
        res.status(200).send('success');
    }
}


// Single Hall
const SingleHall = (req, res) => {

    const id = req.params.id;
    HallData.findOne({ "_id": id })
        .then((hall) => {
            res.send(hall);
        });
}

// Edit Hall
const EditHall = (req, res) => {
    id = req.body._id,
        HallName = req.body.HallName,
        Seats = req.body.Seats,
        Location = req.body.Location,
        Image = req.body.Image,
        HallData.findByIdAndUpdate({ "_id": id },
            {
                $set: {
                    "HallName": HallName,
                    "Seats": Seats,
                    "Location": Location,
                    "Image": Image,
                }
            })
            .then((data, error) => {
                BookingData.updateMany({ "HallName": data.HallName },
                    {
                        $set: {
                            "HallName": req.body.HallName,
                        }
                    })
                    .then(function () {
                        res.send();
                    })
                eventdata.updateMany({ "title": data.HallName },
                    {
                        $set: {
                            "title": req.body.HallName,
                        }
                    })
                    .then(function () {
                        res.send();
                    })
                res.send();
            })


}

//   Delete hall
const RemoveHall = (req, res) => {

    id = req.params.id;
    console.log(id);
    HallData.findByIdAndDelete({ "_id": id })
        .then(() => {
            res.send();
        })
}


module.exports = {
    HallDetails,
    NewHall,
    SingleHall,
    EditHall,
    RemoveHall
}