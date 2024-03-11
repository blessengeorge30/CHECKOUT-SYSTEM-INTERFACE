import React, { useState, useEffect } from "react"; // Importing useEffect
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import Checkout from "./Checkout";
import { useParams } from "react-router-dom";

const Cart = ({ cartArray, inputData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [totalPrice, setTotalPrice] = useState("0");

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const calculateTotalPrice = (array) => {
      const sum = array.reduce(
        (accumulator, currentValue) => accumulator + currentValue.price,
        0
      );
      const totalSum = parseFloat(sum.toFixed(2));
      setTotalPrice(totalSum);
      console.log("total price : " + totalPrice);
    };
    calculateTotalPrice(cartArray);
  }, [cartArray]);

  return (
    <div className="cart">
      <div className="cartId">
        <h1>Your Cart</h1>
        <p>ID:&nbsp;&nbsp;{inputData} </p>
      </div>
      <div className="items">
        {cartArray.length >= 1 ? (
          cartArray.map((object, index) => (
            <div className="obj" key={index}>
              <div className="objContent">
                <p>
                  Name: <b>{object.product}</b>
                </p>
                <p>Weight : {object.weight}g</p>
              </div>
              <div className="objPrice">
                <b>&#8377;{object.price}</b>
              </div>
            </div>
          ))
        ) : (
          <div className="obj">
            <p style={{ color: "darkgray" }}>No items in the cart</p>
          </div>
        )}
      </div>
      <div
        className="checkOutBtn"
        style={{ textAlign: "right", width: "100%" }}
      >
        <div className="objTotal">
          <p>Total Price:</p>
          <b>&#8377;{totalPrice}</b>
        </div>
        <button
          className="checkout-btn"
          onClick={toggleModal}
          style={{ width: "100%" }}
        >
          Checkout&nbsp;&nbsp;
          <FontAwesomeIcon
            icon={faAngleRight}
            style={{ position: "relative", top: 0.5 }}
          />
        </button>
      </div>
      <div className={`checkoutSection ${isOpen ? "visible" : "hidden"}`}>
        <Checkout toggleModal={toggleModal} totalPrice={totalPrice} />
      </div>
    </div>
  );
};

export default Cart;
