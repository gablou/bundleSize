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

const Form = (props) => {
  const formik = useFormik({
    initialValues: {
      packageName: "",
    },
    validate,
    onSubmit: (values) => {
      props.onPackageNameSubmit(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="main-form">
      <div className="form-group">
        <label htmlFor="packageName">Enter Package Name</label>
        <div className="input-group">
          <input
            id="packageName"
            name="packageName"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.packageName}
            className="form-control"
          />
          <div className="input-group-append">
            <button type="submit" className="btn btn-outline-secondary">
              Go
            </button>
          </div>
        </div>

        {formik.errors.packageName ? (
          <small className="form-text text-danger">
            {formik.errors.packageName}
          </small>
        ) : null}
      </div>
    </form>
  );
};

export default Form;
