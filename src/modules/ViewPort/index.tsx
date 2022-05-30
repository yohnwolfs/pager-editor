import React, { useEffect, useRef } from 'react';
import config from '../../config';
import EditorCore from '../../core/EditorCore';
import baseStyle from '../../core/EditorCore/baseStyle';
import { usePos } from '../../hooks';
import Container from '../../state';
import gstyle from './index.module.less';

interface EditorViewPortProps {}

const { defaultViewPortHeight, defaultViewPortWidth } = config;

/**
 * 编辑器视窗
 * @param props
 * @returns
 */
export const EditorViewPort = (props: EditorViewPortProps) => {
  const shareState = Container.useContainer();
  const [pos, setPos] = usePos({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const boardStyle = {
    ...baseStyle,
    ...shareState.currentPageData?.style,
    width: shareState.currentPageData?.width || defaultViewPortWidth,
    minHeight: shareState.currentPageData?.height || defaultViewPortHeight,
    transform: `translateX(${pos.x}px) translateY(${pos.y}px) scale(${shareState.viewScale})`,
  };

  const handleContainerWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      if (e.deltaY > 0)
        shareState.setViewScale((v) => (v < 0 ? 0 : v - e.deltaY / 100));
      if (e.deltaY < 0)
        shareState.setViewScale((v) => (v > 3 ? v : v - e.deltaY / 100));
    } else {
      setPos(pos.x - e.deltaX, pos.y - e.deltaY);
    }
    e.stopPropagation();
  };
  const handleContainerClick = () => shareState.setSelectedItemId(undefined);

  /** 禁止ViewPort区域的wheel默认行为 */
  useEffect(() => {
    function onWheel(e: WheelEvent) {
      e.preventDefault();
    }
    containerRef.current?.addEventListener('wheel', onWheel, {
      passive: false,
    });
    return () => containerRef.current?.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <div
      ref={containerRef}
      className={gstyle.editorViewPort}
      onWheel={handleContainerWheel}
      onClick={handleContainerClick}
    >
      <EditorCore
        views={shareState.viewDatas}
        width={boardStyle.width}
        className={gstyle.editorBoard}
        style={boardStyle}
      />
    </div>
  );
};
