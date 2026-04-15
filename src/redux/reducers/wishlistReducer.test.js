import wishlistReducer from "./wishlistReducer";
import { GET_WISHLIST, REMOVE_FROM_WISHLIST } from "../actions/wishlistActions";

describe("wishlistReducer", () => {
  const initState = { items: [], count: 0 };

  it("returns initial state", () => {
    expect(wishlistReducer(undefined, {})).toEqual(initState);
  });

  it("handles GET_WISHLIST with items", () => {
    const items = [
      { id: 1, sku: "chair1" },
      { id: 2, sku: "table1" },
    ];
    const result = wishlistReducer(initState, {
      type: GET_WISHLIST,
      payload: { items },
    });
    expect(result.items).toEqual(items);
    expect(result.count).toBe(2);
  });

  it("handles GET_WISHLIST with empty payload", () => {
    const result = wishlistReducer(initState, {
      type: GET_WISHLIST,
      payload: {},
    });
    expect(result.items).toEqual([]);
    expect(result.count).toBe(0);
  });

  it("handles REMOVE_FROM_WISHLIST", () => {
    const state = {
      items: [
        { id: 1, sku: "chair1" },
        { id: 2, sku: "table1" },
      ],
      count: 2,
    };
    const result = wishlistReducer(state, {
      type: REMOVE_FROM_WISHLIST,
      payload: 1,
    });
    expect(result.items).toEqual([{ id: 2, sku: "table1" }]);
    expect(result.count).toBe(1);
  });

  it("handles REMOVE_FROM_WISHLIST for non-existent item", () => {
    const state = {
      items: [{ id: 1, sku: "chair1" }],
      count: 1,
    };
    const result = wishlistReducer(state, {
      type: REMOVE_FROM_WISHLIST,
      payload: 999,
    });
    expect(result.items).toEqual([{ id: 1, sku: "chair1" }]);
    expect(result.count).toBe(1);
  });

  it("returns current state for unknown action", () => {
    const state = { items: [{ id: 1 }], count: 1 };
    expect(wishlistReducer(state, { type: "UNKNOWN" })).toEqual(state);
  });
});
