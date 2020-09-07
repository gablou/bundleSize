import React from "react";
import { render, fireEvent, wait } from "@testing-library/react";
import App from "./App";
import axios from "axios";
import Chart from "./chart/Chart";

jest.mock("axios");

jest.mock("./chart/Chart", () => {
  return {
    __esModule: true,
    default: jest.fn(() => {
      return <div data-testid="mock-chart"></div>;
    }),
  };
});

test("renders app with form", () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Enter Package Name/i);
  expect(linkElement).toBeInTheDocument();
});

test("during APi call display loader", async () => {
  let resolveGet, rejectGet;
  axios.get.mockImplementation(() => {
    return new Promise((resolve, reject) => {
      rejectGet = reject;
      resolveGet = resolve;
    });
  });
  const { container, getByRole, getByText, queryByText } = render(<App />);
  await wait(() => {
    fireEvent.change(container.querySelector('input[name="packageName"]'), {
      target: {
        value: "good",
      },
    });
    fireEvent.click(getByRole("button"));
  });
  getByText("Loading...");
  await wait(() => {
    resolveGet({
      data: [],
    });
  });
  expect(queryByText("Loading...")).toBeNull();

  await wait(() => {
    fireEvent.change(container.querySelector('input[name="packageName"]'), {
      target: {
        value: "good",
      },
    });
    fireEvent.click(getByRole("button"));
  });
  getByText("Loading...");
  await wait(() => {
    rejectGet({});
  });
  expect(queryByText("Loading...")).toBeNull();
});

test("on APi call error shoudl call chart with Unknow Error", async () => {
  axios.get.mockImplementation(() => Promise.reject({}));
  const { container, getByRole } = render(<App />);
  await wait(() => {
    fireEvent.change(container.querySelector('input[name="packageName"]'), {
      target: {
        value: "good",
      },
    });
    fireEvent.click(getByRole("button"));
  });
  expect(Chart).toHaveBeenLastCalledWith(
    {
      result: {
        data: "Unknown Error",
        error: true,
      },
    },
    {}
  );
});

test("on APi call UnknownError shoudl call chart with Unknow Error", async () => {
  axios.get.mockImplementation(() =>
    Promise.reject({
      response: {
        data: {
          statusCode: 500,
          type: "UnknownError",
          error: "Internal Error",
          message: "Unknown Error",
        },
      },
    })
  );
  const { container, getByRole } = render(<App />);
  await wait(() => {
    fireEvent.change(container.querySelector('input[name="packageName"]'), {
      target: {
        value: "good",
      },
    });
    fireEvent.click(getByRole("button"));
  });
  expect(Chart).toHaveBeenLastCalledWith(
    {
      result: {
        data: "Unknown Error",
        error: true,
      },
    },
    {}
  );
});

test("on APi call PackageNotFoundError should call chat with corrext mesage", async () => {
  axios.get.mockImplementation(() =>
    Promise.reject({
      response: {
        data: {
          statusCode: 400,
          type: "PackageNotFoundError",
          error: "Bad Request",
          message: "Unable to find package",
        },
      },
    })
  );
  const { container, getByRole } = render(<App />);
  await wait(() => {
    fireEvent.change(container.querySelector('input[name="packageName"]'), {
      target: {
        value: "good",
      },
    });
    fireEvent.click(getByRole("button"));
  });
  expect(Chart).toHaveBeenLastCalledWith(
    {
      result: {
        data: "Unable to find package",
        error: true,
      },
    },
    {}
  );
});

test("on APi call succes should give chart correct result", async () => {
  const mockData = "mockData";
  axios.get.mockImplementation(() =>
    Promise.resolve({
      data: mockData,
    })
  );
  const { container, getByRole } = render(<App />);
  await wait(() => {
    fireEvent.change(container.querySelector('input[name="packageName"]'), {
      target: {
        value: "good",
      },
    });
    fireEvent.click(getByRole("button"));
  });
  expect(Chart).toHaveBeenLastCalledWith(
    {
      result: {
        data: mockData,
        error: false,
      },
    },
    {}
  );
});
