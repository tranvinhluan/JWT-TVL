import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

const books = [
  {
    id: 1,
    name: "Chi Pheo",
    author: "Nam Cao 1",
  },
  {
    id: 2,
    name: "Lao Hac",
    author: "Nam Cao 2",
  },
];

// Routes:
app.get("/books", AuthenToken, (req, res) => {
  res.json({ status: "Success", data: books });
});

// MIDDLEWARE
function AuthenToken(req, res, next) {
  const authorizationHeader = req.headers["authorization"];
  // "Bearer [token]"
  const token = authorizationHeader.split(" ")[1];
  if (!token) res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
    console.log(err, data);
    if (err) res.sendStatus(403);
    next()
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
