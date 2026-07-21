import { render } from "@testing-library/react";
import { redirect } from "next/navigation";
import Home from "./page";

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

describe("Home", () => {
  it("redirects to /tasks", () => {
    render(<Home />);
    expect(redirect).toHaveBeenCalledWith("/tasks");
  });
});
