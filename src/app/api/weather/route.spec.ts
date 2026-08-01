/**
 * @jest-environment node
 */
import { GET } from "./route";

describe("GET /api/weather", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      OPENWEATHER_BASE_URL: "https://api.openweathermap.org/data/2.5/weather",
      OPENWEATHER_API_KEY: "fake-key",
    };
    global.fetch = jest.fn();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("fetches weather data and returns it with status 200", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        main: { temp: 25.5 },
        weather: [{ id: 800 }],
        name: "São Paulo",
      }),
    });

    const request = new Request(
      "http://localhost/api/weather?lat=-23.55&lon=-46.63",
    );
    const response = await GET(request);
    const body = await response.json();

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.openweathermap.org/data/2.5/weather?lat=-23.55&lon=-46.63&units=metric&appid=fake-key",
    );
    expect(response.status).toBe(200);
    expect(body).toEqual({
      main: { temp: 25.5 },
      weather: [{ id: 800 }],
      name: "São Paulo",
    });
  });

  it("returns an error with the upstream status when the fetch fails", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 502,
    });

    const request = new Request(
      "http://localhost/api/weather?lat=-23.55&lon=-46.63",
    );
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(502);
    expect(body).toEqual({ error: "Erro ao buscar dados do clima" });
  });

  it("builds the URL with null when lat/lon are missing", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    const request = new Request("http://localhost/api/weather");
    await GET(request);

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.openweathermap.org/data/2.5/weather?lat=null&lon=null&units=metric&appid=fake-key",
    );
  });
});
