import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { connect } from "react-redux";
import { getWishlist, removeFromWishlist } from "../../redux/actions/wishlistActions";
import { addToCart } from "../../redux/actions/cartActions";
import ProductCard from "../../components/product/ProductCard";
import Layout from "../../layouts/Layout";

const Wishlist = ({
  wishlistItems = [],
  userData,
  cartData,
  cartID,
  defaultStore,
  getWishlist,
  removeFromWishlist,
  addToCart
}) => {
  const { addToast } = useToasts();

  useEffect(() => {
    if (userData) {
      getWishlist();
    }
  }, [userData, getWishlist]);

  return (
    <Layout>
      <div className="cart-main-area pt-90 pb-100">
        <div className="container">
          <h3 className="cart-page-title">Your Wishlist</h3>
          {wishlistItems.length > 0 ? (
            <div className="row">
              {wishlistItems.map((item) => (
                <ProductCard
                  key={item.id}
                  product={item}
                  onRemove={() => removeFromWishlist(item.id, addToast)}
                  onAddToCart={() => {
                    addToCart({ sku: item.sku, id: item.id }, addToast, cartID, 1, defaultStore, userData);
                    removeFromWishlist(item.id);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center mt-5">
              <p>Your wishlist is empty.</p>
              <Link to="/" className="btn btn-primary mt-3">Continue Shopping</Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

const mapStateToProps = (state) => {
  return {
    wishlistItems: state.wishlistData ? state.wishlistData.items : [],
    userData: state.userData.userData,
    cartData: state.cartData.cartItems,
    cartID: state.cartData.cartID,
    defaultStore: state.merchantData.defaultStore
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getWishlist: () => dispatch(getWishlist()),
    removeFromWishlist: (productId, addToast) => dispatch(removeFromWishlist(productId, addToast)),
    addToCart: (item, addToast, cartData, qty, store, userData) => dispatch(addToCart(item, addToast, cartData, qty, store, userData))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Wishlist);
