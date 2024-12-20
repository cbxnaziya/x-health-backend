const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
dotenv.config();
// const accountSid = process.env.TWILIO_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const verifySid = "VAcafe0c80e057f7e0010e23cd31ac7c06";
// const SMSID = process.env.TWILIO_SMS_ID;
const accountSid = "ACcd4e231e2bd3f8c4d8a6521c52b69626";
const authToken = "eacf3ef2c0409e7c0803e13fd9bc7f6c";
const verifySid = "VAcafe0c80e057f7e0010e23cd31ac7c06";
 
const SMSID ="MG7ff56e764e04fdab7de9b1896d68bfdd"
const client = require("twilio")(accountSid, authToken);

// Utility to send OTP to the provided email address
const sendOtpEmail = async (email, otp) => {
  // Create reusable transporter object using SMTP transport
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASS, // Your Gmail password or app-specific password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER, // sender address
    to: email, // recipient address
    subject: "Your OTP Code", // Subject line
    text: `Your OTP code is ${otp}`, // OTP message body
  };

  try {
    // Send OTP via email
    await transporter.sendMail(mailOptions);
    // Return success if email is sent
    return { success: true, message: "OTP sent successfully" };
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Error sending OTP");
  }
};
// Utility to send OTP to the provided email address

// // Utility to send OTP to the provided phone number
// const sendOtpPhone = async (phone, otp) => {
//   console.log(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN,process.env.TWILIO_PHONE_NUMBER);
  
 


//   const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN); // Initialize Twilio client
//   // Ensure the phone number is in E.164 format (e.g., +1234567890)
  
//   try {
//     // if (!phone.startsWith('+')) {
//     // }
//     // Send SMS using Twilio
//     const message = await client.messages.create({
//       messagingServiceSid: SMSID,
//       body: `Your OTP code is ${otp}`, // OTP message
//       from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number (use the number you have purchased from Twilio)
//       to: `+${phone}`, // Recipient phone number
//     });

//     // Return success if SMS is sent
//     return {
//       success: true,
//       message: "OTP sent successfully",
//       sid: message.sid,
//     };
//   } catch (error) {
//     console.error("Error sending OTP:", error);
//     throw new Error("Error sending OTP");
//   }
// };
// const sendOtpPhone =  (otp, phone, country_code) => {
  
   
//   const sendOTP = (phoneNumber) => {
//     client.messages
//       .create({
//         messagingServiceSid: SMSID,
//         body: `Your OTP for xhealth is: ${otp} KAUCfmzBWSD`,
//         from: process.env.TWILIO_PHONE_NUMBER,
//         to: phoneNumber,
//       })
//       .then((message) =>{
//           console.log(message, '------------' ,otp)
//       })
//       .catch((error) => console.error(error));
//   };
   
//   const phoneNumber = `+${country_code}${phone}`;
//   sendOTP(phoneNumber);
  
//   }

const sendOtpPhone = (otp, phone, country_code) => {
  const sendOTP = async (phoneNumber) => {
    try {
      const message = await client.messages.create({
        messagingServiceSid: SMSID,
        body: `Your OTP for xhealth is: ${otp} KAUCfmzBWSD`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber,
      });
      console.log(message, '------------', otp);
      return { success: true, messageSid: message.sid, status: message.status };
    } catch (error) {
      console.error(error);
      return { success: false, error: error.message };
    }
  };

  const phoneNumber = `+${country_code}${phone}`;
  return sendOTP(phoneNumber);
};
module.exports = { sendOtpEmail, sendOtpPhone };

