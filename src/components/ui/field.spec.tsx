import { render, screen } from "@testing-library/react";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";

describe("field", () => {
  it("should render a field with label, description and error children", () => {
    render(
      <Field>
        <FieldLabel>Nome</FieldLabel>
        <FieldContent>
          <FieldDescription>Sua identificação</FieldDescription>
          <FieldError>Campo obrigatório</FieldError>
        </FieldContent>
      </Field>,
    );

    expect(screen.getByRole("group")).toHaveAttribute("data-slot", "field");
    expect(screen.getByText("Nome")).toBeInTheDocument();
    expect(screen.getByText("Sua identificação")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("Campo obrigatório");
  });

  it("should render the field with horizontal and responsive orientations", () => {
    const { rerender } = render(
      <Field orientation="horizontal">
        <FieldLabel>Horizontal</FieldLabel>
      </Field>,
    );

    expect(screen.getByRole("group")).toHaveAttribute(
      "data-orientation",
      "horizontal",
    );

    rerender(
      <Field orientation="responsive">
        <FieldLabel>Responsive</FieldLabel>
      </Field>,
    );

    expect(screen.getByRole("group")).toHaveAttribute(
      "data-orientation",
      "responsive",
    );
  });

  it("should render the legend and group inside a field set", () => {
    const { container } = render(
      <FieldSet>
        <FieldLegend variant="label">Localização</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel>Cidade</FieldLabel>
          </Field>
        </FieldGroup>
      </FieldSet>,
    );

    const legend = screen.getByText("Localização").closest("legend")!;
    expect(legend).toHaveAttribute("data-variant", "label");
    expect(legend).toHaveAttribute("data-slot", "field-legend");
    expect(legend.closest("fieldset")).toHaveAttribute(
      "data-slot",
      "field-set",
    );
    expect(
      container.querySelector('[data-slot="field-group"]'),
    ).toBeInTheDocument();
    expect(screen.getByText("Cidade")).toBeInTheDocument();
  });

  it("should use the legend variant by default", () => {
    render(
      <FieldSet>
        <FieldLegend>Seção</FieldLegend>
      </FieldSet>,
    );

    expect(screen.getByText("Seção").closest("legend")).toHaveAttribute(
      "data-variant",
      "legend",
    );
  });

  it("should render the title and the separator content", () => {
    const { container } = render(
      <Field>
        <FieldTitle>Duração</FieldTitle>
        <FieldSeparator>ou</FieldSeparator>
        <FieldTitle>Valor</FieldTitle>
      </Field>,
    );

    expect(screen.getByText("Duração")).toBeInTheDocument();
    const separator = container.querySelector('[data-slot="field-separator"]')!;
    expect(separator).toHaveAttribute("data-content", "true");
    expect(
      container.querySelector('[data-slot="field-separator-content"]'),
    ).toHaveTextContent("ou");
  });

  it("should render the separator without content", () => {
    const { container } = render(
      <Field>
        <FieldSeparator />
      </Field>,
    );

    const separator = container.querySelector('[data-slot="field-separator"]')!;
    expect(separator).toHaveAttribute("data-content", "false");
    expect(
      container.querySelector('[data-slot="field-separator-content"]'),
    ).not.toBeInTheDocument();
  });

  it("should render nothing when there are no children or errors", () => {
    const { container } = render(<FieldError />);

    expect(
      container.querySelector('[data-slot="field-error"]'),
    ).not.toBeInTheDocument();
  });

  it("should render nothing when the errors list is empty", () => {
    const { container } = render(<FieldError errors={[]} />);

    expect(
      container.querySelector('[data-slot="field-error"]'),
    ).not.toBeInTheDocument();
  });

  it("should render a single message when the errors are duplicated", () => {
    render(
      <FieldError
        errors={[
          { message: "E-mail inválido" },
          { message: "E-mail inválido" },
        ]}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("E-mail inválido");
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });

  it("should render the unique error messages as a list", () => {
    render(
      <FieldError
        errors={[
          { message: "Erro A" },
          { message: "Erro B" },
          { message: "Erro A" },
        ]}
      />,
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("should ignore errors without a message", () => {
    render(
      <FieldError errors={[{ message: "Erro A" }, { message: undefined }]} />,
    );

    expect(screen.getAllByRole("listitem")).toHaveLength(1);
  });
});
