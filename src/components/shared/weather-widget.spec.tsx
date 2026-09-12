import { render, screen, waitFor } from "@testing-library/react";
import WeatherWidget from "@/components/shared/weather-widget";

describe("WeatherWidget", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    Object.defineProperty(navigator, "geolocation", {
      value: { getCurrentPosition: vi.fn() },
      configurable: true,
    });
  });

  afterEach(() => vi.unstubAllGlobals());

  const mockPosition = (latitude: number, longitude: number) => {
    vi.mocked(navigator.geolocation.getCurrentPosition).mockImplementation(
      (onSuccess) =>
        onSuccess?.({
          coords: { latitude, longitude },
        } as never),
    );
  };

  const mockWeather = (weather: unknown, temp = 15) => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        name: "Curitiba",
        main: { temp },
        weather,
      }),
    } as never);
  };

  it("should render the weather returned by the api", async () => {
    mockPosition(-25.42, -49.27);
    mockWeather([{ id: 800 }], 22.4);

    render(<WeatherWidget />);

    expect(await screen.findByText("Céu limpo")).toBeInTheDocument();
    expect(screen.getByText("22°")).toBeInTheDocument();
    expect(screen.getByText("Curitiba")).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith("/api/weather?lat=-25.42&lon=-49.27");
  });

  it("should use the group fallback when the code is not mapped", async () => {
    mockPosition(0, 0);
    mockWeather([{ id: 501 }]);

    render(<WeatherWidget />);

    expect(await screen.findByText("Chuva")).toBeInTheDocument();
  });

  it("should show a fallback message when the code is unknown", async () => {
    mockPosition(0, 0);
    mockWeather([{ id: 999 }]);

    render(<WeatherWidget />);

    expect(await screen.findByText("Sem dados")).toBeInTheDocument();
  });

  it("should render nothing when the api fails", async () => {
    mockPosition(0, 0);
    vi.mocked(fetch).mockResolvedValue({ ok: false } as never);

    const { container } = render(<WeatherWidget />);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(container).toBeEmptyDOMElement();
  });
});
