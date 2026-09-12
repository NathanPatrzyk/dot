import { GET } from "@/app/api/weather/route";

describe("GET /api/weather", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ main: { temp: 23.4 } }),
      } as unknown as Response),
    );
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("should return 404 when openweather is disabled", async () => {
    vi.stubEnv("OPENWEATHER_ENABLED", "false");

    const response = await GET(
      new Request("http://localhost/api/weather?lat=-23.5&lon=-46.6"),
    );

    expect(response.status).toBe(404);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("should proxy the openweather response when enabled", async () => {
    vi.stubEnv("OPENWEATHER_ENABLED", "true");
    vi.stubEnv(
      "OPENWEATHER_BASE_URL",
      "https://api.openweathermap.org/data/2.5/weather",
    );
    vi.stubEnv("OPENWEATHER_API_KEY", "secret-key");

    const response = await GET(
      new Request("http://localhost/api/weather?lat=-23.5&lon=-46.6"),
    );

    expect(response.status).toBe(200);
    await expect(response.text()).resolves.toBe(
      JSON.stringify({ main: { temp: 23.4 } }),
    );
    expect(fetch).toHaveBeenCalledWith(
      "https://api.openweathermap.org/data/2.5/weather?lat=-23.5&lon=-46.6&units=metric&appid=secret-key",
    );
  });

  it("should return the upstream status when the provider fails", async () => {
    vi.stubEnv("OPENWEATHER_ENABLED", "true");
    vi.stubEnv(
      "OPENWEATHER_BASE_URL",
      "https://api.openweathermap.org/data/2.5/weather",
    );
    vi.stubEnv("OPENWEATHER_API_KEY", "secret-key");
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 503,
    } as unknown as Response);

    const response = await GET(
      new Request("http://localhost/api/weather?lat=-23.5&lon=-46.6"),
    );

    expect(response.status).toBe(503);
    await expect(response.text()).resolves.toBe(
      JSON.stringify({ error: "Erro ao buscar dados do clima" }),
    );
  });
});
