import Razorpay from 'razorpay';
import dotenv from "dotenv"
dotenv.config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY,
});

export const createRazorpayOrder = async (req, res) => {
    const { amount } = req.body; // Amount in INR

    // Check if amount is provided
    if (!amount) {
        return res.status(400).json({ error: 'Amount is required' });
    }

    try {
        // Create a Razorpay order
        const order = await razorpay.orders.create({
            amount: amount * 100, // Amount in paise
            currency: 'INR',
            receipt: 'order_rcptid_11', // Unique receipt ID
        });

        // Log order details for debugging
        console.log('Order created:', order);

        // Send the order details as response
        res.status(200).json(order);
    } catch (error) {
        // Log error details for debugging
        console.error('Error creating Razorpay order:', error);

        // Send error response
        res.status(500).json({ error: error.message });
    }
};