import { ViewProps } from '../../../core/interface';
import style from './index.module.less';
import { Carousel } from 'antd';
import { PageRender } from '../../../core/WebRender';
import config from '../../../config';
import WebStateContainer from '../../../core/WebRender/state';
import EditorStateContainer from '../../../state';
import { useMemo } from 'react';

export interface PageSliderProps extends ViewProps {
  pageIds?: string[];
}

// TODO 全屏Slider未完成
/**
 * 全屏slider
 * @param param0
 * @returns
 */
const PageSlider = ({ superData, pageIds = [], renderer }: PageSliderProps) => {
  if (renderer === 'editor')
    return (
      <EditorPageSlider
        pageIds={pageIds}
        height={superData.layout.h * config.viewPortRowHeight}
      />
    );
  else if (renderer === 'web') return <WebPageSlider pageIds={pageIds} />;
  else return <></>;
};

/**
 * 在编辑器中渲染的pageslider
 * @returns
 */
const EditorPageSlider = ({
  pageIds,
  height,
}: {
  pageIds: string[];
  height: number;
}) => {
  const shareState = EditorStateContainer.useContainer();
  const pages = useMemo(() => {
    return shareState.pageDatas.filter((page) => pageIds.includes(page.id));
  }, [shareState.pageDatas, pageIds]);

  return (
    <div className={style.pageSlider}>
      <Carousel dotPosition="left">
        {pages.map((page) => (
          <PageRender
            key={page.id}
            page={{ ...page, style: { ...page.style, height } }}
            width={page.width}
            snapshot
          />
        ))}
      </Carousel>
      {pages?.length ? null : (
        <div
          style={{
            paddingTop: 8,
            color: '#888',
            position: 'absolute',
            margin: '0 auto',
            left: 0,
            right: 0,
            width: 200,
            fontSize: 12,
            textAlign: 'center',
          }}
        >
          请添加页面
        </div>
      )}
    </div>
  );
};

/**
 * 在web中渲染的pageslider
 * @returns
 */
const WebPageSlider = ({ pageIds }: { pageIds: string[] }) => {
  const renderState = WebStateContainer.useContainer();
  const pages = useMemo(() => {
    return (
      renderState.appData?.pages.filter((page) => pageIds.includes(page.id)) ||
      []
    );
  }, [renderState.appData, pageIds]);

  return (
    <div className={style.pageSlider}>
      <Carousel dotPosition="left">
        {pages.map((page) => (
          <PageRender
            key={page.id}
            page={{ ...page, style: { ...page.style, height: '100vh' } }}
            width={page.width}
          />
        ))}
      </Carousel>
    </div>
  );
};

export default PageSlider;
