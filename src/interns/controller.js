const { Router } = require("express");
const express = require("express");
const { reportModel, internsModel } = require("../mongodb");
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
    const { email, password } = req.body;
    const foundIntern = await searchIntern(email);
    const foundAdmin = await searchAdmin(email);

    if (foundIntern) {
      const passwordCheck = await comparePassword(
        password,
        foundIntern.password
      );

      if (!passwordCheck) {
        return handleResponse(res, 400, "Wrong Password");
      }

      const token = jwt.sign(
        { email: foundIntern.email, foundIntern: foundIntern },
        secretKey,
        {
          expiresIn: 86400,
        }
      );

      return res
        .status(200)
        .send({ token, message: "Intern login successful" });
    } else if (foundAdmin) {
      const passwordCheck = await comparePassword(
        password,
        foundAdmin.password
      );

      if (!passwordCheck) {
        return handleResponse(res, 400, "Wrong Password");
      }

      const token = jwt.sign(
        { email: foundAdmin.email, foundAdmin: foundAdmin },
        secretKey,
        {
          expiresIn: 86400,
        }
      );

      return res.status(200).send({ token, message: "Admin login successful" });
    } else {
      return handleResponse(res, 400, "User does not exist");
    }
  } catch (error) {
    handleResponse(res, 406, "Error, check console");
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

    const foundAdmin = await searchAdmin(email);

    if (foundAdmin) {
      return handleResponse(res, 400, "Admin with this email already exists");
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
    handleResponse(res, 406, "Error, check console");
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
    handleResponse(res, 406, "Error, check console");
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
    handleResponse(res, 406, "Error, check console");
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
    handleResponse(res, 406, "Error, check console");
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
    handleResponse(res, 406, "Error, check console");
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
    handleResponse(res, 406, "Error, check console");
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
    handleResponse(res, 406, "Error, check console");
    console.log(error);
  }
};

const internLogout = async (req, res) => {
  try {
    const { email, foundIntern } = req.body;

    if (!email) {
      return handleResponse(res, 400, "You have to log in");
    }

    if (!foundIntern) {
      return handleResponse(res, 400, "You dont have access to this page");
    }
    return handleResponse(res, 200, "Log out successful");
  } catch (error) {
    handleResponse(res, 406, "Error, check console");
    console.log(error);
  }
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
};
