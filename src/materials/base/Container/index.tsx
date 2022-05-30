import config from '../../../config';
import EditorCore from '../../../core/EditorCore';
import { ViewProps } from '../../../core/interface';
import StateContainer from '../../../state';
import gstyle from './index.module.less';

interface ContainerProps extends ViewProps {}

/**
 * 基础组件 - 容器组件
 * @param props
 * @returns
 */
const Container = ({ superData }: ContainerProps) => {
  const { id, layout, children } = superData;
  const shareState = StateContainer.useContainer();
  const layoutWidth =
    (layout.w *
      (shareState.currentPageData?.width || config.defaultViewPortWidth)) /
    config.viewPortCols;
  const layoutHeight = layout.h * config.viewPortRowHeight;

  return (
    <>
      <EditorCore
        style={{ width: '100%' }}
        className={gstyle.container}
        views={children}
        width={layoutWidth}
        height={layoutHeight}
        containerId={id}
      />
      {children?.length ? null : (
        <div
          style={{
            paddingTop: 8,
            color: '#888',
            position: 'absolute',
            fontSize: 12,
          }}
        >
          拖放组件到这里
        </div>
      )}
    </>
  );
};

export default Container;
