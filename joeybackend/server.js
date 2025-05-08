const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const visitorSignupRoutes = require('./routes/visitorRegister');
const parkGuideSignupRoutes = require('./routes/parkGuideRegister');
const AdminSignupRoutes = require('./routes/adminRegister');
const loginRoutes = require('./routes/login');
const resetPasswordRoute = require('./routes/resetPassword');
const bookingParkGuideRoutes = require('./routes/booking_parkguide');
const feedbackRoutes = require('./routes/feedback');
const verifyotp = require('./routes/verify-otp')

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/visitorRegister', visitorSignupRoutes);
app.use('/api/parkGuideRegister', parkGuideSignupRoutes);
app.use('/api/adminRegister', AdminSignupRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/reset-password', resetPasswordRoute);
app.use('/api/booking_parkguide', bookingParkGuideRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/verify-otp', verifyotp);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
