import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  it("renders without crashing", () => {
    render(<App />);
    expect(screen.getByText("Left")).toBeInTheDocument();
    expect(screen.getByText("Right")).toBeInTheDocument();
  });

  it("displays the file panel with initial path", () => {
    render(<App />);
    expect(screen.getByText("C:\\")).toBeInTheDocument();
  });

  it("shows the current directory in the command prompt", () => {
    render(<App />);
    expect(screen.getByText("C:\\>")).toBeInTheDocument();
  });

  it("updates the prompt input with the selected file name in lowercase", () => {
    render(<App />);
    const fileButton = screen.getByRole("button", { name: /readme\.txt/i });
    fireEvent.click(fileButton);
    expect(screen.getByRole("textbox")).toHaveValue("readme.txt");
  });

  it("shows parent directory (..) after entering a subdirectory", async () => {
    render(<App />);
    const gamesButton = screen.getByRole("button", { name: /games/i });
    fireEvent.click(gamesButton);
    fireEvent.click(gamesButton);
    expect(await screen.findByText(/\.\./)).toBeInTheDocument();
  });
});
