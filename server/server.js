import express from 'express';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:5173',  // Adjust this to your frontend's URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

// POST route to send email
app.post('/send-email', async (req, res) => {
  const { toEmail, subject, message, attachment } = req.body;

  // Setup nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'yenaareta@gmail.com', // Replace with your email
      pass: 'iutjpqgacpakfydc',          // Replace with your app password or actual password
    },
  });

  // Email options
  const mailOptions = {
    from: 'yenaareta@gmail.com',  // Replace with your email
    to: toEmail,
    subject: subject,
    text: message,
    attachments: [
      {
        filename: 'result.pdf',      // File name for the attachment
        content: attachment,         // The base64 content of the PDF
        encoding: 'base64',          // Encoding type
      },
    ],
  };

  // Send email
  try {
    const info = await transporter.sendMail(mailOptions);
    res.status(200).json({ message: `Email sent: ${info.response}` });
  } catch (error) {
    res.status(500).json({ error: `Error sending email: ${error.message}` });
    console.error('Email send failed:', error);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
