import { GET_WISHLIST, REMOVE_FROM_WISHLIST } from "../actions/wishlistActions";

const initState = {
  items: [],
  count: 0
};

const wishlistReducer = (state = initState, action) => {
  if (action.type === GET_WISHLIST) {
    const items = action.payload.items || [];
    return {
      ...state,
      items,
      count: items.length
    };
  }

  if (action.type === REMOVE_FROM_WISHLIST) {
    const items = state.items.filter(item => item.id !== action.payload);
    return {
      ...state,
      items,
      count: items.length
    };
  }

  return state;
};

export default wishlistReducer;
