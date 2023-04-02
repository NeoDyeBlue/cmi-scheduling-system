import mongoose from 'mongoose';
export default function errorThrower(name, message) {
  let error = new Error(message);
  error.name = name;
  return error;
}

export function validationError(
  err,
  name,
  custom_msg = 'Something went wrong'
) {
  if (err instanceof mongoose.Error.validationError) {
    console.log("rr.message",err.message)
    throw errorThrower(name, err.message);
  } else {
    throw errorThrower(name, custom_msg);
  }
}
