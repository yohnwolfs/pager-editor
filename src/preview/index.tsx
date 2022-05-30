import { WebRender } from '../core';
import { AppData, PageData } from '../core/interface';
import { getAppData, getCurrentPageData } from '../storage';
import { CloseCircleOutlined } from '@ant-design/icons';
import React, { useMemo } from 'react';
import config from '../config';
import style from './index.module.less';
import Container from '../core/WebRender/state';

const { defaultViewPortWidth, defaultViewPortHeight } = config;

export interface EditorPreviewProps {
  onClose: (e: React.MouseEvent) => void;
}

/**
 * 页面预览
 * @param props
 * @returns
 */
const EditorPreview = ({ onClose }: EditorPreviewProps) => {
  const [previewData, currentPageData]: [AppData, PageData] = useMemo(() => {
    const appStr = getAppData();
    const pageStr = getCurrentPageData();
    let appData, pageData;
    try {
      appData = appStr && JSON.parse(appStr);
      pageData = pageStr && JSON.parse(pageStr);
    } catch (e) {}
    return [appData, pageData];
  }, []);

  const boardStyle = {
    width: currentPageData?.width || defaultViewPortWidth,
    // minHeight: currentPageData?.height || defaultViewPortHeight,
    minHeight: '100vh',
  };

  return (
    <Container.Provider>
      <div className={style.preview}>
        <div className={style.previewBoard} style={boardStyle}>
          {previewData ? (
            <WebRender
              data={previewData}
              page={currentPageData}
              width={boardStyle.width}
            />
          ) : null}
        </div>
        <CloseCircleOutlined
          style={{ fontSize: 24, position: 'absolute', left: 16, top: 16 }}
          onClick={onClose}
        />
      </div>
    </Container.Provider>
  );
};

export default EditorPreview;
