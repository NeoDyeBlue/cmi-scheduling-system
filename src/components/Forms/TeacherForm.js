import { FormikProvider, Form, useFormik } from "formik";
import {
  InputField,
  MultiSelect,
  MultiSelectItem,
  ImagePicker,
  RadioSelect,
  RadioSelectItem,
} from "../Inputs";
import { Button } from "../Buttons";
import { teacherSchema } from "@/lib/validators/teacher-validator";
import { useEffect } from "react";

export default function TeacherForm({ initialData, onCancel }) {
  const teacherFormik = useFormik({
    initialValues: {
      image: initialData?.image?.url || null,
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      preferredDays: initialData?.preferredDays || [],
      type: initialData?.type || "",
    },
    onSubmit: handleSubmit,
    validationSchema: teacherSchema,
  });

  // useEffect(() => {
  //   if (teacherFormik.values.type == "full-time") {
  //     teacherFormik.setFieldValue("preferredDays", []);
  //   }
  // }, [teacherFormik]);

  async function handleSubmit(values) {
    console.log(values);
  }
  return (
    <FormikProvider value={teacherFormik}>
      <Form className="flex flex-col gap-6">
        <ImagePicker
          name="image"
          label="Teacher Picture"
          infoMessage="File should be in '.jpg' or '.png', max file size is 5mb"
        />
        <InputField type="text" name="firstName" label="First Name" />
        <InputField type="text" name="lastName" label="Last Name" />
        <RadioSelect
          label="Type"
          error={
            teacherFormik.errors.type && teacherFormik.touched.type
              ? teacherFormik.errors.type
              : null
          }
        >
          <RadioSelectItem
            name="type"
            value="part-time"
            checked={teacherFormik.values.type == "part-time"}
          >
            Part-time
          </RadioSelectItem>
          <RadioSelectItem
            name="type"
            value="full-time"
            checked={teacherFormik.values.type == "full-time"}
          >
            Full-time
          </RadioSelectItem>
        </RadioSelect>
        {teacherFormik.values.type == "part-time" ? (
          <MultiSelect
            label="Preferred Days"
            infoMessage="You can select more than one"
            error={
              teacherFormik.errors.preferredDays &&
              teacherFormik.touched.preferredDays
                ? teacherFormik.errors.preferredDays
                : null
            }
          >
            <MultiSelectItem
              name="preferredDays"
              checked={teacherFormik.values.preferredDays.includes("0")}
              value={0}
            >
              <p>Monday</p>
            </MultiSelectItem>
            <MultiSelectItem
              name="preferredDays"
              checked={teacherFormik.values.preferredDays.includes("1")}
              value={1}
            >
              <p>Tuesday</p>
            </MultiSelectItem>
            <MultiSelectItem
              name="preferredDays"
              checked={teacherFormik.values.preferredDays.includes("2")}
              value={2}
            >
              <p>Wednesday</p>
            </MultiSelectItem>
            <MultiSelectItem
              name="preferredDays"
              checked={teacherFormik.values.preferredDays.includes("3")}
              value={3}
            >
              <p>Thursday</p>
            </MultiSelectItem>
            <MultiSelectItem
              name="preferredDays"
              checked={teacherFormik.values.preferredDays.includes("4")}
              value={4}
            >
              <p>Friday</p>
            </MultiSelectItem>
            <MultiSelectItem
              name="preferredDays"
              checked={teacherFormik.values.preferredDays.includes("5")}
              value={5}
            >
              <p>Saturday</p>
            </MultiSelectItem>
            <MultiSelectItem
              name="preferredDays"
              checked={teacherFormik.values.preferredDays.includes("6")}
              value={6}
            >
              <p>Sunday</p>
            </MultiSelectItem>
          </MultiSelect>
        ) : null}
        <div className="mb-1 flex gap-2">
          {onCancel && (
            <Button type="button" onClick={onCancel} secondary>
              Cancel
            </Button>
          )}
          <Button type="submit">Done</Button>
        </div>
      </Form>
    </FormikProvider>
  );
}
