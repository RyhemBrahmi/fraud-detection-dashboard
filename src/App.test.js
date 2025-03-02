import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";
import "@testing-library/jest-dom";

test("renders learn react link", () => {
  const { debug } = render(<App />);
  debug(); // Affiche le DOM actuel dans la console
});
