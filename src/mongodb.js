const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to the DB");
  })
  .catch((error) => {
    console.log(error);
  });

const signUpSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Firstname is required"],
  },
  lastName: {
    type: String,
    required: [true, "Lastname is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  duration: {
    type: String,
    required: [true, "Duration is required"],
  },
  role: {
    type: String,
    default: "Intern",
  },
  token: {
    type: String,
    required: [true, "Token couldnt be generated"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: null,
  },
});

const internsModel = new mongoose.model("Intern Model", signUpSchema);

const adminSignUpSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Firstname is required"],
  },
  lastName: {
    type: String,
    required: [true, "Lastname is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  role: {
    type: String,
    default: "Admin",
  },
  token: {
    type: String,
    required: [true, "Token couldnt be generated"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: null,
  },
});

const adminModel = new mongoose.model("Admin Model", adminSignUpSchema);

const reportSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, "Error getting email"],
  },
  week: {
    type: Number,
    default: null,
  },
  day: {
    type: String,
    required: true,
  },
  taskTitle: {
    type: String,
    required: true,
  },
  taskDescription: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

reportSchema.index({
  email: "text",
  day: "text",
  taskTitle: "text",
  taskDescription: "text",
});

const reportModel = new mongoose.model("Report Model", reportSchema);

module.exports = {
  reportModel: reportModel,
  internsModel: internsModel,
  adminModel: adminModel,
};
