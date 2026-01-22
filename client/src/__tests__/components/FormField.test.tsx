import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import FormField from "../../components/forms/FormField";

describe("FormField", () => {
  it("renders label and input", () => {
    render(
      <FormField
        label="Name"
        name="name"
        value=""
        onChange={() => {}}
        onBlur={() => {}}
      />,
    );

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("shows required indicator when required=true", () => {
    render(
      <FormField
        label="Name"
        name="name"
        required
        value=""
        onChange={() => {}}
        onBlur={() => {}}
      />,
    );

    expect(screen.getByText(/Name.*\*/)).toBeInTheDocument();
  });

  it("calls onChange when typing", () => {
    const handleChange = vi.fn();

    render(
      <FormField
        label="Name"
        name="name"
        value=""
        onChange={handleChange}
        onBlur={() => {}}
      />,
    );

    const input = screen.getByRole("textbox");

    fireEvent.change(input, {
      target: { value: "Bob" },
    });

    expect(handleChange).toHaveBeenCalled();
  });

  it("shows error only when touched", () => {
    const { rerender } = render(
      <FormField
        label="Name"
        name="name"
        value=""
        error="Required"
        touched={false}
        onChange={() => {}}
        onBlur={() => {}}
      />,
    );

    expect(screen.queryByText("Required")).toBeNull();

    rerender(
      <FormField
        label="Name"
        name="name"
        value=""
        error="Required"
        touched={true}
        onChange={() => {}}
        onBlur={() => {}}
      />,
    );

    expect(screen.getByText("Required")).toBeInTheDocument();
  });
});
