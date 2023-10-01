const Yup = require('yup');

const uploadRecipeValidationSchema = Yup.object({
  address: Yup.object()
    .required("address is required"),
  courier: Yup.object()
    .required("courier is required"),
});

module.exports = uploadRecipeValidationSchema