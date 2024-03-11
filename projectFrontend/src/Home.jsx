import React, { useCallback, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Scanner from "./Scanner";

const Home = () => {
  const [showDiv, setShowDiv] = useState(false);

  const showScannerDiv = () => {
    setShowDiv(!showDiv);
  };

  return (
    <div className="container">
      <div className="home">
        <span style={{ display: "flex", width: "100%" }}>
          <h1 style={{ fontSize: 120 }}>Hello!</h1>
          <h1 className="blinking-underscore">_</h1>
        </span>
        <div className="content">
          <h3 style={{ color: "gray", marginTop: 10 }}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab aliquam
            odio incidunt quisquam totam harum deserunt maxime sit vitae tempora
            iusto veritatis similique, quas dolorum! Beatae deleniti nemo
            temporibus voluptatem!
          </h3>
        </div>
        <div className="startBtnContainer">
          <div className="link">
            <button className="startBtn" onClick={showScannerDiv}>
              <p style={{ fontSize: 20 }}>Start Scanning</p>
              <FontAwesomeIcon
                style={{ fontSize: 20 }}
                icon={faArrowRightLong}
              />
            </button>
          </div>
        </div>
      </div>

      <div className={`scanner ${showDiv ? "show" : ""}`}>
        <Scanner showScannerDiv={showScannerDiv} showDiv={showDiv} />
      </div>
    </div>
  );
};

export default Home;
