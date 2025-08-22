import express from "express";
import bcrypt from "bcrypt";
import { connectDB } from "./db.js";
const app = express();

import jwt from "jsonwebtoken";
import { ContentModel, LinkModel, UserModel } from "./db.js";
import dotenv from "dotenv";
import { userMiddleware } from "./middleware.js";
const JWT_SECRET = process.env.JWT_SECRET as string | undefined;
import { random } from "./utils.js";
import cors from "cors";

dotenv.config();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

//signup route
app.post("/api/v1/signup/", async (req, res) => {
  //use zod
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      msg: "Missing inputs",
    });
  }

  try {
    //hash password
    const salt = await bcrypt.genSalt(5);
    const hashPassword = await bcrypt.hash(password, salt);

    await UserModel.create({
      username: username,
      password: hashPassword,
    });

    return res.status(200).json({
      msg: "Signed up",
    });
  } catch (err: any) {
    if (err.code === 11000) {
      // duplicate username
      return res.status(409).json({
        msg: "User already exists",
      });
    }

    // Other unknown errors
    console.error("Signup error:", err);
    return res.status(500).json({
      msg: "Something went wrong",
      error: err.message,
    });
  }
});

app.post("/api/v1/signin/", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
      return res.status(401).json({
        msg: "username & password required",
      });
    }

    const user = await UserModel.findOne({
      username,
    });

    if (!user) {
      return res.status(404).json({
        msg: "User not found",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        msg: "Invalid password",
      });
    }

    if (!JWT_SECRET) {
      return res.status(500).json({
        msg: "JWT secret is not configured",
      });
    }
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      JWT_SECRET
    );

    return res.status(200).json({
      msg: "Login successful",
      token,
    });
  } catch (error) {
    console.log("Signin error");

    return res.status(411).json({
      msg: "Something went wrong",
      error: error,
    });
  }
});

app.post("/api/v1/content/", userMiddleware, async (req, res) => {
  const link = req.body.link;
  const type = req.body.type;

  await ContentModel.create({
    link,
    type,
    //@ts-ignore-
    userId: req.userId,
    tags: [],
  });

  res.json({
    msg: "content added",
  });
});

app.get("/api/v1/content/", userMiddleware, async (req, res) => {
  //@ts-ignore
  const userId = req.userId;
  const content = await ContentModel.find({
    userId: userId,
  }).populate("userId");

  res.json({
    content,
  });
});

app.delete("/api/v1/content/", userMiddleware, async (req, res) => {
  const contentId = req.body.contentId;

  await ContentModel.deleteOne({
    _id: contentId,
    //@ts-ignore
    userId: req.userId,
  });
});

app.post("/api/v1/brain/share", userMiddleware, async (req, res) => {
  const share = req.body.share;
  try {
    if (share) {
      //check if link already exits
      const existingLink = await LinkModel.findOne({
        //@ts-ignore
        userId: req.userId,
      });
      if (existingLink) {
        return res.json({
          hash: existingLink.hash,
        });
      }

      //if not exists, create one
      const hash = random(10);
      await LinkModel.create({
        //@ts-ignore
        userId: req.userId,
        hash,
      });

      res.json({
        msg: "Updated share link",
        hash,
      });
    } else {
      await LinkModel.deleteOne({
        //@ts-ignore
        userId: req.userId,
      });

      res.json({
        msg: "Link removed",
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Something went wrong" });
  }
});

app.get("/api/v1/brain/:shareLink", async (req, res) => {
  const hash = req.params.shareLink;

  //find the link form hash
  const link = await LinkModel.findOne({
    hash,
  });

  if (!link) {
    return res.status(411).json({
      msg: "Invalid link",
    });
  }

  //Fetch content & user details
  const content = await ContentModel.find({
    userId: link.userId,
  });

  const user = await UserModel.findOne({
    _id: link.userId,
  });

  if (!user) {
    return res.status(411).json({
      msg: "User not found",
    });
  }
  //if everything is fine, send username & content
  res.json({
    username: user.username,
    content,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}`);
});

const main = async () => {
  await connectDB();
};
main();
