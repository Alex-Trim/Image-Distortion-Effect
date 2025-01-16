import React, { useContext, useRef, useLayoutEffect } from "react";
import { CurtainsContext } from "../store/reduxStore";
import "./style.scss";

const Canvas = () => {
  const { state, dispatch } = useContext(CurtainsContext);
  const container = useRef();

  const someRef = useRef({ scrollEffect: 0 });

  useLayoutEffect(() => {
    const { curtains } = state;
    if (container.current && !state.curtains.container) {
      curtains.setContainer(container.current);

      curtains
        .onContextLost(() => {
          curtains.restoreContext();
        })
        .onRender(() => {
          const newScrollEffect = curtains.lerp(
            someRef.current.scrollEffect,
            0,
            0.075
          );
          someRef.current.scrollEffect = newScrollEffect;

          dispatch({
            type: "SET_SCROLL_EFFECT",
            payload: newScrollEffect,
          });
        })
        .onScroll(() => {
          const delta = curtains.getScrollDeltas();

          delta.y = -delta.y;

          if (delta.y > 60) {
            delta.y = 60;
          } else if (delta.y < -60) {
            delta.y = -60;
          }

          const lerp = (start, end, t) => start * (1 - t) + end * t;
          const newScrollEffect = lerp(
            someRef.current.scrollEffect,
            delta.y * 1.5,
            0.5
          );

          someRef.current.scrollEffect = newScrollEffect;
          dispatch({
            type: "SET_SCROLL_EFFECT",
            payload: newScrollEffect,
          });
        });

      dispatch({
        type: "SET_CURTAINS_CONTAINER",
        payload: curtains.container,
      });

      return () => {
        curtains.dispose();
      };
    }
  }, [container, state, dispatch]);

  return <div className="Canvas" ref={container} />;
};

export default Canvas;
