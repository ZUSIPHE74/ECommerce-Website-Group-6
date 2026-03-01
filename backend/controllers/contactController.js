import Contact from "../models/Contact.js"

export const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }

    const id = await Contact.create(name, email, subject, message);

    res.status(201).json({ message: "Message sent successfully", id });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};