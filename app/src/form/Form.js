import React from "react";
import { useFormik } from "formik";
import "./Form.css";
import PackageNameRegex from "package-name-regex";

const validate = (values) => {
  const errors = {};

  if (!values.packageName) {
    errors.packageName = "Please enter a package name";
  } else if (!PackageNameRegex.test(values.packageName)) {
    errors.packageName = "Package name is invalid";
  }
  return errors;
};

const Form = () => {
  // Pass the useFormik() hook initial form values and a submit function that will

  // be called when the form is submitted

  const formik = useFormik({
    initialValues: {
      packageName: "",
    },
    validate,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} class="main-form">
      <div class="form-group">
        <label htmlFor="packageName">Enter Package Name</label>
        <div class="input-group">
          <input
            id="packageName"
            name="packageName"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.packageName}
            class="form-control"
          />
          <div class="input-group-append">
            <button type="submit" class="btn btn-outline-secondary">
              Go
            </button>
          </div>
        </div>

        {formik.errors.packageName ? (
          <small class="form-text text-danger">
            {formik.errors.packageName}
          </small>
        ) : null}
      </div>
    </form>
  );
};

export default Form;
