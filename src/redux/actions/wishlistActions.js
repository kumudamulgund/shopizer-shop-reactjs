import WebService from '../../util/webService';
import constant from '../../util/constant';
import { setLoader } from './loaderActions';

export const GET_WISHLIST = "GET_WISHLIST";
export const REMOVE_FROM_WISHLIST = "REMOVE_FROM_WISHLIST";

export const getWishlist = () => {
  return async dispatch => {
    try {
      let action = constant.ACTION.AUTH + constant.ACTION.CUSTOMER + constant.ACTION.WISHLIST;
      let response = await WebService.get(action);
      dispatch({ type: GET_WISHLIST, payload: response });
    } catch (error) {
      console.log('Error fetching wishlist', error);
    }
  };
};

export const addToWishlist = (productId, addToast) => {
  return async dispatch => {
    dispatch(setLoader(true));
    try {
      let action = constant.ACTION.AUTH + constant.ACTION.CUSTOMER + constant.ACTION.WISHLIST;
      await WebService.post(action, { productId });
      dispatch(getWishlist());
      dispatch(setLoader(false));
      if (addToast) {
        addToast("Added to Wishlist", { appearance: "success", autoDismiss: true });
      }
    } catch (error) {
      dispatch(setLoader(false));
      console.log('Error adding to wishlist', error);
    }
  };
};

export const removeFromWishlist = (productId, addToast) => {
  return async dispatch => {
    dispatch(setLoader(true));
    try {
      let action = constant.ACTION.AUTH + constant.ACTION.CUSTOMER + constant.ACTION.WISHLIST + '/' + productId;
      await WebService.delete(action);
      dispatch({ type: REMOVE_FROM_WISHLIST, payload: productId });
      dispatch(setLoader(false));
      if (addToast) {
        addToast("Removed from Wishlist", { appearance: "success", autoDismiss: true });
      }
    } catch (error) {
      dispatch(setLoader(false));
      console.log('Error removing from wishlist', error);
    }
  };
};
