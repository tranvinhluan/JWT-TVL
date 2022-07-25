import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 5500;

app.use(express.json());

let refreshTokens = []; // cần lưu trong database.

// Routes:
app.post("/refreshToken", (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
    console.log(err, data);
    if (err) res.sendStatus(403);

    const accessToken = jwt.sign(     // accessToken mới.
      { username: data.username },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "30s",
      }
    );

    res.json({ accessToken });  // accessToken mới.
  });
});

// LOGIN:
app.post("/login", (req, res) => {
  // Authentication -> Giả sử người dùng đăng nhập đúng thông tin.
  // Authorization
  // {username: "Test"}
  const data = req.body; // lấy data từ người dùng submit gửi lên.
  console.log({ data });
  const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30s",
  });

  const refreshToken = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });

  refreshTokens.push(refreshToken);

  res.json({ accessToken, refreshToken });
});

// LOGOUT:
app.post("/logout", (req, res) => {
  const refreshToken = req.body.token;  // refreshToken từ Client gửi lên.
  refreshTokens = refreshTokens.filter(refTokenEL => refTokenEL !== refreshToken)

  res.sendStatus(200);
})


app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
