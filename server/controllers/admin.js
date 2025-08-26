import TryCatch from "../middleware/tryCatch.js";
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/Lecture.js";
import fs from "fs/promises";
import { User } from "../models/user.js";
import path from "path";

export const createCourse = TryCatch(async (req, res) => {
  const { title, description, category, createdBy, duration, price } = req.body;

  const image = req.file;

  if (!image) {
    return res.status(400).json({ message: "Please add an image" });
  }

  // Normalize path to use forward slashes for web compatibility
  const imagePath = path.normalize(image.path).replace(/\\/g, "/");

  await Courses.create({
    title,
    description,
    category,
    createdBy,
    image: imagePath,
    duration,
    price,
  });

  res.status(201).json({
    message: "Course Created Successfully",
  });
});

export const addLectures = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);

  if (!course) {
    return res.status(404).json({
      message: "No Course with this id",
    });
  }

  const { title, description } = req.body;

  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "Please add a video lecture" });
  }

  // Normalize path to use forward slashes for web compatibility
  const videoPath = path.normalize(file.path).replace(/\\/g, "/");

  const lecture = await Lecture.create({
    title,
    description,
    video: videoPath,
    course: course._id,
  });

  res.status(201).json({
    message: "Lecture Added",
    lecture,
  });
});

export const deleteLecture = TryCatch(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);

  if (!lecture) {
    return res.status(404).json({ message: "Lecture not found" });
  }

  // Use fs.promises.unlink for safer async file deletion
  await fs.unlink(lecture.video);

  await lecture.deleteOne();

  res.json({ message: "Lecture Deleted" });
});

export const deleteCourse = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);

  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  const lectures = await Lecture.find({ course: course._id });

  await Promise.all(
    lectures.map(async (lecture) => {
      await fs.unlink(lecture.video);
    })
  );

  if (course.image) {
    await fs.unlink(course.image);
  }

  await Lecture.deleteMany({ course: req.params.id });

  await course.deleteOne();

  await User.updateMany({}, { $pull: { subscription: req.params.id } });

  res.json({
    message: "Course and associated content deleted successfully",
  });
});

export const getAllStats = TryCatch(async (req, res) => {
  // Use countDocuments for better performance
  const totalCourses = await Courses.countDocuments();
  const totalLectures = await Lecture.countDocuments();
  const totalUsers = await User.countDocuments();

  const stats = {
    totalCourses,
    totalLectures,
    totalUsers,
  };

  res.json({
    stats,
  });
});

export const getAllUser = TryCatch(async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user._id } }).select(
    "-password"
  );

  res.json({ users });
});

export const updateRole = TryCatch(async (req, res) => {
  // Corrected 'mainrole' to 'role' and added better authorization check
  if (req.user.role !== "superadmin") {
    return res.status(403).json({
      message: "Forbidden. You do not have permission to perform this action.",
    });
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.role === "user") {
    user.role = "admin";
  } else if (user.role === "admin") {
    user.role = "user";
  }

  await user.save();

  return res.status(200).json({
    message: `Role updated to ${user.role}`,
  });
});
