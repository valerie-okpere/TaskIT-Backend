const { Router } = require("express");
const express = require("express");
const { reportModel, internsModel, adminModel } = require("../mongodb");
const {
  handleResponse,
  validateEmail,
  hashPassword,
  comparePassword,
  searchIntern,
  searchAdmin,
  getCurrentDate,
} = require("../utils/helperFunctions");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const moment = require("moment");
const bodyParser = require("body-parser");
const router = Router();
const secretKey = "ValerieOreNkechi";

router.use(express.json());
router.use(cookieParser("Logbook Backend"));
router.use(bodyParser.urlencoded({ extended: true }));

const internLogin = async (req, res) => {
  try {
    const { foundIntern, foundAdmin, password } = req.body;

    if (foundIntern) {
      const passwordCheck = await comparePassword(
        password,
        foundIntern.password
      );

      if (!passwordCheck) {
        return handleResponse(res, 400, "Wrong Password");
      }
      req.session.foundIntern = foundIntern;

      const token = jwt.sign(
        { id: foundIntern._id, role: foundIntern.role },
        secretKey,
        {
          expiresIn: 86400,
        }
      );

      return handleResponse(res, 200, token, "Intern log in successful");
    } else if (foundAdmin) {
      const passwordCheck = await comparePassword(
        password,
        foundAdmin.password
      );

      if (!passwordCheck) {
        return handleResponse(res, 400, "Wrong Password");
      }
      req.session.foundAdmin = foundAdmin;

      const token = jwt.sign(
        { id: foundAdmin._id, role: foundAdmin.role },
        secretKey,
        {
          expiresIn: 86400,
        }
      );

      return handleResponse(res, 200, token, "Admin log in successful");
    } else {
      return handleResponse(res, 400, "User does not exist");
    }
  } catch (error) {
    console.log(error);
  }
};

const internSignup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword, duration } =
      req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !duration
    ) {
      return handleResponse(res, 400, "All fields must be filled");
    }

    if (!validateEmail(email)) {
      return handleResponse(res, 400, "Invalid email format");
    }

    if (password !== confirmPassword) {
      return handleResponse(res, 400, "Password not confirmed");
    }

    if (duration === "") {
      return handleResponse(res, 400, "Please select your duration");
    }

    const foundIntern = await searchIntern(email);

    if (foundIntern) {
      return handleResponse(res, 400, "Intern with this email already exists");
    }

    const token = jwt.sign({ email: email }, "EY");

    const newIntern = await internsModel.create({
      firstName,
      lastName,
      email,
      password: await hashPassword(password),
      duration,
      token,
    });

    const savedIntern = await newIntern.save();

    if (!savedIntern) {
      return handleResponse(res, 400, "Couldn't save information");
    }

    return handleResponse(res, 200, "Signup successful");
  } catch (error) {
    console.log(error);
  }
};

const internHomePage = async (req, res) => {
  try {
    const { email, foundIntern } = req.body;
    if (!email) {
      return handleResponse(res, 400, "You have to log in");
    }

    if (!foundIntern) {
      return handleResponse(res, 400, "You dont have access to this page");
    }

    const foundWeek = await reportModel.find({
      email: email,
      week: moment().week(),
    });

    if (foundWeek.length === 0) {
      return handleResponse(res, 200, foundIntern, "No previous report");
    }

    return handleResponse(res, 200, foundIntern, foundWeek);
  } catch (error) {
    console.log(error);
  }
};

const internProfile = async (req, res) => {
  try {
    const { email, foundIntern } = req.body;

    if (!email) {
      return handleResponse(res, 400, "You have to log in");
    }

    if (!foundIntern) {
      return handleResponse(res, 400, "You dont have access to this page");
    }

    return handleResponse(res, 200, foundIntern);
  } catch (error) {
    console.log(error);
  }
};

const internReportUpload = async (req, res) => {
  try {
    const { email, foundIntern, day, date, taskTitle, taskDescription } =
      req.body;

    if (!email) {
      return handleResponse(res, 400, "You have to log in");
    }

    if (!foundIntern) {
      return handleResponse(res, 400, "You dont have access to this page");
    }

    if (!day || !date || !taskTitle || !taskDescription) {
      return handleResponse(res, 400, "Please fill all fields");
    }

    const week = moment(date).week();
    const currentWeek = moment().week();

    if (week !== currentWeek) {
      return handleResponse(res, 400, "You have to submit for this week");
    }

    const dayOfWeek = moment(date).format("dddd");
    if (day != dayOfWeek) {
      return handleResponse(
        res,
        400,
        "You have to put in the correct date for that day"
      );
    }

    const newReport = await reportModel.create({
      email,
      week: week,
      day,
      date,
      taskTitle,
      taskDescription,
    });

    const savedReport = await newReport.save();

    if (!savedReport) {
      return handleResponse(res, 400, "Couldn't save information");
    }

    return handleResponse(res, 200, "Report Upload Successful");
  } catch (error) {
    console.log(error);
  }
};

const internPreview = async (req, res) => {
  try {
    const { email, foundIntern } = req.body;

    if (!email) {
      return handleResponse(res, 400, "You have to log in");
    }

    if (!foundIntern) {
      return handleResponse(res, 400, "You dont have access to this page");
    }

    const foundReport = await reportModel.find({
      email: email,
      date: getCurrentDate(),
    });

    if (foundReport.length === 0) {
      return handleResponse(res, 200, "Reports submiited today will show here");
    }

    return handleResponse(res, 200, foundReport);
  } catch (error) {
    console.log(error);
  }
};

const internPreviewSearch = async (req, res) => {
  try {
    const { email, foundIntern, search, date } = req.body;

    if (!email) {
      return handleResponse(res, 400, "You have to log in");
    }

    if (!foundIntern) {
      return handleResponse(res, 400, "You dont have access to this page");
    }

    if (!search && !date) {
      return handleResponse(res, 400, "Please enter a search");
    }

    let searchQuery = {
      email: email,
    };

    if (search) {
      searchQuery.$or = [
        { day: { $regex: search, $options: "i" } },
        { taskTitle: { $regex: search, $options: "i" } },
        { taskDescription: { $regex: search, $options: "i" } },
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
    console.log(error);
  }
};

const internChangePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword, confirmPassword } = req.body;

    const foundIntern = await searchIntern(email);

    if (!email) {
      return handleResponse(res, 400, "You have to log in");
    }

    if (!foundIntern) {
      return handleResponse(res, 400, "You dont have access to this page");
    }

    if (!oldPassword || !newPassword || !confirmPassword) {
      return handleResponse(res, 400, "Please fill all fields");
    }

    const passwordCheck = await comparePassword(
      oldPassword,
      foundIntern.password
    );

    if (!passwordCheck) {
      return handleResponse(res, 400, "Wrong password");
    }

    if (newPassword !== confirmPassword) {
      return handleResponse(res, 400, "Password not confirmed");
    }

    if (oldPassword === newPassword) {
      return handleResponse(
        res,
        400,
        "Old password can not be the same as new password"
      );
    }

    const changedPassword = await internsModel.findOneAndUpdate(
      { email },
      { password: await hashPassword(newPassword), updatedAt: Date.now() }
    );

    if (!changedPassword) {
      return handleResponse(res, 400, "Could not change password");
    }

    return handleResponse(res, 200, "Password change successful");
  } catch (error) {
    console.log(error);
  }
};

const internLogout = async (req, res) => {
  return handleResponse(res, 200, "Log out successful");
};

// ADMIN

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
    console.log(error);
  }
};

const adminHome = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return handleResponse(res, 400, "You dont have access to this page");
  }
  const foundInterns = await internsModel.find({});

  if (!foundInterns) {
    return handleResponse(res, 400, "Currently no Interns");
  }

  return handleResponse(res, 200, foundInterns);
};

const adminPreview = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return handleResponse(res, 400, "You dont have access to this page");
  }
  const foundReports = await reportModel.find({ date: getCurrentDate() });

  if (!foundReports) {
    return res.status(400).send("Currently no Reports");
  }
  return res.status(200).send(foundReports);
};

const adminPreviewSearch = async (req, res) => {
  try {
    const { email, internEmail, search, date } = req.body;

    if (!email) {
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
    console.log(error);
  }
};

const adminProfile = async (req, res) => {
  try {
    const { email, foundAdmin } = req.body;

    if (!email) {
      return handleResponse(res, 400, "You dont have access to this page");
    }

    return handleResponse(res, 200, foundAdmin);
  } catch (error) {
    console.log(error);
  }
};

const adminDelete = async (req, res) => {
  try {
    const { email, internEmail } = req.body;

    if (!email) {
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
    console.log(error);
  }
};

const adminHomeSearch = async (req, res) => {
  const { email, internEmail, foundAdmin } = req.body;

  if (!foundAdmin) {
    return handleResponse(res, 400, "You dont have access to this page");
  }

  const foundIntern = await searchIntern(internEmail);

  if (!foundIntern) {
    return handleResponse(res, 400, "Intern with this email does not exist");
  }

  return handleResponse(res, 200, foundIntern);
};

const adminLogout = async (req, res) => {
  return handleResponse(res, 200, "Log out successful");
};

module.exports = {
  internLogin: internLogin,
  internSignup: internSignup,
  internHomePage: internHomePage,
  internProfile: internProfile,
  internReportUpload: internReportUpload,
  internPreview: internPreview,
  internPreviewSearch: internPreviewSearch,
  internChangePassword: internChangePassword,
  internLogout: internLogout,
  //ADMIN
  adminSignUp: adminSignUp,
  adminHome: adminHome,
  adminPreview: adminPreview,
  adminPreviewSearch: adminPreviewSearch,
  adminProfile: adminProfile,
  adminDelete: adminDelete,
  adminHomeSearch: adminHomeSearch,
};
