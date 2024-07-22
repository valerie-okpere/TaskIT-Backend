const { Router } = require("express");
const express = require("express");
const { reportModel, internsModel, adminModel } = require("../mongodb");
const {
  handleResponse,
  validateEmail,
  hashPassword,
  searchIntern,
  searchAdmin,
  getCurrentDate,
} = require("../utils/helperFunctions");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const router = Router();

router.use(express.json());
router.use(cookieParser("Logbook Backend"));
router.use(bodyParser.urlencoded({ extended: true }));

const adminSignUp = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return handleResponse(res, 400, "All fields must be filled");
    }

    if (!validateEmail(email)) {
      return handleResponse(res, 400, "Invalid email format");
    }

    if (password !== confirmPassword) {
      return handleResponse(res, 400, "Password not confirmed");
    }

    const foundAdmin = await searchAdmin(email);

    if (foundAdmin) {
      return handleResponse(res, 400, "Admin with this email already exists");
    }

    const foundIntern = await searchIntern(email);

    if (foundIntern) {
      return handleResponse(res, 400, "Intern with this email already exists");
    }

    const token = jwt.sign({ email: email }, "EY");

    const newAdmin = await adminModel.create({
      firstName,
      lastName,
      email,
      password: await hashPassword(password),
      token,
    });

    const savedAdmin = await newAdmin.save();

    if (!savedAdmin) {
      return handleResponse(res, 400, "Couldn't save information");
    }

    return handleResponse(res, 200, "Admin sign up successful");
  } catch (error) {
    handleResponse(res, 406, "Error, check console");
    handleResponse(res, 406, "Error, check console");
    console.log(error);
  }
};

const adminHome = async (req, res) => {
  const { email, foundAdmin } = req.body;

  if (!email || !foundAdmin) {
    return handleResponse(res, 400, "You dont have access to this page");
  }
  const foundInterns = await internsModel.find({});

  if (!foundInterns) {
    return handleResponse(res, 401, "Currently no Interns");
  }

  return handleResponse(res, 200, foundAdmin, foundInterns);
};

const adminPreview = async (req, res) => {
  const { email, foundAdmin } = req.body;

  if (!email || !foundAdmin) {
    return handleResponse(res, 400, "You dont have access to this page");
  }

  const foundReports = await reportModel.find({ date: getCurrentDate() });

  if (!foundReports) {
    return handleResponse(res, 200, "Currently no Reports");
  }
  return handleResponse(res, 200, foundReports);
};

const adminPreviewSearch = async (req, res) => {
  try {
    const { email, foundAdmin, search, date } = req.body;

    if (!email || !foundAdmin) {
      return handleResponse(res, 400, "You dont have access to this page");
    }

    if (!search && !date) {
      return handleResponse(res, 400, "Please enter a search");
    }

    let searchQuery = {};

    if (search) {
      searchQuery.$or = [
        { day: { $regex: search, $options: "i" } },
        { taskTitle: { $regex: search, $options: "i" } },
        { taskDescription: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1); // Set to the next day
      searchQuery.date = {
        $gte: startDate,
        $lt: endDate,
      };
    }

    const query = await reportModel.find(searchQuery);

    if (!query.length) {
      return handleResponse(res, 200, "Couldn't find report");
    }

    return handleResponse(res, 200, query);
  } catch (error) {
    handleResponse(res, 406, "Error, check console");
    console.log(error);
  }
};

const adminProfile = async (req, res) => {
  try {
    const { email, foundAdmin } = req.body;

    if (!email || !foundAdmin) {
      return handleResponse(res, 400, "You dont have access to this page");
    }

    return handleResponse(res, 200, foundAdmin);
  } catch (error) {
    handleResponse(res, 406, "Error, check console");
    console.log(error);
  }
};

const adminDelete = async (req, res) => {
  try {
    const { email, foundAdmin } = req.body;

    if (!email || !foundAdmin) {
      return handleResponse(res, 400, "You dont have access to this page");
    }

    if (!internEmail) {
      return handleResponse(res, 400, "You have not entered the interns email");
    }

    const deletedIntern = await internsModel.findOneAndDelete({
      email: internEmail,
    });

    if (!deletedIntern) {
      return handleResponse(res, 400, "Could not delete");
    }

    return handleResponse(res, 200, "Deleted successfully");
  } catch (error) {
    handleResponse(res, 406, "Error, check console");
    console.log(error);
  }
};

const adminHomeSearch = async (req, res) => {
  const { email, internEmail, foundAdmin } = req.body;

  if (!email || !foundAdmin) {
    return handleResponse(res, 400, "You dont have access to this page");
  }

  const foundIntern = await searchIntern(internEmail);

  if (!foundIntern) {
    return handleResponse(res, 400, "Intern with this email does not exist");
  }

  return handleResponse(res, 200, foundIntern);
};

const adminLogout = async (req, res) => {
  try {
    const { email, foundAdmin } = req.body;

    if (!email || !foundAdmin) {
      return handleResponse(res, 400, "You dont have access to this page");
    }
    return handleResponse(res, 200, "Log out successful");
  } catch (error) {
    handleResponse(res, 406, "Error, check console");
    console.log(error);
  }
};

module.exports = {
  adminSignUp: adminSignUp,
  adminHome: adminHome,
  adminPreview: adminPreview,
  adminPreviewSearch: adminPreviewSearch,
  adminProfile: adminProfile,
  adminDelete: adminDelete,
  adminHomeSearch: adminHomeSearch,
  adminLogout: adminLogout,
};
