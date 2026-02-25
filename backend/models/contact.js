import db from "../config/database.js";

class Contact {
  static async create(name, email, subject, message) {
    const [result] = await db.query(
      `INSERT INTO contact_messages 
       (name, email, subject, message) 
       VALUES (?, ?, ?, ?)`,
      [name, email, subject, message]
    );

    return result.insertId;
  }
}

export default Contact;