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

// MONGODB DB CONNECTION
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(async () => {
    console.log("Connected to MongoDB");
    await seedUsers();
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// USER MODEL:
const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  login: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);

// ADD SOME USERS ON START:
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

// TASK SCHEMA:
const taskSchema = new mongoose.Schema({
  storyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Story",
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  estimatedWorkHours: { type: Number, required: true },
  createdAt: { type: String, required: true },
  state: {
    type: String,
    enum: ["Todo", "Doing", "Done"],
    required: true,
  },
  // Optional fields depending on state:
  startDate: { type: String },
  endDate: { type: String },
  userId: { type: String },
});
const Task = mongoose.model("Task", taskSchema);

// STORY SCHEMA:
const storySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  priority: {
    type: String,
    enum: ["Low", "Mid", "High"],
    required: true,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  createDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ["Todo", "Doing", "Done"],
    required: true,
  },
  ownerId: { type: String, required: true },
});
const Story = mongoose.model("Story", storySchema);

// PROJECT SCHEMA:
const projectSchema = new mongoose.Schema({
  isSelected: { type: Boolean, required: true, default: false },
  name: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: String, required: true },
  endDate: { type: String, required: true },
  maxAssignedUsers: { type: Number, required: true },
});
const Project = mongoose.model("Project", projectSchema);

// AUTH:
app.get("/", (req, res) => {
  res.send("ManageMe API");
});

app.post("/register", async (req, res) => {
  const { login, password } = req.body;

  const existing = await User.findOne({ login });
  if (existing) return res.status(400).send("User already exists.");

  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({
    login,
    passwordHash,
    id: new mongoose.Types.ObjectId().toHexString(),
    name: "",
    surname: "",
  });
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

function generateToken(login: string, expirationInSeconds: number) {
  const exp = Math.floor(Date.now() / 1000) + expirationInSeconds;
  const token = jwt.sign({ login, exp }, tokenSecret, { algorithm: "HS256" });
  return token;
}

function verifyToken(req: any, res: any, next: any) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

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

app.get("/protected/:id/:delay?", verifyToken, (req, res) => {
  const id = req.params.id;
  const delay = req.params.delay ? +req.params.delay : 1000;
  setTimeout(() => {
    res.status(200).send({ message: `protected endpoint ${id}` });
  }, delay);
});

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

// PROJECTS:
app.get("/projects", verifyToken, async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

app.get("/project/:id", verifyToken, async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).send("Project not found");

    const stories = await Story.find({ projectId });

    const projectWithStories = {
      ...project.toObject(),
      stories,
    };

    res.status(200).json(projectWithStories);
  } catch (error) {
    console.error("Błąd przy pobieraniu projektu z historiami:", error);
    res.status(500).send("Server error");
  }
});

// CREATE NEW PROJECT
app.post("/create-project", verifyToken, async (req, res) => {
  try {
    const { name, description, createdAt, endDate, maxAssignedUsers } =
      req.body;

    const existingCount = await Project.countDocuments();
    const isSelected = existingCount === 0;

    const project = new Project({
      name,
      description,
      createdAt,
      endDate,
      maxAssignedUsers,
      isSelected,
    });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    console.error("Błąd przy tworzeniu projektu:", error);
    res.status(500).send("Server error");
  }
});

// UPDATE PROJECT SELECTION:
app.put("/set-selected-project/:id", verifyToken, async (req, res) => {
  try {
    const selectedId = req.params.id;

    await Project.updateMany({ isSelected: true }, { isSelected: false });

    const updated = await Project.findByIdAndUpdate(
      selectedId,
      { isSelected: true },
      { new: true }
    );

    if (!updated) {
      return res.status(404).send("Project not found");
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error("Błąd przy ustawianiu selected project:", error);
    res.status(500).send("Server error");
  }
});

// UPDATE existing project
app.put("/update-project", verifyToken, async (req, res) => {
  try {
    const {
      _id,
      name,
      description,
      createdAt,
      endDate,
      maxAssignedUsers,
      isSelected,
    } = req.body;

    if (isSelected === true) {
      await Project.updateMany({ isSelected: true }, { isSelected: false });
    }

    const updated = await Project.findByIdAndUpdate(
      _id,
      { name, description, createdAt, endDate, maxAssignedUsers, isSelected },
      { new: true }
    );
    if (!updated) return res.status(404).send("Project not found");
    res.status(200).json(updated);
  } catch (error) {
    console.error("Błąd przy aktualizacji projektu:", error);
    res.status(500).send("Server error");
  }
});

// DELETE PROJECT:
app.delete("/delete-project/:id", verifyToken, async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findByIdAndDelete(projectId);
    if (!project) return res.status(404).send("Project not found");

    const stories = await Story.find({ projectId });
    const storyIds = stories.map((s) => s._id);
    await Story.deleteMany({ projectId });
    await Task.deleteMany({ storyId: { $in: storyIds } });

    res.status(200).json("Project and related data deleted.");
  } catch (error) {
    res.status(500).json("Server error");
  }
});

// STORIES:

app.get("/stories/:projectId?", verifyToken, async (req, res) => {
  try {
    const { projectId } = req.params;

    if (projectId) {
      const stories = await Story.find({ projectId });
      return res.status(200).json(stories);
    }

    // Brak projectId w URL – zwracamy wszystkie historie
    const allStories = await Story.find();
    res.status(200).json(allStories);
  } catch (error) {
    console.error("Błąd przy pobieraniu stories:", error);
    res.status(500).send("Server error");
  }
});

// GET STORYID:
app.get("/story/:storyId", verifyToken, async (req, res) => {
  try {
    const story = await Story.findById(req.params.storyId);
    if (!story) return res.status(404).send("Story not found");
    res.status(200).json(story);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// CREATE NEW STORY FOR PROJECT:
app.post("/create-story/:projectId", verifyToken, async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).send("Project not found");

    const { name, description, priority, createDate, status, ownerId } =
      req.body;
    const story = new Story({
      name,
      description,
      priority,
      projectId,
      createDate,
      status,
      ownerId,
    });
    await story.save();
    res.status(201).json(story);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// UPDATE EXISTING STORY
app.put("/update-story/:storyId", verifyToken, async (req, res) => {
  try {
    const storyId = req.params.storyId;
    const updated = await Story.findByIdAndUpdate(storyId, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).send("Story not found");
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// DELETE STORY:
app.delete("/delete-story/:storyId", verifyToken, async (req, res) => {
  try {
    const storyId = req.params.storyId;
    const story = await Story.findByIdAndDelete(storyId);
    if (!story) return res.status(404).send("Story not found");
    await Task.deleteMany({ storyId });
    res.status(200).json({ message: "Story and related tasks deleted." });
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// TASKS:
// GET ALL TASKS
app.get("/tasks", verifyToken, async (req, res) => {
  try {
    const { storyId } = req.query;
    if (storyId) {
      const tasks = await Task.find({ storyId });
      return res.status(200).json(tasks);
    }
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// GET TASK BY ID:
app.get("/task/:taskId", verifyToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).send("Task not found");
    res.status(200).json(task);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// CREATE A NEW TASK:
app.post("/create-task/:storyId", verifyToken, async (req, res) => {
  try {
    const storyId = req.params.storyId;
    const story = await Story.findById(storyId);
    if (!story) return res.status(404).send("Story not found");

    const {
      title,
      description,
      estimatedWorkHours,
      createdAt,
      state,
      startDate,
      endDate,
      userId,
    } = req.body;

    const task = new Task({
      storyId,
      title,
      description,
      estimatedWorkHours,
      createdAt,
      state,
      startDate: state !== "Todo" ? startDate : undefined,
      endDate: state === "Done" ? endDate : undefined,
      userId: state !== "Todo" ? userId : undefined,
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// UPDATE EXISTING TASK:
app.put("/update-task/:taskId", verifyToken, async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const updated = await Task.findByIdAndUpdate(taskId, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).send("Task not found");
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// DELETE TASK BY ID:
app.delete("/delete-task/:taskId", verifyToken, async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const task = await Task.findByIdAndDelete(taskId);
    if (!task) return res.status(404).send("Task not found");
    res.status(200).json("Task deleted.");
  } catch (error) {
    res.status(500).send("Server error");
  }
});

app.listen(port, () => {
  console.log(`✅ API listening on port ${port}`);
});
