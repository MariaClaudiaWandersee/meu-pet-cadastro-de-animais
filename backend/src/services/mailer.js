const nodemailer = require('nodemailer');

// Create a transporter object
const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.PASS_USER,
  }
});

// Configure the mailoptions object
async function sendMail(to, subject, text) {
  const mailOptions = {
    from: `Olá <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendMail };
