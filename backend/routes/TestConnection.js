console.log("FILE STARTED");

import mysql from "mysql2/promise";

(async () => {
  try {
    const connection = await mysql.createConnection({
      host: "127.0.0.1",
      user: "root",
      password: "8Everly@",
      database: "ecommerce_db",
      port: 3307
    });

    console.log("✅ DIRECT CONNECTION SUCCESS");
    await connection.end();
  } catch (error) {
    console.error("❌ DIRECT CONNECTION FAILED:");
    console.error("Code:", error.code);
    console.error("Message:", error.message);
  }
})();