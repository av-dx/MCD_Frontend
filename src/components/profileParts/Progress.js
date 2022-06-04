import React from "react";

import { easeQuadOut } from "d3-ease";
import VisibilitySensor from "react-visibility-sensor";
import AnimatedProgressProvider from "./AnimatedProgressProvider.js";
import {
  CircularProgressbar,
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";

import "../css/components.css";
import "react-circular-progressbar/dist/styles.css";
// import { indicatorsContainerCSS } from "react-select/src/components/containers";

const Progress = ({ progressCard }) => {
  if (Object.keys(progressCard).length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "2.5em" }}>
        <span className="spChar">Busy Making Progress...</span>
      </div>
    );
  }
  return (
    // <div className='d-flex align-content-start flex-wrap enableScroll'>
    <div className="allProgress enableScroll">
      {Object.keys(progressCard).map((taskname) => (
        <div className="oneBar" key={taskname}>
          <VisibilitySensor>
            {({ isVisible }) => {
              const total = isVisible ? progressCard[taskname] : 0;
              return (
                <AnimatedProgressProvider
                  valueStart={0}
                  valueEnd={total}
                  duration={1}
                  easingFunction={easeQuadOut}
                >
                  {(value) => {
                    const roundedValue = value.toFixed(1);
                    return (
                      <CircularProgressbarWithChildren
                        value={value}
                        circleRatio={0.75}
                        styles={buildStyles({
                          rotation: 1 / 2 + 1 / 8,
                          strokeLinecap: "butt",
                          textColor: "rgb(0,123,255)",
                          pathColor: "rgb(0,123,255)",
                          pathTransition: "none",
                        })}
                      >
                        <div className="innerChild">
                          <span className="spChar">{roundedValue}%</span>
						  <span style={{ fontSize: "130%" }}>
                            <span className="spChar">{taskname.charAt(0)}</span>
                            {taskname.slice(1)}
                          </span>
                        </div>
                      </CircularProgressbarWithChildren>
                    );
                  }}
                </AnimatedProgressProvider>
              );
            }}
          </VisibilitySensor>
        </div>
      ))}
    </div>
  );
};

export default Progress;
