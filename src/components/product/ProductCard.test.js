import React from "react";
import { render, fireEvent } from "@testing-library/react";
import ProductCard from "./ProductCard";

const mockProduct = {
  id: 1,
  sku: "chair1",
  description: { name: "Test Chair" },
  image: { imageUrl: "http://example.com/chair.jpg" },
  originalPrice: "$100.00",
  finalPrice: "$80.00",
};

describe("ProductCard", () => {
  it("renders product name", () => {
    const { getByText } = render(
      <ProductCard product={mockProduct} onRemove={jest.fn()} onAddToCart={jest.fn()} />
    );
    expect(getByText(mockProduct.description.name)).toBeInTheDocument();
  });

  it("renders discounted price", () => {
    const { getByText } = render(
      <ProductCard product={mockProduct} onRemove={jest.fn()} onAddToCart={jest.fn()} />
    );
    expect(getByText(mockProduct.finalPrice)).toBeInTheDocument();
    expect(getByText(mockProduct.originalPrice)).toBeInTheDocument();
  });

  it("renders single price when no discount", () => {
    const product = { ...mockProduct, finalPrice: mockProduct.originalPrice };
    const { getAllByText } = render(
      <ProductCard product={product} onRemove={jest.fn()} onAddToCart={jest.fn()} />
    );
    expect(getAllByText(mockProduct.originalPrice).length).toBeGreaterThan(0);
  });

  it("calls onRemove when remove button clicked", () => {
    const onRemove = jest.fn();
    const { getByTitle } = render(
      <ProductCard product={mockProduct} onRemove={onRemove} onAddToCart={jest.fn()} />
    );
    fireEvent.click(getByTitle("Remove from wishlist"));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("calls onAddToCart when add to cart button clicked", () => {
    const onAddToCart = jest.fn();
    const { getByTitle } = render(
      <ProductCard product={mockProduct} onRemove={jest.fn()} onAddToCart={onAddToCart} />
    );
    fireEvent.click(getByTitle("Add to Cart"));
    expect(onAddToCart).toHaveBeenCalledTimes(1);
  });

  it("renders empty image when no image provided", () => {
    const product = { ...mockProduct, image: null };
    const { container } = render(
      <ProductCard product={product} onRemove={jest.fn()} onAddToCart={jest.fn()} />
    );
    const img = container.querySelector("img");
    expect(img).toHaveAttribute("src", "");
  });
});
