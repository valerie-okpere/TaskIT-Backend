const express = require("express");
const brycpt = require("bcryptjs");
const { internsModel, adminModel } = require("../../src/mongodb");
const jwt = require("jsonwebtoken");
const secretKey = "ValerieOreNkechi";
const app = express();

app.use(express.json());

const handleResponse = (res, status, data, info) => {
  if (!info) {
    return res.status(status).send({ data });
  } else {
    return res.status(status).send({ data, info });
  }
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+(.[^\s@]+)?@ng\.ey\.com$/;
  return emailRegex.test(email);
};

const hashPassword = (password) => {
  const hashedPassword = brycpt.hash(password, 10);
  return hashedPassword;
};

const comparePassword = (password, hashedPassword) => {
  const comparedPassword = brycpt.compare(password, hashedPassword);
  return comparedPassword;
};

const searchIntern = async (email) => {
  const intern = await internsModel.findOne({ email });

  if (intern) {
    return intern;
  }
};

const searchAdmin = async (email) => {
  const admin = await adminModel.findOne({ email });

  if (admin) {
    return admin;
  }
};

const getCurrentDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const validateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).send({ auth: false, message: "No token provided." });
  }

  const jwtToken = req.cookies["token"];

  if (!jwtToken) {
    return handleResponse(res, 400, "You have to log in");
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res
        .status(500)
        .send({ auth: false, message: "Failed to authenticate token." });
    } else {
      req.body.email = decoded.email;
      req.body.foundIntern = decoded.foundIntern;
      next();
    }
  });
};

const adminValidateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).send({ auth: false, message: "No token provided." });
  }

  const jwtToken = req.cookies["token"];

  if (!jwtToken) {
    return handleResponse(res, 400, "You have to log in");
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res
        .status(500)
        .send({ auth: false, message: "Failed to authenticate token." });
    } else {
      req.body.email = decoded.email;
      req.body.foundAdmin = decoded.foundAdmin;
      next();
    }
  });
};

module.exports = {
  handleResponse: handleResponse,
  validateEmail: validateEmail,
  hashPassword: hashPassword,
  comparePassword: comparePassword,
  searchIntern: searchIntern,
  searchAdmin: searchAdmin,
  getCurrentDate: getCurrentDate,
  validateToken: validateToken,
  adminValidateToken: adminValidateToken,
};
