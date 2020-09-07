import React from "react";
import { render, fireEvent, wait } from "@testing-library/react";
import Form from "./Form";

let mockSubmit;
let CompRender;
beforeEach(() => {
  mockSubmit = jest.fn();
  CompRender = render(
    <Form
      onPackageNameSubmit={(val) => {
        mockSubmit(val);
      }}
    />
  );
});
test("renders form", () => {
  expect(CompRender.getByLabelText("Enter Package Name")).toBeTruthy();
});

test("empty field submit display error but doesnt call parent", async () => {
  fireEvent.click(CompRender.getByRole("button"));

  await wait(() => {
    CompRender.getByText("Please enter a package name", {
      selector: ".text-danger",
    });
  });
  expect(mockSubmit.mock.calls.length).toBe(0);
});

test("invalid field submit display error but doesnt call parent", async () => {
  fireEvent.change(
    CompRender.container.querySelector('input[name="packageName"]'),
    {
      target: {
        value: "@@bad",
      },
    }
  );
  fireEvent.click(CompRender.getByRole("button"));

  await wait(() => {
    CompRender.getByText("Package name is invalid", {
      selector: ".text-danger",
    });
  });
  expect(mockSubmit.mock.calls.length).toBe(0);
});

test("field corection remove error", async () => {
  fireEvent.click(CompRender.getByRole("button"));

  await wait(() => {
    CompRender.getByText("Please enter a package name", {
      selector: ".text-danger",
    });
  });
  await wait(() => {
    fireEvent.change(
      CompRender.container.querySelector('input[name="packageName"]'),
      {
        target: {
          value: "good",
        },
      }
    );
  });

  expect(
    CompRender.queryByText("Please enter a package name", {
      selector: ".text-danger",
    })
  ).toBeNull();
  expect(mockSubmit.mock.calls.length).toBe(0);
});

test("valid field submit call parent", async () => {
  await wait(() => {
    fireEvent.change(
      CompRender.container.querySelector('input[name="packageName"]'),
      {
        target: {
          value: "good",
        },
      }
    );
    fireEvent.click(CompRender.getByRole("button"));
  });

  expect(mockSubmit.mock.calls.length).toBe(1);
  expect(mockSubmit.mock.calls[0][0]).toEqual({ packageName: "good" });
});
