import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

test("renders app with form", () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Enter Package Name/i);
  expect(linkElement).toBeInTheDocument();
});
