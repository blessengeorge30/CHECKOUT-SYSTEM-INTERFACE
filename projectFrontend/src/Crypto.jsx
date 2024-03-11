import React from "react";
import QRCode from "qrcode.react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faCheckDouble,
} from "@fortawesome/free-solid-svg-icons";

const Crypto = ({ toggleCryptoModal, toggleModal }) => {
  return (
    <div className="qrCodeModal">
      <div className="checkoutInfo">
        <h3> Scan the QR Code and Pay </h3>
        <h5 className="smallInfo"> Use Binance Pay </h5>
      </div>
      <div className="qr cryptoQr">
        <QRCode
          className="qrCode"
          value={
            "https://app.binance.com/qr/dplkdee5fd5f546f4abda4b55fd37b61d128"
          }
          size={200} // Set the size of the QR code
          fgColor="white" // Set the color of the QR code
          bgColor="transparent"
        />
      </div>
      <div className="price">
        <b style={{ fontSize: 10, color: "white" }}>&#8377; </b>
      </div>
      <div className="closeCheckoutBtnAndCryptoBtn">
        <button className="cryptoBtn" onClick={toggleCryptoModal}>
          <b>Pay with Google Pay instead</b>
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
    </div>
  );
};

export default Crypto;
