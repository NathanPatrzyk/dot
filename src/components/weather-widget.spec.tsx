import { render, screen } from "@testing-library/react";
import WeatherWidget from "./weather-widget";

describe("WeatherWidget", () => {
  it("renders the temperature rounded and the city", () => {
    render(
      <WeatherWidget
        data={{ temperature: 25.7, code: 800, city: "São Paulo" }}
      />,
    );

    expect(screen.getByText("26°C")).toBeInTheDocument();
    expect(screen.getByText("São Paulo")).toBeInTheDocument();
  });

  it.each([
    [800, "lucide-sun"],
    [801, "lucide-cloud-sun"],
    [803, "lucide-cloud"],
    [200, "lucide-cloud-lightning"],
    [300, "lucide-cloud-drizzle"],
    [500, "lucide-cloud-rain"],
    [600, "lucide-cloud-snow"],
    [700, "lucide-cloud-fog"],
    [999, "lucide-cloud"],
  ])("renders the correct icon for code %i", (code, expectedClass) => {
    const { container } = render(
      <WeatherWidget data={{ temperature: 20, code, city: "Teste" }} />,
    );

    expect(container.querySelector("svg")).toHaveClass(expectedClass);
  });
});
