import express from "express";
const app = express();

app.post("/api/v1/signup/", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      msg: "Missing Inputs",
    });
  }
});
