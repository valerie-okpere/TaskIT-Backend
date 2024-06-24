const express = require("express");
const brycpt = require("bcryptjs");
const { internsModel, adminModel } = require("../../src/mongodb");

var Data = {};
const app = express();

app.use(express.json());

const handleResponse = (res, status, data) => {
  return res.status(status).send({ data });
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

module.exports = {
  handleResponse: handleResponse,
  validateEmail: validateEmail,
  hashPassword: hashPassword,
  comparePassword: comparePassword,
  searchIntern: searchIntern,
  searchAdmin: searchAdmin,
  getCurrentDate: getCurrentDate,
};