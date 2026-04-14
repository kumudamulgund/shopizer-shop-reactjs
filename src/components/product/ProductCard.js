import React, { Fragment } from "react";

const ProductCard = ({ product, onRemove, onAddToCart }) => {
  return (
    <div className="col-xl-3 col-md-6 col-lg-4 col-sm-6">
      <div className="product-wrap-2 mb-25">
        <div className="product-img">
          {product.image && product.image.imageUrl ? (
            <img src={product.image.imageUrl} alt={product.description ? product.description.name : ""} />
          ) : (
            <img src="" alt="" />
          )}
        </div>
        <div className="product-content-2">
          <div className="title-price-wrap-2">
            <h3>{product.description ? product.description.name : ""}</h3>
            <div className="price-2">
              {product.originalPrice && product.originalPrice !== product.finalPrice ? (
                <Fragment>
                  <span>{product.finalPrice}</span>{" "}
                  <span className="old">{product.originalPrice}</span>
                </Fragment>
              ) : (
                <span>{product.originalPrice || product.finalPrice}</span>
              )}
            </div>
          </div>
          <div className="pro-wishlist-2">
            <button onClick={onAddToCart} title="Add to Cart"
              style={{ backgroundColor: "var(--theme-color)", color: "#fff", borderRadius: "50%", width: 32, height: 32, border: "none", fontSize: 14 }}>
              <i className="fa fa-shopping-cart" />
            </button>
            <button onClick={onRemove} title="Remove from wishlist">
              <i className="fa fa-trash" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
