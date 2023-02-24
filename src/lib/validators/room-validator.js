import * as yup from "yup";

export const roomSchema = yup.object().shape({
  code: yup.string().required("Required"),
  name: yup.string().required("Required"),
});
