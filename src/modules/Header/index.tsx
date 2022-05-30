import {
  ArrowLeftOutlined,
  CaretRightOutlined,
  DatabaseOutlined,
  DeleteOutlined,
  DownloadOutlined,
  FileTextOutlined,
  PlusOutlined,
  RedoOutlined,
  SaveOutlined,
  UndoOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons';
import { Divider, message, Modal, Space } from 'antd';
import { useState } from 'react';
import IconButton, { CircleButton } from '../../components/IconButton';
import { downloadCode } from '../../services/application';
import Container from '../../state';
import { saveAppData, saveCurrentPageData } from '../../storage';
import { downloadContent } from '../../utils';
import { DataSourcePanel } from '../DataSource';
import style from './index.module.less';

interface EditorHeaderProps {
  onPreview?: () => void;
}

/**
 * 编辑器操作栏
 * @param props
 * @returns
 */
export const EditorHeader = ({ onPreview }: EditorHeaderProps) => {
  const divider = <Divider type="vertical" style={{ height: '30px' }} />;
  const shareState = Container.useContainer();
  const [dataSourcePanelVisible, setDataSourcePanelVisible] = useState(false);

  const handleSave = () => {
    saveAppData(shareState.getAppData());
    message.success('保存成功');
  };
  const handleDownloadJson = () => {
    downloadContent(JSON.stringify(shareState.getAppData()), 'app.json');
  };
  const handleDownloadCode = () => {
    downloadCode(shareState.getAppData());
  };
  const handleUndo = () => {
    shareState.undoPageData();
  };
  const handleRedo = () => {
    shareState.redoPageData();
  };
  const handleClear = () => {
    shareState.currentPageData &&
      shareState.clearPageData(shareState.currentPageData.id);
  };
  const handleShowDataSource = () => {
    setDataSourcePanelVisible(true);
  };
  const handleShowScript = () => {};
  const handlePreview = () => {
    saveAppData(shareState.getAppData());
    saveCurrentPageData(shareState.currentPageData);
    onPreview && onPreview();
  };
  const handleZoomIn = () => {
    shareState.setViewScale((v) => (v > 3 ? v : v + 0.1));
  };
  const handleZoomOut = () => {
    shareState.setViewScale((v) => (v < 0 ? 0 : v - 0.1));
  };
  const handleToggleMaterial = () => {
    shareState.setMaterialVisible((v) => !v);
  };

  return (
    <div className={style.editorHeader}>
      <div className={style.headerLeft}>
        <Space>
          <CircleButton onClick={handleToggleMaterial}>
            {shareState.materialVisible ? (
              <ArrowLeftOutlined />
            ) : (
              <PlusOutlined />
            )}
          </CircleButton>
        </Space>
      </div>
      <div className={style.headerCenter}>
        <Space>
          <IconButton text="保存" onClick={handleSave}>
            <SaveOutlined />
          </IconButton>
          {divider}
          <IconButton text="json" onClick={handleDownloadJson}>
            <FileTextOutlined />
          </IconButton>
          <IconButton text="源码" onClick={handleDownloadCode}>
            <DownloadOutlined />
          </IconButton>
          {divider}
          <IconButton text="脚本" onClick={handleShowScript}>
            <FileTextOutlined />
          </IconButton>
          <IconButton text="数据源" onClick={handleShowDataSource}>
            <DatabaseOutlined />
          </IconButton>
          {divider}
          <IconButton text="撤销" onClick={handleUndo}>
            <UndoOutlined />
          </IconButton>
          <IconButton text="重做" onClick={handleRedo}>
            <RedoOutlined />
          </IconButton>
          <IconButton text="清空" onClick={handleClear}>
            <DeleteOutlined />
          </IconButton>
          <IconButton text="放大" onClick={handleZoomIn}>
            <ZoomInOutlined />
          </IconButton>
          <IconButton text="缩小" onClick={handleZoomOut}>
            <ZoomOutOutlined />
          </IconButton>
        </Space>
      </div>
      <div className={style.headerRight}>
        <Space>
          <CircleButton text="预览" onClick={handlePreview}>
            <CaretRightOutlined />
          </CircleButton>
        </Space>
      </div>
      <Modal
        width={800}
        title={false}
        footer={false}
        closable={false}
        mask={false}
        maskClosable={true}
        bodyStyle={{ padding: 0 }}
        visible={dataSourcePanelVisible}
        onCancel={() => setDataSourcePanelVisible(false)}
      >
        <DataSourcePanel />
      </Modal>
    </div>
  );
};
