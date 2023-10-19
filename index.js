const express = require("express");
const connectToMongoDB = require("./db");
const app = express();
const PORT = process.env.PORT || 5002;
const cors = require("cors");

app.use(express.json());

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Internal Server Error");
});

app.use(
  cors({
    origin: "*",
    "Access-Control-Allow-Origin": "*",
  })
);

app.use("/api/auth", require("./routes/auth"));
app.use("/api/todo", require("./routes/todo"));

connectToMongoDB();

app.listen(PORT, () => {
  console.log(`Listening At http://localhost:${PORT}`);
});
