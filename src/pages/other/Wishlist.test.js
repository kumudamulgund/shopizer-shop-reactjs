import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { BrowserRouter } from "react-router-dom";
import { ToastProvider } from "react-toast-notifications";
import Wishlist from "./Wishlist";

// Mock Layout to avoid Header/Footer dependency chain
jest.mock("../../layouts/Layout", () => ({ children }) => <div>{children}</div>);

const mockItems = [
  { id: 1, sku: "chair1", description: { name: "Test Chair" }, image: { imageUrl: "" }, originalPrice: "$100", finalPrice: "$80" },
  { id: 2, sku: "table1", description: { name: "Test Table" }, image: { imageUrl: "" }, originalPrice: "$200", finalPrice: "$200" },
];

const mockState = {
  wishlistData: { items: [], count: 0 },
  userData: { userData: null },
  cartData: { cartItems: {}, cartID: null },
  merchantData: { defaultStore: "DEFAULT", merchant: {} },
};

const renderWithProviders = (state = mockState) => {
  const store = createStore(() => state);
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <ToastProvider>
          <Wishlist location={{ pathname: "/wishlist" }} />
        </ToastProvider>
      </BrowserRouter>
    </Provider>
  );
};

const stateWithItems = {
  ...mockState,
  wishlistData: { items: mockItems, count: mockItems.length },
};

describe("Wishlist Page", () => {
  it("renders page title", () => {
    const { getByText } = renderWithProviders();
    expect(getByText("Your Wishlist")).toBeInTheDocument();
  });

  describe("when empty", () => {
    it("renders empty wishlist message", () => {
      const { getByText } = renderWithProviders();
      expect(getByText("Your wishlist is empty.")).toBeInTheDocument();
    });

    it("renders continue shopping link", () => {
      const { getByText } = renderWithProviders();
      const link = getByText("Continue Shopping");
      expect(link).toBeInTheDocument();
      expect(link.getAttribute("href")).toBe("/");
    });

    it("does not render any product cards", () => {
      const { queryByTitle } = renderWithProviders();
      expect(queryByTitle("Remove from wishlist")).toBeNull();
    });
  });

  describe("when items present", () => {
    it("renders all product names", () => {
      const { getByText } = renderWithProviders(stateWithItems);
      mockItems.forEach(item => {
        expect(getByText(item.description.name)).toBeInTheDocument();
      });
    });

    it("renders correct number of product cards", () => {
      const { getAllByTitle } = renderWithProviders(stateWithItems);
      expect(getAllByTitle("Remove from wishlist")).toHaveLength(mockItems.length);
    });

    it("renders add to cart button for each item", () => {
      const { getAllByTitle } = renderWithProviders(stateWithItems);
      expect(getAllByTitle("Add to Cart")).toHaveLength(mockItems.length);
    });

    it("does not render empty wishlist message", () => {
      const { queryByText } = renderWithProviders(stateWithItems);
      expect(queryByText("Your wishlist is empty.")).toBeNull();
    });
  });
});
