const signUpValidationSchema = {
  firstName: {
    isLength: {
      options: {
        min: 3,
        max: 32,
      },
      errorMessage: "First name must have between 3 to 32 characters",
    },
    notEmpty: {},
  },
};