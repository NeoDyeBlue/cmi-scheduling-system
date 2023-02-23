import * as yup from "yup";

export const teacherSchema = yup.object().shape({
  firstName: yup.string().required("Required"),
  lastName: yup.string().required("Required"),
  type: yup.string().oneOf(["part-time", "full-time"]).required("Required"),
  //   preferredDays: yup.array().when("type", {
  //     is: (val) => val && val == "full-time",
  //     then: yup
  //       .array()
  //       .nullable()
  //       .of(yup.string().oneOf(["0", "1", "2", "3", "4", "5", "6"]))
  //       .min(0)
  //       .notRequired(),
  //     otherwise: yup
  //       .array()
  //       .nullable()
  //       .of(yup.string().oneOf(["0", "1", "2", "3", "4", "5", "6"]))
  //       .min(1, "Select at least one option")
  //       .required("required for part-timers"),
  //   }),
  // preferredDays: yup.array()
  preferredDays: yup
    .array()
    .nullable()
    .of(yup.string().oneOf(["0", "1", "2", "3", "4", "5", "6"]))
    .min(1, "Select at least one option")
    .required("Required"),
});
