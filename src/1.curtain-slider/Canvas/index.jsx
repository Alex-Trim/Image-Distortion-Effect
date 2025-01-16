import React, { useContext, useRef, useLayoutEffect } from "react";
import { CurtainsContext } from "../store/reduxStore";
import "./style.scss";

const Canvas = () => {
  const { state, dispatch } = useContext(CurtainsContext);
  const container = useRef();

  const someRef = useRef({ scrollEffect: 0 });

  useLayoutEffect(() => {
    const { curtains } = state;

    // Обработчик ошибок WebGL
    curtains.onError(() => {
      console.error("WebGL context lost or not supported.");
    });

    // Обработчик потери контекста WebGL
    curtains.onContextLost(() => {
      console.warn("WebGL context lost. Attempting to restore.");
      curtains.restoreContext();
    });

    // Инициализация контейнера Curtains.js
    if (container.current && !curtains.container) {
      curtains.setContainer(container.current);

      // Настройка событий Curtains.js
      curtains
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
          delta.y = Math.min(60, Math.max(-60, -delta.y)); // Ограничиваем delta

          const newScrollEffect = curtains.lerp(
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

      // Сохраняем контейнер в состоянии
      dispatch({
        type: "SET_CURTAINS_CONTAINER",
        payload: curtains.container,
      });

      // Удаляем Curtains.js при размонтировании компонента
      return () => {
        curtains.dispose();
      };
    }
  }, [container, state, dispatch]);

  // Анимация с использованием requestAnimationFrame
  useLayoutEffect(() => {
    function animate() {
      const newScrollEffect = state.curtains.lerp(
        someRef.current.scrollEffect,
        0,
        0.075
      );

      someRef.current.scrollEffect = newScrollEffect;

      dispatch({
        type: "SET_SCROLL_EFFECT",
        payload: newScrollEffect,
      });

      requestAnimationFrame(animate); // Рекурсивная анимация
    }

    if (state.curtains) {
      requestAnimationFrame(animate);
    }
  }, [state.curtains, dispatch]);

  return <div className="Canvas" ref={container} />;
};

export default Canvas;
