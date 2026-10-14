const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "Frontend and Backend Connected Successfully!"
  });
});

module.exports = router;