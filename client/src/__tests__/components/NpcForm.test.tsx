import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import NpcForm from "../../components/npc/NpcForm";
import * as useNpcFormHook from "../../hooks/useNpcForm";

const mockHook = {
  formData: {
    name: "",
    role: "",
    descriptor: "",
    race: "",
    agenda: "",
  },
  errors: {},
  touched: {},
  isFormValid: true,
  handleChange: vi.fn(),
  handleBlur: vi.fn(),
  handleSubmit: vi.fn(),
};

describe("NpcForm", () => {
  beforeEach(() => {
    vi.spyOn(useNpcFormHook, "useNpcForm").mockReturnValue(mockHook as any);
  });

  it("renders create header when no initialNpc", () => {
    render(<NpcForm onSubmit={vi.fn()} onCancel={vi.fn()} />);

    expect(
      screen.getByRole("heading", { name: "Create NPC" }),
    ).toBeInTheDocument();
  });

  it("renders edit header when initialNpc provided", () => {
    render(
      <NpcForm
        initialNpc={{ id: "1", name: "Test" } as any}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Edit NPC" }),
    ).toBeInTheDocument();
  });

  it("calls handleSubmit on form submit", () => {
    render(<NpcForm onSubmit={vi.fn()} onCancel={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "Create NPC" }));

    expect(mockHook.handleSubmit).toHaveBeenCalled();
  });

  it("calls onCancel when cancel button clicked", () => {
    const onCancel = vi.fn();

    render(<NpcForm onSubmit={vi.fn()} onCancel={onCancel} />);

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onCancel).toHaveBeenCalled();
  });

  it("calls handleBlur when input loses focus", () => {
    render(<NpcForm onSubmit={vi.fn()} onCancel={vi.fn()} />);

    const nameInput = document.querySelector(
      'input[name="name"]',
    ) as HTMLInputElement;

    fireEvent.blur(nameInput);

    expect(mockHook.handleBlur).toHaveBeenCalled();
    const roleInput = document.querySelector(
      'input[name="role"]',
    ) as HTMLInputElement;

    fireEvent.blur(roleInput);
    expect(mockHook.handleBlur).toHaveBeenCalled();
    const descriptorInput = document.querySelector(
      'input[name="descriptor"]',
    ) as HTMLInputElement;

    fireEvent.blur(descriptorInput);
    expect(mockHook.handleBlur).toHaveBeenCalled();
    const raceInput = document.querySelector(
      'input[name="race"]',
    ) as HTMLInputElement;

    fireEvent.blur(raceInput);

    expect(mockHook.handleBlur).toHaveBeenCalled();
    const agendaInput = document.querySelector(
      'input[name="agenda"]',
    ) as HTMLInputElement;

    fireEvent.blur(agendaInput);
    expect(mockHook.handleBlur).toHaveBeenCalled();
  });
});
