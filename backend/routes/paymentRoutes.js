import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';

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
      currency: currency || 'USD',
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
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    // For testing/dummy keys, we can just return success directly 
    // since we can't properly verify dummy signatures
    if (process.env.RAZORPAY_KEY_ID === 'rzp_test_dummy_key_id') {
       return res.json({ msg: 'Payment verified successfully (Mock)', success: true });
    }

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      return res.json({ msg: 'Payment verified successfully', success: true });
    } else {
      return res.status(400).json({ msg: 'Invalid signature sent!', success: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

export default router;
