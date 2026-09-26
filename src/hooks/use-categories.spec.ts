import { act, renderHook, waitFor } from "@testing-library/react";

vi.mock("@/actions/categories", () => ({
  createCategory: vi.fn(),
}));
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(() => "toast-id"),
  },
}));

import { createCategory } from "@/actions/categories";
import { useCategories } from "@/hooks/use-categories";
import { DEFAULT_CATEGORY } from "@/lib/default-category";
import { toast } from "sonner";

describe("useCategories", () => {
  beforeEach(() => {
    vi.mocked(createCategory).mockResolvedValue({
      success: true,
      message: "Categoria criada com sucesso.",
    });
  });

  it("should prepend the default category to the list", () => {
    const { result } = renderHook(() =>
      useCategories([{ id: 1, name: "Casa" }]),
    );

    expect(result.current.allCategories).toEqual([
      DEFAULT_CATEGORY,
      { id: 1, name: "Casa" },
    ]);
  });

  it("should not create a category when the name is blank", () => {
    const { result } = renderHook(() => useCategories([]));
    const formData = new FormData();
    formData.set("name", "   ");

    act(() => {
      result.current.handleCreate(formData);
    });

    expect(createCategory).not.toHaveBeenCalled();
  });

  it("should not create a category when the name is missing", () => {
    const { result } = renderHook(() => useCategories([]));

    act(() => {
      result.current.handleCreate(new FormData());
    });

    expect(createCategory).not.toHaveBeenCalled();
  });

  it("should create the category with the form data and no toast on success", async () => {
    const { result } = renderHook(() => useCategories([]));
    const formData = new FormData();
    formData.set("name", "Casa");

    await act(async () => {
      result.current.handleCreate(formData);
    });

    expect(createCategory).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: "" }),
      formData,
    );
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("should toast the error message when the creation fails", async () => {
    vi.mocked(createCategory).mockResolvedValue({
      success: false,
      message: "Já existe uma categoria com esse nome.",
    });
    const { result } = renderHook(() => useCategories([]));
    const formData = new FormData();
    formData.set("name", "Casa");

    await act(async () => {
      result.current.handleCreate(formData);
    });

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "Já existe uma categoria com esse nome.",
      ),
    );
  });
});
