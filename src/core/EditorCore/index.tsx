import React, { CSSProperties, useMemo } from 'react';
import { useContextMenu } from 'react-contexify';
import Draggable from 'react-draggable';
import ReactGridLayout from 'react-grid-layout';
import { v4 as uuid } from 'uuid';
import config from '../../config';
import { EditorItemMenu } from '../../modules/EditorMenu';
import Container from '../../state';
import { classnames, TreeHelper } from '../../utils';
import Dropper from '../Dropper';
import { DynamicRenderWithState } from '../DynamicRender';
import { DragObject, ViewData } from '../interface';
import baseStyle from './baseStyle';
import BoardEditor, { BoardEditorFormValues } from './BoardEditor';
import estyle from './index.module.less';

const {
  viewPortCols,
  viewPortRowHeight,
  defaultNewItemHeight,
  defaultNewItemWidth,
} = config;
const MENU_ID = 'viewPortMenu';

export interface EditorCoreProps {
  views?: ViewData[];
  width: number;
  height?: number;
  containerId?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * 编辑器核心
 * @param props
 * @returns
 */
const EditorCore = ({
  views: propsViews = [],
  width,
  height,
  containerId,
  className,
  style,
}: EditorCoreProps) => {
  const shareState = Container.useContainer();
  const { show, hideAll } = useContextMenu({
    id: MENU_ID,
  });
  const nodeRef = React.useRef(null);
  const [views, viewDoms, absDoms] = useMemo(() => {
    const viewGroupArr = splitViews(propsViews);
    const vDoms = viewGroupArr[0].map(function (view, i) {
      const { id, style, children } = view;
      return (
        <div
          key={id}
          style={{
            ...baseStyle,
            ...style,
          }}
          className={classnames(
            estyle.editorGridItem,
            shareState.selectedItemId === id
              ? estyle.editorGridItemSelected
              : '',
          )}
          onContextMenu={(e) => handleItemContextMenu(id, e)}
          onClick={(e) => e.stopPropagation()}
          onClickCapture={(e) => {
            !children && handleItemClick(id);
            !children && e.nativeEvent.stopImmediatePropagation();
          }} // 在捕获阶段阻止所有事件传递
        >
          {/* <DynamicRender data={view} /> */}
          <DynamicRenderWithState data={view} renderer="editor" />
        </div>
      );
    });
    const absDoms = viewGroupArr[1].map(function (view, i) {
      const { id, style, layout } = view;
      const x = Math.ceil(layout.x * (width / config.viewPortCols));
      const y = Math.ceil(layout.y * config.viewPortRowHeight);
      const w = Math.ceil(layout.w * (width / config.viewPortCols));
      const h = Math.ceil(layout.h * config.viewPortRowHeight);
      return (
        <Draggable
          key={id}
          nodeRef={nodeRef}
          scale={shareState.viewScale}
          position={{ x, y }}
          disabled={layout.static}
          bounds={containerId && 'parent'}
          onStop={(e, data) => {
            const x = Math.round(data.lastX / (width / config.viewPortCols));
            const y = Math.round(data.lastY / config.viewPortRowHeight);
            shareState.updateViewDataLayoutById(id, { x, y });
          }}
          onMouseDown={(e) => {
            handleItemClick(id);
            e.stopPropagation();
          }}
        >
          <div
            ref={nodeRef}
            style={{ ...baseStyle, ...style, width: w, height: h }}
            className={classnames(
              estyle.editorGridItem,
              estyle.editorAbsItem,
              shareState.selectedItemId === id
                ? estyle.editorGridItemSelected
                : '',
            )}
            onClick={(e) => {
              e.stopPropagation();
            }}
            onClickCapture={(e) => {
              e.stopPropagation();
            }}
          >
            {/* <DynamicRender data={view} /> */}
            <DynamicRenderWithState data={view} renderer="editor" />
          </div>
        </Draggable>
      );
    });
    return [viewGroupArr[0], vDoms, absDoms];
  }, [propsViews, shareState.selectedItemId, shareState.viewScale, width]);

  const handleItemContextMenu = (id: string, e: React.MouseEvent) => {
    const selectedItem = new TreeHelper<ViewData>(shareState.viewDatas).find(
      id,
    );
    shareState.selectedItemId !== id && shareState.setSelectedItemId(id);
    show(e, { props: selectedItem });
    e.stopPropagation();
  };
  const handleItemClick = (id: string) => {
    shareState.selectedItemId !== id && shareState.setSelectedItemId(id);
  };
  const handleDropItem = (item: DragObject) => {
    const nId = uuid();
    const viewItem: ViewData = {
      id: nId,
      item: item,
      layout: {
        i: nId,
        x: 0,
        y: 0,
        w: item.w || defaultNewItemWidth,
        h: item.h || defaultNewItemHeight,
      },
    };
    shareState.addViewData(viewItem, containerId);
  };
  const handleContainerKeyDown = (e: React.KeyboardEvent) => {
    if (e.keyCode === 8 && shareState.selectedItemId) {
      shareState.removeViewData(shareState.selectedItemId);
      shareState.setSelectedItemId(undefined);
    }
  };
  const handleSettingUpdate = (values: BoardEditorFormValues) => {
    const { width, ...rest } = values;
    shareState.currentPageData &&
      shareState.updatePageData(shareState.currentPageData.id, {
        width: values.width,
        style: rest,
      });
  };

  return (
    <>
      <div
        className={classnames(estyle.board, className)}
        style={style}
        tabIndex={0}
        onMouseDown={!containerId ? (e) => e.stopPropagation() : undefined}
        onKeyDown={handleContainerKeyDown}
      >
        <Dropper drop={handleDropItem} height={height}>
          <ReactGridLayout
            cols={viewPortCols}
            rowHeight={viewPortRowHeight}
            width={width}
            layout={views.map((viewDatas) => viewDatas.layout)}
            containerPadding={[0, 0]}
            margin={[0, 0]}
            transformScale={shareState.viewScale}
            onDragStart={(...params) => {
              handleItemClick(params[2].i);
              params[4].stopPropagation();
            }}
            onDragStop={(layout) => {
              shareState.updateViewDataLayout(layout);
            }}
            onResizeStop={(layout) => {
              shareState.updateViewDataLayout(layout);
            }}
            onLayoutChange={(layout) => {
              shareState.updateViewDataLayoutNoTrace(layout);
            }}
          >
            {viewDoms}
          </ReactGridLayout>
        </Dropper>
        {absDoms}
        {!containerId && (
          <BoardEditor width={width} onUpdate={handleSettingUpdate} />
        )}
      </div>
      <div
        onClick={(e) => {
          hideAll();
          e.stopPropagation();
        }}
      >
        <EditorItemMenu menuId={MENU_ID} />
      </div>
    </>
  );
};

/** 把ViewDatas根据isAbsolute分割 */
const splitViews = (views: ViewData[]) => {
  return views.reduce<ViewData[][]>(
    (pre, cur) => {
      if (cur.isAbsolute) pre[1].push(cur);
      else pre[0].push(cur);
      return pre;
    },
    [[], []],
  );
};

export default EditorCore;
