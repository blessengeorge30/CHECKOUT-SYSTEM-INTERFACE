import React, { useState } from "react";
import QRCode from "qrcode.react";
import Crypto from "./Crypto";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faCheckDouble,
} from "@fortawesome/free-solid-svg-icons";

const Checkout = ({ toggleModal, totalPrice }) => {
  const [isCryptoQrOpen, setIsCryptoQrOpen] = useState(false);

  const toggleCryptoModal = () => {
    setIsCryptoQrOpen(!isCryptoQrOpen);
  };

  return (
    <div className="qrCodeModal">
      <div className="checkoutInfo">
        <h3> Scan the QR Code and Pay </h3>
        <h5 className="smallInfo"> Use Google Pay or PhonePe </h5>
      </div>

      <div className="qr">
        <QRCode
          className="qrCode"
          value={`upi://pay?pa=benonfire692@oksbi&pn=ben&am=${totalPrice}`}
          size={200} // Set the size of the QR code
          fgColor="black" // Set the color of the QR code
          bgColor="#fff"
        />
      </div>
      <div className="price">
        <b style={{ fontSize: 30 }}>&#8377; {totalPrice}</b>
      </div>
      <div className="closeCheckoutBtnAndCryptoBtn">
        <button className="cryptoBtn" onClick={toggleCryptoModal}>
          <b>Pay with Crypto instead</b>
        </button>
        <div className="transactionBtn">
          <button className="btn cancelBtn" onClick={toggleModal}>
            <p>Cancel&nbsp;&nbsp;</p>
            <FontAwesomeIcon icon={faCircleXmark} />
          </button>
          <button className="cartBtn doneBtn">
            <FontAwesomeIcon icon={faCheckDouble} />
          </button>
        </div>
      </div>
      <div className={`cryptoSection ${isCryptoQrOpen ? "visible" : "hidden"}`}>
        <Crypto
          toggleCryptoModal={toggleCryptoModal}
          toggleModal={toggleModal}
        />
      </div>
    </div>
  );
};

export default Checkout;
