import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const embla = vi.hoisted(() => {
  const state = { failNextApi: false };
  const api = {
    canScrollPrev: vi.fn(() => false),
    canScrollNext: vi.fn(() => true),
    scrollPrev: vi.fn(),
    scrollNext: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  };
  return { state, api };
});

vi.mock("embla-carousel-react", () => ({
  default: () => [vi.fn(), embla.state.failNextApi ? undefined : embla.api],
}));

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
} from "./carousel";

describe("Carousel", () => {
  it("should render the region and its children", () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>slide 1</CarouselItem>
        </CarouselContent>
      </Carousel>,
    );

    expect(screen.getByRole("region")).toHaveAttribute(
      "aria-roledescription",
      "carousel",
    );
    expect(screen.getByText("slide 1")).toBeInTheDocument();
    expect(
      document.querySelector('[data-slot="carousel-content"]'),
    ).not.toBeNull();
    expect(
      document.querySelector('[data-slot="carousel-item"]'),
    ).not.toBeNull();
  });

  it("should disable the previous button and enable the next by default", () => {
    render(
      <Carousel>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>,
    );

    expect(
      screen.getByRole("button", { name: "Previous slide" }),
    ).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next slide" })).toBeEnabled();
  });

  it("should navigate on click and with arrow keys", async () => {
    const user = userEvent.setup();
    render(
      <Carousel>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>,
    );

    await user.click(screen.getByRole("button", { name: "Next slide" }));
    expect(embla.api.scrollNext).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(screen.getByRole("region"), { key: "ArrowLeft" });
    expect(embla.api.scrollPrev).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(screen.getByRole("region"), { key: "ArrowRight" });
    expect(embla.api.scrollNext).toHaveBeenCalledTimes(2);
  });

  it("should ignore other keys on key down", () => {
    render(<Carousel />);

    fireEvent.keyDown(screen.getByRole("region"), { key: "Enter" });

    expect(embla.api.scrollPrev).not.toHaveBeenCalled();
    expect(embla.api.scrollNext).not.toHaveBeenCalled();
  });

  it("should update the button states on select events", () => {
    render(
      <Carousel>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>,
    );

    const selectHandler = embla.api.on.mock.calls.find(
      ([event]) => event === "select",
    )![1];

    act(() => {
      embla.api.canScrollNext.mockReturnValue(false);
      selectHandler(embla.api);
    });

    expect(screen.getByRole("button", { name: "Next slide" })).toBeDisabled();
  });

  it("should bail out when the select handler receives no api", () => {
    render(<Carousel />);

    const selectHandler = embla.api.on.mock.calls.find(
      ([event]) => event === "select",
    )![1];
    const before = embla.api.canScrollPrev.mock.calls.length;

    act(() => selectHandler(undefined));

    expect(embla.api.canScrollPrev.mock.calls.length).toBe(before);
  });

  it("should tolerate a missing embla api", () => {
    embla.state.failNextApi = true;

    expect(() => render(<Carousel />)).not.toThrow();

    embla.state.failNextApi = false;
  });

  it("should detach the select listener on unmount", () => {
    const { unmount } = render(<Carousel />);

    const selectHandler = embla.api.on.mock.calls.find(
      ([event]) => event === "select",
    )![1];

    act(() => unmount());

    expect(embla.api.off).toHaveBeenCalledWith("select", selectHandler);
  });

  it("should apply the vertical classes", () => {
    render(
      <Carousel orientation="vertical">
        <CarouselContent />
        <CarouselItem>slide</CarouselItem>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>,
    );

    const content = document.querySelector('[data-slot="carousel-content"]')!;
    expect(content.firstElementChild!.className).toContain("-mt-4");

    const item = document.querySelector('[data-slot="carousel-item"]')!;
    expect(item.className).toContain("pt-4");

    expect(
      screen.getByRole("button", { name: "Previous slide" }).className,
    ).toContain("-top-12");
    expect(
      screen.getByRole("button", { name: "Next slide" }).className,
    ).toContain("-bottom-12");
  });

  it("should derive the orientation from the axis when orientation is falsy", () => {
    render(
      <Carousel opts={{ axis: "y" }} orientation={null as never}>
        <CarouselContent>
          <CarouselItem>v-slide</CarouselItem>
        </CarouselContent>
      </Carousel>,
    );

    const content = document.querySelector('[data-slot="carousel-content"]')!;
    expect(content.firstElementChild!.className).toContain("-mt-4");
  });

  it("should fall back to horizontal when the axis is horizontal", () => {
    render(
      <Carousel opts={{ axis: "x" }} orientation={null as never}>
        <CarouselContent>
          <CarouselItem>h-slide</CarouselItem>
        </CarouselContent>
      </Carousel>,
    );

    const content = document.querySelector('[data-slot="carousel-content"]')!;
    expect(content.firstElementChild!.className).toContain("-ml-4");
  });

  it("should call setApi with the embla api", () => {
    const setApi = vi.fn();
    render(<Carousel setApi={setApi} />);

    expect(setApi).toHaveBeenCalledWith(embla.api);
  });

  it("should throw when used outside a Carousel", () => {
    function Broken() {
      useCarousel();
      return null;
    }

    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Broken />)).toThrow(
      "useCarousel must be used within a <Carousel />",
    );
    spy.mockRestore();
  });
});
