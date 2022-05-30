import { useMemo } from 'react';
import ReactGridLayout, { WidthProvider } from 'react-grid-layout';
import { PageData } from '../interface';
import config from '../../config';
import DynamicRender from '../DynamicRender';
import gridStyle from './index.module.less';

const ResponsiveGridLayout = WidthProvider(ReactGridLayout) as any;
const { viewPortCols, viewPortRowHeight } = config;

export interface GridRenderProps {
  data: PageData;
}

/**
 * react grid layout 渲染器
 * @param props
 * @returns
 */
const GridRender = ({ data: pageData }: GridRenderProps) => {
  const layouts = useMemo(() => {
    return pageData.views.map((v) => ({
      ...v.layout,
      isDraggable: false,
      isResizable: false,
    }));
  }, [pageData.views]);

  const viewDoms = useMemo(
    () =>
      pageData.views.map(function (view, i) {
        const { id, style } = view;
        return (
          <div key={id} className={gridStyle.gridItem} style={style}>
            <DynamicRender data={view} renderer="editor" />
          </div>
        );
      }),
    [pageData.views],
  );

  return (
    <ResponsiveGridLayout
      cols={viewPortCols}
      rowHeight={viewPortRowHeight}
      containerPadding={[0, 0]}
      margin={[0, 0]}
      // allowOverlap={true}
      // compactType={null}
      layout={layouts}
    >
      {viewDoms}
    </ResponsiveGridLayout>
  );
};

export default GridRender;
