import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import User from '../models/User.js';
import Enrollment from '../models/Enrollment.js';

const router = express.Router();

// Helper function to initialize Razorpay lazily so dotenv has time to load
const getRazorpayInstance = () => new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret_key',
});

// @route   GET /api/payment/config
// @desc    Get Razorpay Key ID
// @access  Public
router.get('/config', (req, res) => {
  res.json({ key: process.env.RAZORPAY_KEY_ID });
});

// @route   GET /api/payment/check-enrollment
// @desc    Check if email is already enrolled in course
// @access  Public
router.get('/check-enrollment', async (req, res) => {
  try {
    const { email, courseId } = req.query;
    if (!email || !courseId) return res.status(400).json({ enrolled: false });

    const user = await User.findOne({ email });
    if (!user) return res.json({ enrolled: false });

    const enrollment = await Enrollment.findOne({ student: user._id, course: courseId });
    if (enrollment) {
      return res.json({ enrolled: true });
    }

    res.json({ enrolled: false });
  } catch (error) {
    console.error(error);
    res.status(500).json({ enrolled: false });
  }
});

// @route   POST /api/payment/orders
// @desc    Create a Razorpay order
// @access  Public (Should be private in production)
router.post('/orders', async (req, res) => {
  try {
    const { amount, currency, receipt } = req.body;
    
    // Amount is in smallest currency unit (paise for INR)
    // Use Math.round to prevent floating point issues with prices like 49.99
    const options = {
      amount: Math.round(amount * 100),
      currency: currency || 'INR',
      receipt: receipt || `receipt_${Date.now()}`
    };



    const order = await getRazorpayInstance().orders.create(options);
    
    if (!order) return res.status(500).send('Some error occurred');
    
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// @route   POST /api/payment/verify
// @desc    Verify Razorpay payment signature
// @access  Public
router.post('/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, email, courseId } = req.body;
    
    // For testing/dummy keys, we can just return success directly 
    // since we can't properly verify dummy signatures
    let isVerified = false;
    if (process.env.RAZORPAY_KEY_ID === 'rzp_test_dummy_key_id') {
       isVerified = true;
    } else {
      const sign = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSign = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(sign.toString())
        .digest('hex');

      if (razorpay_signature === expectedSign) {
        isVerified = true;
      }
    }

    if (isVerified) {
      // Find or create user
      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({
          name: email.split('@')[0], // Use part of email as name
          email,
          password: 'tempPassword123' // Dummy password
        });
      }

      // Check if enrollment exists
      const existingEnrollment = await Enrollment.findOne({ student: user._id, course: courseId });
      if (!existingEnrollment) {
        // Create enrollment
        await Enrollment.create({
          student: user._id,
          course: courseId,
          status: 'active'
        });
      }

      return res.json({ msg: 'Payment verified and enrolled successfully', success: true });
    } else {
      return res.status(400).json({ msg: 'Invalid signature sent!', success: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

export default router;
