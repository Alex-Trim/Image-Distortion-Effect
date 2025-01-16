import React from "react";
import CurtainSlider from "./1.curtain-slider/CurtainSlider";
import useLocoScroll from "./hooks/useLocoScroll";
function App() {
  useLocoScroll(true);
  return (
    <>
      <main data-scroll-container id="main-container">
        <CurtainSlider />
      </main>
    </>
  );
}

export default App;
