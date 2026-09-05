import { render, screen, waitFor } from "@testing-library/react";
import WeatherWidget from "./weather-widget";

function mockGeolocationSuccess() {
  Object.defineProperty(navigator, "geolocation", {
    configurable: true,
    value: {
      getCurrentPosition: (success: PositionCallback) => {
        success({
          coords: { latitude: -23.55, longitude: -46.63 },
        } as GeolocationPosition);
      },
    },
  });
}

function mockFetchResponse(data: {
  main: { temp: number };
  weather: [{ id: number }];
  name: string;
}) {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => data,
  });
}

describe("WeatherWidget", () => {
  afterEach(() => {
    delete (navigator as { geolocation?: unknown }).geolocation;
  });

  it("renders nothing before the weather loads", () => {
    mockGeolocationSuccess();
    global.fetch = jest.fn(() => new Promise(() => {}));

    const { container } = render(<WeatherWidget />);

    expect(container).toBeEmptyDOMElement();
  });

  it("renders the temperature rounded, label and city", async () => {
    mockGeolocationSuccess();
    mockFetchResponse({
      main: { temp: 25.7 },
      weather: [{ id: 800 }],
      name: "São Paulo",
    });

    render(<WeatherWidget />);

    await waitFor(() => {
      expect(screen.getByText("26°")).toBeInTheDocument();
    });
    expect(screen.getByText("Céu limpo")).toBeInTheDocument();
    expect(screen.getByText("São Paulo")).toBeInTheDocument();
  });

  it("renders nothing when the fetch fails", async () => {
    mockGeolocationSuccess();
    global.fetch = jest.fn().mockResolvedValue({ ok: false });

    const { container } = render(<WeatherWidget />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
    expect(container).toBeEmptyDOMElement();
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
  ])("renders the correct icon for code %i", async (code, expectedClass) => {
    mockGeolocationSuccess();
    mockFetchResponse({
      main: { temp: 20 },
      weather: [{ id: code }],
      name: "Teste",
    });

    const { container } = render(<WeatherWidget />);

    await waitFor(() => {
      expect(container.querySelector("svg")).toBeInTheDocument();
    });
    expect(container.querySelector("svg")).toHaveClass(expectedClass);
  });
});
