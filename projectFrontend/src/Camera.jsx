import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import * as cocossd from "@tensorflow-models/coco-ssd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faExpand,
  faCircleInfo,
  faCircleArrowLeft,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useParams } from "react-router-dom";
import Cart from "./Cart";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

const Camera = ({ objects, setObjects }) => {
  const webcamRef = useRef(null);
  const [net, setNet] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isClassSame, setIsClassSame] = useState(false);
  const [productClass, setProductClass] = useState("");
  const [cartArray, setCartArray] = useState([]);
  const [weight, setWeight] = useState(null);
  const [isNewWeightReceived, setIsNewWeightReceived] = useState(false);
  const params = useParams();
  const inputData = params.id;

  const [data, setData] = useState([
    {
      id: 1,
      product: "person",
      price: 50,
    },
    {
      id: 2,
      product: "apple",
      price: 50,
    },
    {
      id: 3,
      product: "banana",
      price: 50,
    },
  ]);

  const runCoco = async () => {
    await tf.setBackend("webgl");
    const loadedNet = await cocossd.load();
    console.log("COCO-SSD model loaded.");
    setNet(loadedNet);
  };

  useEffect(() => {
    runCoco();
  }, []);

  useEffect(() => {
    const checkClassEquality = () => {
      if (objects.length > 0) {
        const firstClass = objects[0]?.class;
        setProductClass(firstClass);
        const isSame = objects.every((obj) => obj.class === firstClass);

        setIsClassSame(isSame);
      } else {
        console.log("Nothing is detected");
      }
    };

    checkClassEquality();
  }, [objects]);

  useEffect(() => {
    if (isClassSame && isNewWeightReceived) {
      addToCart(productClass);
    }
  }, [isClassSame, isNewWeightReceived, productClass]);

  useEffect(() => {
    socket.on("weightUpdate", (data) => {
      setWeight(data);
      setIsNewWeightReceived(true); // Set isNewWeightReceived to true when weight is received
    });
  }, [socket]);
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const addToCart = (productClass) => {
    const foundObject = data.find((obj) => obj.product === productClass);

    const objPrice = foundObject.price / 1000;
    const actualPrice = parseFloat((objPrice * weight).toFixed(2));
    console.log(actualPrice);

    if (foundObject) {
      // Only add to cart if new weight received
      setCartArray((prevArray) => [
        ...prevArray,
        {
          id: prevArray.length + 1,
          product: foundObject.product,
          weight: weight,
          price: actualPrice,
        },
      ]);
      console.log(cartArray);
      setWeight(null);
    } else {
      console.log(
        "Either detected object is not in the database or new weight is not received"
      );
    }
  };
  const detect = async () => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4 &&
      net
    ) {
      const video = webcamRef.current.video;
      const detectedObjects = await net.detect(video);
      setObjects(detectedObjects);
      if (isClassSame) {
        setIsNewWeightReceived(false);
        socket.emit("fetchWeight");
      }
    }
  };

  return (
    <div className="container">
      <div className="everyThing">
        <div className="cameraContainer">
          <Link className="backLink" to="/">
            <FontAwesomeIcon icon={faCircleArrowLeft} />
          </Link>
          <p className="info">
            <FontAwesomeIcon
              style={{ position: "relative", top: 0.5 }}
              icon={faCircleInfo}
            />
            &nbsp;&nbsp;Place your item on the Scale
          </p>
          <div className="webCam">
            <Webcam ref={webcamRef} muted={true} />
            <div
              className={`errorMsg ${!isClassSame ? "errVisible" : "hidden"} `}
            >
              {!isClassSame ? (
                <>
                  <FontAwesomeIcon icon={faTriangleExclamation} />
                  &nbsp;&nbsp;
                  <b>The system has detected more than one type of objects</b>
                </>
              ) : (
                ""
              )}
            </div>
            <div className="btnContainer">
              <div className="cartBtnContainer">
                <button className="cartBtn" onClick={toggleVisibility}>
                  <FontAwesomeIcon icon={faCartShopping} />
                </button>
              </div>
              <div className="scanBtnContainer">
                <button className="btn" onClick={detect}>
                  Scan&nbsp;&nbsp;
                  <FontAwesomeIcon
                    style={{ position: "relative", top: 0.5 }}
                    icon={faExpand}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={`cartSection ${isVisible ? "visible" : "hidden"}`}>
          <Cart cartArray={cartArray} inputData={inputData} />
        </div>
      </div>
    </div>
  );
};

export default Camera;
