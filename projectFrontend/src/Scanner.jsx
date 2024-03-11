import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";

const Scanner = ({ showScannerDiv }) => {
  const [inputData, setInputData] = useState("");
  const navigate = useNavigate();

  const closePopUp = () => {
    showScannerDiv();
    setInputData("");
  };
  const doneId = (e) => {
    e.preventDefault();
    if (inputData.length !== 0 && inputData.length <= 6) {
      showScannerDiv();
      navigate(`/camera/${inputData}`);
    } else {
      alert("Ensure that the ID is less than 6 characters");
    }
  };

  return (
    <div className="scannerContainer">
      <h1>Enter your Customer ID</h1>
      <form onSubmit={doneId} className="idForm">
        <input
          className="inputId"
          type="text"
          value={inputData}
          onChange={(e) => {
            setInputData(e.target.value);
          }}
          required
          placeholder="Enter your customer ID"
          aria-label="Enter your customer ID"
          style={{ margin: 30, width: "50%", padding: 20 }}
        />

        <div className="transactionBtn">
          <button className="btn" onClick={closePopUp}>
            Close
          </button>
          <button type="submit" className="cartBtn doneBtn">
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Scanner;
