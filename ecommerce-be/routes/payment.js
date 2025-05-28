const express = require("express");
const db = require("../db/db");

const router = express.Router();

router.get("/:orderId", (req, res) => {
  const { orderId } = req.params;

  const query =
    "SELECT id AS orderId, total_price AS totalPrice, qr_code AS qrCode FROM orders WHERE id = ?";
  db.query(query, [orderId], (err, results) => {
    if (err) {
      console.error("Error fetching order:", err);
      return res.status(500).json({ message: "Error fetching order." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.json(results[0]);
  });
});

// Update payment status
router.get("/payment/:orderId", (req, res) => {
  const { orderId } = req.params;

  if (!orderId) {
    return res.status(400).json({ message: "Order ID is required." });
  }

  const query = `UPDATE orders SET is_paid = 1 WHERE id = ?`;
  db.query(query, [orderId], (err, result) => {
    if (err) {
      console.error("Error updating payment status:", err);
      return res
        .status(400)
        .json({ message: "Error updating payment status." });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json({ message: "Payment successful." });
  });
});

module.exports = router;
