const Yup = require('yup');

const uploadRecipeValidationSchema = Yup.object({
  address: Yup.string()
    .required("address is required"),
  courier: Yup.string()
    .required("courier is required"),
});

module.exports = uploadRecipeValidationSchema