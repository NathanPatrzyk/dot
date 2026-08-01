jest.mock("./auth", () => ({
  auth: {
    api: {
      getSession: jest.fn(),
    },
  },
}));

jest.mock("next/headers", () => ({
  headers: jest.fn(),
}));

describe("getSession", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it("returns the session using the request headers", async () => {
    const fakeHeaders = new Headers({ cookie: "session=abc" });

    const { headers } = await import("next/headers");
    const mockHeaders = headers as jest.Mock;
    mockHeaders.mockResolvedValue(fakeHeaders);

    const { auth } = await import("./auth");
    const mockGetSession = auth.api.getSession as unknown as jest.Mock;
    mockGetSession.mockResolvedValue({
      user: { id: "1", name: "Nathan" },
    });

    const { getSession } = await import("./get-session");
    const result = await getSession();

    expect(mockGetSession).toHaveBeenCalledWith({ headers: fakeHeaders });
    expect(result).toEqual({ user: { id: "1", name: "Nathan" } });
  });

  it("returns null when there is no session", async () => {
    const { headers } = await import("next/headers");
    const mockHeaders = headers as jest.Mock;
    mockHeaders.mockResolvedValue(new Headers());

    const { auth } = await import("./auth");
    const mockGetSession = auth.api.getSession as unknown as jest.Mock;
    mockGetSession.mockResolvedValue(null);

    const { getSession } = await import("./get-session");
    const result = await getSession();

    expect(result).toBeNull();
  });
});
