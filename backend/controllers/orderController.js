import CreateOrders from "../models/CreateOrders.js";

export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shipping, paymentMethod } = req.body;

    const orderId = await CreateOrders.createOrder(
      userId,
      shipping,
      paymentMethod
    );

    res.status(201).json({ message: "Order created", orderId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
