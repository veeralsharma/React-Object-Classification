import React, { useEffect, Fragment, useState } from "react";
import "./App.css";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";

function App() {
  const [status, setStatus] = useState("Predictions: ");

  function startVideo(video, context, model, canvas) {
    navigator.getUserMedia(
      { video: {} },
      (stream) => (video.srcObject = stream),
      (err) => console.log(err)
    );
    predict(video, context, model, canvas);
  }

  async function predict(video, context, model, canvas) {
    context.drawImage(video, 0, 0, 720, 560);
    const predictions = await model.classify(canvas);
    await setStatus(
      `${status}${predictions[0].className}/${predictions[0].probability}`
    );
    setTimeout(predict(video, context, model, canvas), 17);
  }

  useEffect(() => {
    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    var model;
    async function load() {
      model = await mobilenet.load();
    }
    async function begin() {
      await load();
      startVideo(video, context, model, canvas);
    }

    begin();
  }, []);

  return (
    <Fragment>
      <video id="video" autoplay="true" muted="true" playsInline="true"></video>
      <canvas id="canvas" width="720" height="560" style={{display:"none"}}></canvas>
      <div><h3 style={{color:"white"}}>{status}</h3></div>
    </Fragment>
  );
}

export default App;
