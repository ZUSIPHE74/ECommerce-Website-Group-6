const express = require('express');
const router = express.Router();

// 1st PAGE
router.get('/', (req, res) => {
  res.json({ message: "Still waiting for the page name" });
});

// 2nd PAGE
router.get('/', (req, res) => {
  res.json({ message: "Still waiting for the page name" });
});

// 3rd PAGE
router.get('/', (req, res) => {
  res.json({ message: "Still waiting for the page name" });
});

// 4th PAGE
router.get('/', (req, res) => {
  res.json({ message: "Still waiting for the page name" });
});
module.exports = router;