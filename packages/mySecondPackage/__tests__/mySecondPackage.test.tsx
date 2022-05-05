import { render, screen } from "@testing-library/react";

import { Counter } from "../src/index";

describe("<Counter />", () => {
  test("should display a hello world", async () => {
    render(<Counter />);

    expect(screen.getByText(/hello world/i)).toBeInTheDocument();
  });
});
