import { useState } from 'react';
import { createContainer } from 'unstated-next';
import { AppData } from './core/interface';
import { usePageDatas, useDataSource, useStatusVars } from './hooks';
import useWidgets from './hooks/useWidgets';
import { getAppData } from './storage';

// TODO
// 需要拆分全局状态，因为全局状态的改变导致使用shareState的所有组件都会更新
// 例如改变scale，导致属性面板的更新

const mainPageId = 'MainPage';
const defaultPageDatas = [
  {
    id: mainPageId,
    name: 'IndexPage',
    displayName: '主页',
    views: [],
    width: 320,
  },
];

const storageAppData = getAppData() && JSON.parse(getAppData() || '');

/**
 * 内部共享数据
 */
const useShareState = () => {
  /** 视窗大小 */
  const [viewScale, setViewScale] = useState(1);

  /** 物料面板是否显示 */
  const [materialVisible, setMaterialVisible] = useState(false);

  /** 选择的组件id */
  const [selectedItemId, setSelectedItemId] = useState<string | undefined>();

  /** 选择的页面id */
  const [selectedPageId, setSelectedPageId] = useState(mainPageId);

  /** 状态池 */
  const { vars, varsObj, setVars, ...varMethods } = useStatusVars(
    storageAppData?.vars,
  );

  /** 数据源 */
  const { dataSources, setDataSources, ...dataSourceMethods } = useDataSource(
    storageAppData?.dataSources,
  );

  /** 商店组件列表 */
  const [widgets, loadMoreWidgets, loadMoreLoading] = useWidgets();

  const {
    pageDatas,
    setPageDatas,
    currentPageData,
    viewDatas,
    setViewDatas,
    ...pageMethods
  } = usePageDatas(storageAppData?.pages || defaultPageDatas, selectedPageId);

  const getAppData = (): AppData => ({
    id: 'TestApp',
    name: '测试应用',
    pages: pageDatas,
    vars,
    dataSources,
  });

  return {
    viewScale,
    setViewScale,
    pageDatas,
    currentPageData,
    setPageDatas,
    viewDatas,
    setViewDatas,
    vars,
    varsObj,
    setVars,
    selectedPageId,
    setSelectedPageId,
    selectedItemId,
    setSelectedItemId,
    materialVisible,
    setMaterialVisible,
    dataSources,
    setDataSources,
    getAppData,
    widgets,
    loadMoreWidgets,
    loadMoreLoading,
    ...pageMethods,
    ...varMethods,
    ...dataSourceMethods,
  };
};

const Container =
  createContainer<ReturnType<typeof useShareState>>(useShareState);

export default Container;
