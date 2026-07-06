import axios from 'axios';

async function testVerify() {
  try {
    const res = await axios.post('http://localhost:5000/api/payment/verify', {
      razorpay_order_id: 'order_12345',
      razorpay_payment_id: 'pay_12345',
      razorpay_signature: 'invalid_signature_on_purpose',
      email: 'smily.shanvi6597@gmail.com',
      courseId: '60d0fe4f5311236168a109ca' // Dummy ObjectId
    });
    console.log('Success:', res.data);
  } catch (err) {
    console.error('Error:', err.response ? err.response.data : err.message);
  }
}

testVerify();
