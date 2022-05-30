import { useEffect, useMemo } from 'react';
import DynamicRender, { DynamicWebRender } from '../DynamicRender';
import { AppData, PageData, ViewData } from '../interface';
import config from '../../config';
import gstyle from './index.module.less';
import Container from './state';
import baseStyle from '../EditorCore/baseStyle';

const { viewPortRowHeight } = config;

export interface WebRenderProps {
  data: AppData;
  page?: PageData; // 只渲染特定页
  width: number;
}

export interface PageRenderProps {
  page: PageData;
  width: number;
  snapshot?: boolean;
}
export interface ViewRenderProps {
  views: ViewData[];
  width: number;
}

/** 内部扩展ViewData */
interface ViewDataX extends ViewData {
  left?: number;
}

interface ViewGroup {
  views: ViewDataX[];
  maxHeight: number;
  y: number;
}

/**
 * web渲染器(多页面渲染、初始化状态)
 * @param props
 * @returns
 */
const WebRender = ({ data, page, width }: WebRenderProps) => {
  const renderState = Container.useContainer();
  const pageData = page ? page : data.pages[0];

  useEffect(() => {
    const vars = data.vars?.reduce<Record<string, any>>(
      (obj, item) => ({ ...obj, [item.id]: item.value }),
      {},
    );
    renderState.setAppData(data);
    renderState.setVars(vars || {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    // TODO: 目前只渲染了第一个页面，后续添加完整多页面渲染
    <div
      className={gstyle.page}
      style={{ minHeight: '100vh', ...baseStyle, ...pageData.style }}
    >
      <ViewRender views={pageData.views || []} width={width} />
    </div>
  );
};

/**
 * 纯净单页面渲染，无状态
 * @param param0
 * @returns
 */
export const PageRender = ({ page, width, snapshot }: PageRenderProps) => {
  return (
    <div className={gstyle.page} style={{ ...baseStyle, ...page.style }}>
      <ViewRender views={page.views || []} width={width} snapshot={snapshot} />
    </div>
  );
};

/**
 * web组件渲染
 * @param param
 * @returns
 */
export const ViewRender = ({
  views,
  width: pWidth,
  snapshot, // 快照，不使用状态管理器
}: ViewRenderProps & { snapshot?: boolean }) => {
  const viewDoms = useMemo(() => {
    const pageWidth = pWidth;
    const unit = pageWidth / config.viewPortCols;
    const viewGroups = calculateViews(groupViews(views), pageWidth);

    return viewGroups.map((group, groudIndex) => {
      const doms = group.views.map(function (view) {
        const { id, style, layout, left, isFixedHeight, isAbsolute, children } =
          view;
        const width = Math.ceil(layout.w * unit);
        const height = Math.ceil(layout.h * viewPortRowHeight);
        const absLeft = Math.ceil(layout.x * unit);
        const absTop = Math.ceil(layout.y * viewPortRowHeight);
        const sizeStyle = isFixedHeight
          ? { width: width, height: height }
          : { width: width, minHeight: height };
        const posStyle = isAbsolute
          ? { position: 'absolute' as any, left: absLeft, top: absTop }
          : { position: 'relative' as any, left };
        const computedStyle = {
          ...baseStyle,
          ...sizeStyle,
          ...posStyle,
          ...style,
        };

        return !children?.length ? (
          <div key={id} className={gstyle.item} style={computedStyle}>
            {snapshot ? (
              <DynamicRender data={view} renderer="web" />
            ) : (
              <DynamicWebRender data={view} renderer="web" />
            )}
          </div>
        ) : (
          <div key={id} style={computedStyle}>
            <ViewRender views={children} width={width} snapshot={snapshot} />
          </div>
        );
      });
      return (
        <div key={groudIndex} className={gstyle.row}>
          {doms}
        </div>
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [views]);
  return <>{viewDoms}</>;
};

/** 按y坐标分组 */
function groupViews(views: ViewData[]): ViewGroup[] {
  let maxh = 0;
  const hashed = views.reduce<Record<string, ViewGroup>>((pre, cur) => {
    const y = cur.layout.y;
    const h = cur.layout.h;
    if (!pre[y]) {
      pre[y] = { views: [cur], maxHeight: h, y };
      maxh = h;
      pre[y].maxHeight = maxh;
    } else {
      pre[y].views.push(cur);
      maxh = Math.max(maxh, h);
      pre[y].maxHeight = maxh;
    }
    return pre;
  }, {});
  return Object.keys(hashed).map((key) => hashed[key]);
}

/** 计算views的定位方式和位置 */
function calculateViews(viewGroups: ViewGroup[], width: number): ViewGroup[] {
  const unit = width / config.viewPortCols;
  let groupMaxY = 0;
  return viewGroups.map((group) => {
    let leftx = 0;
    let isGhostGroup = group.y < groupMaxY; // 是否幽灵组（组内元素是绝对定位）
    const cviews = group.views.map((view: ViewData) => {
      const l = Math.ceil(view.layout.x * unit - leftx); // 计算同行节点的水平位置
      const y = Math.ceil(view.layout.y * viewPortRowHeight);
      leftx += view.layout.w * unit;
      // 已经存在isAbsolute的情况跳过
      return view.isAbsolute
        ? view
        : {
            ...view,
            left: l,
            isAbsolute: y < groupMaxY,
          };
    });
    // 不是幽灵组，高度才能累记
    if (!isGhostGroup)
      groupMaxY = Math.ceil((group.maxHeight + group.y) * viewPortRowHeight);
    return { ...group, views: cviews };
  });
}

export default WebRender;
