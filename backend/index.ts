import express from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: { type: String; required: true; unique: true };
        name: { type: String; required: true };
        surname: { type: String; required: true };
        login: { type: String; required: true; unique: true };
        passwordHash: { type: String; required: true };
      };
    }
  }
}

const app = express();
const port = 3000;

const tokenSecret = process.env.TOKEN_SECRET as string;
let refreshToken: string;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(async () => {
    console.log("Connected to MongoDB");
    await seedUsers();
  })
  .catch((err) => console.error("MongoDB connection error:", err));

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  login: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);

async function seedUsers() {
  const users = [
    {
      id: "1",
      name: "Wojtek",
      surname: "Kowalski",
      login: "wojtek",
      password: "password1",
    },
    {
      id: "2",
      name: "Adam",
      surname: "Nowak",
      login: "adam",
      password: "password2",
    },
    {
      id: "3",
      name: "Paweł",
      surname: "Wiśniewski",
      login: "pawel",
      password: "password3",
    },
  ];

  for (const u of users) {
    const existing = await User.findOne({ login: u.login });
    if (!existing) {
      const passwordHash = await bcrypt.hash(u.password, 10);
      const newUser = new User({
        id: u.id,
        name: u.name,
        surname: u.surname,
        login: u.login,
        passwordHash,
      });
      await newUser.save();
      console.log(`✔ User ${u.login} added`);
    } else {
      console.log(`ℹ User ${u.login} already exists`);
    }
  }
}

app.get("/", (req, res) => {
  res.send("Hello World - JWT + Mongo API!");
});

app.post("/register", async (req, res) => {
  const { login, password } = req.body;

  const existing = await User.findOne({ login });
  if (existing) return res.status(400).send("User already exists.");

  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({ login, passwordHash });
  await user.save();

  res.status(201).send("User registered.");
});

app.post("/login", async (req, res) => {
  const { login, password } = req.body;

  const user = await User.findOne({ login });
  if (!user) return res.status(401).send("Invalid login or password");

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).send("Invalid login or password");

  const expTime = 1800;
  const token = generateToken(user.login, expTime);
  refreshToken = generateToken(user.login, 3600);

  res.status(200).send({ token, refreshToken });
});

app.post("/refreshToken", function (req, res) {
  const refreshTokenFromPost = req.body.refreshToken;
  if (refreshToken !== refreshTokenFromPost) {
    return res.status(400).send("Bad refresh token!");
  }

  const expTime = 60;
  const token = generateToken("user", expTime);
  refreshToken = generateToken("user", 60 * 60);

  setTimeout(() => {
    res.status(200).send({ token, refreshToken });
  }, 3000);
});

app.get("/protected/:id/:delay?", verifyToken, (req, res) => {
  const id = req.params.id;
  const delay = req.params.delay ? +req.params.delay : 1000;
  setTimeout(() => {
    res.status(200).send({ message: `protected endpoint ${id}` });
  }, delay);
});

app.listen(port, () => {
  console.log(`✅ API listening on port ${port}`);
});

function generateToken(login: string, expirationInSeconds: number) {
  const exp = Math.floor(Date.now() / 1000) + expirationInSeconds;
  const token = jwt.sign({ login, exp }, tokenSecret, { algorithm: "HS256" });
  return token;
}

function verifyToken(req: any, res: any, next: any) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];
  console.log(token);

  if (!token) return res.sendStatus(403);

  jwt.verify(token, tokenSecret, (err: any, user: any) => {
    if (err) {
      console.log(err);
      return res.status(401).send(err.message);
    }
    req.user = user;
    next();
  });
}

app.get("/me", verifyToken, async (req, res) => {
  try {
    if (req.user) {
      const login = req.user.login;
      const user = await User.findOne({ login }).select("-passwordHash");
      if (!user) return res.status(404).send("User not found");
      res.status(200).json(user);
    } else {
      console.log("No user data");
    }
  } catch (error) {
    res.status(500).send("Server error");
  }
});

app.get("/users", verifyToken, async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send("Server error");
  }
});
