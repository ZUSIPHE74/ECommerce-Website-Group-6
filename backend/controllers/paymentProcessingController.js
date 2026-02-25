import PaymentProcessing from "../models/paymentProcessing.js";

export const createCheckoutSession = async (req, res) => {
  try {

    const userId = req.user.id; // From JWT middleware

    const checkoutUrl =
      await PaymentProcessing.createCheckoutSession(userId);

    res.json({ url: checkoutUrl });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};