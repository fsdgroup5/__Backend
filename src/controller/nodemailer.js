const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    service: 'gmail',
    port: 587,
    secure: false,
    auth: {
        user: 'fsdcgroup5@gmail.com',
        pass: 'xbcfmaobomhrzzxx',
    },
    });

module.exports=transporter