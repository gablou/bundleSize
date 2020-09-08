import React from "react";
import {
  render,
  getByText as getByTextFromContainer,
} from "@testing-library/react";
import Chart from "./Chart";

test("renders Error in chart", () => {
  const errorResult = {
    error: true,
    data: "mockError",
  };
  const { getByText } = render(<Chart result={errorResult} />);
  getByText("mockError");
});

test("renders nothing if no data", () => {
  const errorResult = {
    error: false,
    data: null,
  };
  const { container } = render(<Chart result={errorResult} />);
  expect(container.hasChildNodes()).toBe(false);
});

test("render data in bar", () => {
  const result = {
    error: false,
    data: [
      { packageName: "testPackage", version: "1.1.4", error: true },
      {
        packageName: "testPackage",
        version: "2.0.0",
        size: 209715200,
        sizeGzip: 104857600,
      },
      {
        packageName: "testPackage",
        version: "3.0.0",
        size: 104857600,
        sizeGzip: 10485760,
      },
    ],
  };
  const { container } = render(<Chart result={result} />);
  expect(container.querySelectorAll(".bar").length).toBe(4);

  getByTextFromContainer(
    container.querySelectorAll(".bar")[0],
    "No previous major version"
  );
  getByTextFromContainer(
    container.querySelectorAll(".bar")[1],
    "could not calculate"
  );
  getByTextFromContainer(
    container.querySelectorAll(".bar")[2].querySelector(".size"),
    "200.0 Mb"
  );
  getByTextFromContainer(
    container.querySelectorAll(".bar")[2].querySelector(".gz-size"),
    "100.0 Mb"
  );
});

test("if 4 version no missing previous major version message", () => {
  const result = {
    error: false,
    data: [
      { packageName: "testPackage", version: "1.1.4", error: true },
      { packageName: "testPackage", version: "1.1.5", error: true },
      {
        packageName: "testPackage",
        version: "2.0.0",
        size: 209715200,
        sizeGzip: 104857600,
      },
      {
        packageName: "testPackage",
        version: "3.0.0",
        size: 104857600,
        sizeGzip: 10485760,
      },
    ],
  };
  const { container, queryByText } = render(<Chart result={result} />);
  expect(container.querySelectorAll(".bar").length).toBe(4);

  expect(queryByText("No previous major version")).toBeNull();
});
