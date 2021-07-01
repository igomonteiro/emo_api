import * as yup from 'yup';

const registerValidation = data => {
  const schema = yup.object().shape({
    name: yup.string()
        .required()
        .min(6)
        .max(100),
    email: yup.string()
        .required()
        .email(),
    password: yup.string()
        .required()
        .min(6)
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
        .min(6)
        .max(24),
  });

  return schema.isValid(data); 
};

export {
  registerValidation,
  loginValidation
};