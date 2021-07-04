import * as yup from 'yup';

const registerValidation = data => {
  const schema = yup.object().shape({
    name: yup.string()
        .required()
        .min(3)
        .max(100),
    email: yup.string()
        .required()
        .email(),
    password: yup.string()
        .required()
        .min(8)
        .max(24),
  });

  return schema.isValid(data); 
};

const loginValidation = data => {
  const schema = yup.object().shape({
    email: yup.string()
        .required()
        .email(),
    password: yup.string()
        .required()
        .min(8)
        .max(24),
  });

  return schema.isValid(data); 
};

const updateValidation = data => {
  const schema = yup.object().shape({
    name: yup.string(),
    oldPassword: yup.string()
        .min(8)
        .max(24),
    password: yup.string()
        .min(8)
        .max(24)
        .when('oldPassword', (oldPassword, field) => {
          oldPassword ? field.required() : field
        }),
  });

  return schema.isValid(data);
}

export {
  registerValidation,
  loginValidation,
  updateValidation,
};