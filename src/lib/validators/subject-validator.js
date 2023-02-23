import * as yup from "yup";

export const subjectSchema = yup.object().shape({
  code: yup.string().required("Required"),
  name: yup.string().required("Required"),
  units: yup.number().min(1).max(3).required("Required"),
});
