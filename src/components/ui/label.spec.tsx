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
} from "./field";

describe("FieldSet", () => {
  it("renders children", () => {
    render(
      <FieldSet>
        <span>conteúdo</span>
      </FieldSet>,
    );

    expect(screen.getByText("conteúdo")).toBeInTheDocument();
  });
});

describe("FieldLegend", () => {
  it("defaults to legend variant", () => {
    render(<FieldLegend>Título</FieldLegend>);

    expect(screen.getByText("Título")).toHaveAttribute(
      "data-variant",
      "legend",
    );
  });

  it("accepts label variant", () => {
    render(<FieldLegend variant="label">Título</FieldLegend>);

    expect(screen.getByText("Título")).toHaveAttribute("data-variant", "label");
  });
});

describe("FieldGroup", () => {
  it("renders children", () => {
    render(
      <FieldGroup>
        <span>grupo</span>
      </FieldGroup>,
    );

    expect(screen.getByText("grupo")).toBeInTheDocument();
  });
});

describe("Field", () => {
  it("defaults to vertical orientation", () => {
    render(<Field>conteúdo</Field>);

    expect(screen.getByRole("group")).toHaveAttribute(
      "data-orientation",
      "vertical",
    );
  });

  it("accepts horizontal orientation", () => {
    render(<Field orientation="horizontal">conteúdo</Field>);

    expect(screen.getByRole("group")).toHaveAttribute(
      "data-orientation",
      "horizontal",
    );
  });
});

describe("FieldContent", () => {
  it("renders children", () => {
    render(
      <FieldContent>
        <span>conteúdo</span>
      </FieldContent>,
    );

    expect(screen.getByText("conteúdo")).toBeInTheDocument();
  });
});

describe("FieldLabel", () => {
  it("renders as a label linked to htmlFor", () => {
    render(<FieldLabel htmlFor="campo">Nome</FieldLabel>);

    expect(screen.getByText("Nome")).toHaveAttribute("for", "campo");
  });
});

describe("FieldTitle", () => {
  it("renders children", () => {
    render(<FieldTitle>Título</FieldTitle>);

    expect(screen.getByText("Título")).toBeInTheDocument();
  });
});

describe("FieldDescription", () => {
  it("renders children", () => {
    render(<FieldDescription>Descrição</FieldDescription>);

    expect(screen.getByText("Descrição")).toBeInTheDocument();
  });
});

describe("FieldSeparator", () => {
  it("marks data-content as false when there are no children", () => {
    const { container } = render(<FieldSeparator />);

    expect(container.firstChild).toHaveAttribute("data-content", "false");
  });

  it("marks data-content as true and renders children", () => {
    render(<FieldSeparator>ou</FieldSeparator>);

    expect(screen.getByText("ou")).toBeInTheDocument();
  });
});

describe("FieldError", () => {
  it("renders nothing when there are no errors or children", () => {
    const { container } = render(<FieldError />);

    expect(container).toBeEmptyDOMElement();
  });

  it("renders children when provided, ignoring errors", () => {
    render(
      <FieldError errors={[{ message: "Erro do schema" }]}>
        Mensagem customizada
      </FieldError>,
    );

    expect(screen.getByText("Mensagem customizada")).toBeInTheDocument();
    expect(screen.queryByText("Erro do schema")).not.toBeInTheDocument();
  });

  it("renders a single message when there is only one unique error", () => {
    render(<FieldError errors={[{ message: "Nome é obrigatório." }]} />);

    expect(screen.getByRole("alert")).toHaveTextContent("Nome é obrigatório.");
  });

  it("renders a list when there are multiple unique errors", () => {
    render(
      <FieldError
        errors={[
          { message: "Nome é obrigatório." },
          { message: "Nome deve ter ao menos 3 letras." },
        ]}
      />,
    );

    expect(screen.getByText("Nome é obrigatório.")).toBeInTheDocument();
    expect(
      screen.getByText("Nome deve ter ao menos 3 letras."),
    ).toBeInTheDocument();
  });

  it("deduplicates errors with the same message", () => {
    render(
      <FieldError
        errors={[
          { message: "Nome é obrigatório." },
          { message: "Nome é obrigatório." },
        ]}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Nome é obrigatório.");
    expect(screen.getAllByText("Nome é obrigatório.")).toHaveLength(1);
  });

  it("ignores errors without a message", () => {
    const { container } = render(<FieldError errors={[undefined, {}]} />);

    expect(container).toBeEmptyDOMElement();
  });
});
