import { TreeHelper } from '../utils';
import { CSSProperties, useCallback, useMemo, useState } from 'react';
import { PageData, VarMap, ViewAction, ViewData } from '../core/interface';
import { Layout } from 'react-grid-layout';

/** 历史操作记录最大长度 */
const limitHistoryLength = 10;

/** 页面状态 */
const usePageDatas = (initial?: PageData[], currentPageId?: string) => {
  /** 页面数据 */
  const [pageDatas, setRealPageDatas] = useState<PageData[]>(initial || []);
  /** 页面操作历史 */
  const [pageModifyHistory, setPageModifyHistory] = useState<PageData[][]>([
    pageDatas,
  ]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0);

  /** 页面操作代理 */
  const setPageDatas: (
    value: React.SetStateAction<PageData[]>,
    record?: boolean,
  ) => void = useCallback(
    (value, record) => {
      const newPageDatas =
        typeof value === 'function' ? value(pageDatas) : value;
      const isHistoryOverload = pageModifyHistory.length >= limitHistoryLength;

      setRealPageDatas(newPageDatas);

      /** 记录操作历史 */
      if (record !== false) {
        setPageModifyHistory((history) => {
          if (currentHistoryIndex !== history.length - 1)
            return history
              .slice(0, currentHistoryIndex + 1)
              .concat([newPageDatas]);
          else if (isHistoryOverload)
            return history.slice(1).concat([newPageDatas]);
          else return history.concat([newPageDatas]);
        });
        setCurrentHistoryIndex((index) =>
          isHistoryOverload ? index : index + 1,
        );
      }
    },
    [pageModifyHistory, currentHistoryIndex, pageDatas],
  );

  /** 回退、重做 操作 */
  const undoPageData = () => {
    if (
      pageModifyHistory.length > 1 &&
      currentHistoryIndex > 0 &&
      pageModifyHistory[currentHistoryIndex - 1]
    ) {
      setRealPageDatas(pageModifyHistory[currentHistoryIndex - 1]);
      setCurrentHistoryIndex((index) => index - 1);
    }
  };
  const redoPageData = () => {
    if (
      currentHistoryIndex < pageModifyHistory.length - 1 &&
      pageModifyHistory[currentHistoryIndex + 1]
    ) {
      setRealPageDatas(pageModifyHistory[currentHistoryIndex + 1]);
      setCurrentHistoryIndex((index) => index + 1);
    }
  };

  /** 页面数据操作 */
  const addPageData = (payload: PageData) =>
    setPageDatas((pageDatas) => [...pageDatas, payload]);
  const removePageData = (id: string) =>
    setPageDatas((pageDatas) => pageDatas.filter((page) => page.id !== id));
  const updatePageData = (id: string, payload: Partial<PageData>) =>
    setPageDatas((pageDatas) =>
      pageDatas.map((page) =>
        page.id === id
          ? { ...page, ...payload, style: { ...page.style, ...payload.style } }
          : page,
      ),
    );
  const clearPageData = (id: string) =>
    setPageDatas((pageDatas) =>
      pageDatas.map((page) => (page.id === id ? { ...page, views: [] } : page)),
    );
  /** 当前视图的组件布局数据 */
  const [currentPageData, viewDatas] = useMemo(() => {
    const res = pageDatas.find((page) => page.id === currentPageId);
    return [res, res?.views || []];
  }, [currentPageId, pageDatas]);

  /** 更新视图数据 */
  const setViewDatas = useCallback(
    (
      views: ViewData[] | ((views: ViewData[]) => ViewData[]),
      pageId?: string,
      record?: boolean,
    ) => {
      const pId = pageId || currentPageId;
      if (typeof views === 'function') {
        const newViewDatas = views(viewDatas);
        setPageDatas(
          pageDatas.map((pageData) =>
            pageData.id === pId
              ? { ...pageData, views: newViewDatas }
              : pageData,
          ),
          record,
        );
      } else
        setPageDatas(
          (pageDatas) =>
            pageDatas.map((pageData) =>
              pageData.id === pId ? { ...pageData, views } : pageData,
            ),
          record,
        );
    },
    [viewDatas, pageDatas, currentPageId],
  );

  /** 新增视图 */
  const addViewData = (
    payload: ViewData,
    containerId?: string,
    pageId?: string,
  ) =>
    setViewDatas(
      (views) => new TreeHelper<ViewData>(views).add(payload, containerId),
      pageId,
    );

  /** 删除视图 */
  const removeViewData = (id: string, pageId?: string) => {
    setViewDatas((views) => new TreeHelper<ViewData>(views).remove(id), pageId);
  };

  /** 更新视图 */
  const updateViewData = (payload: ViewData, pageId?: string) =>
    setViewDatas(
      (views) => new TreeHelper<ViewData>(views).update(payload),
      pageId,
    );

  /** 更新视图名称 */
  const updateViewDataName = (id: string, name: string, pageId?: string) =>
    setViewDatas(
      (views) =>
        new TreeHelper<ViewData>(views).map((view) => {
          return view.id === id
            ? { ...view, item: { ...view.item, displayName: name } }
            : view;
        }),
      pageId,
    );

  /** 更新视图位置 */
  const updateViewDataPosition = (
    id: string,
    absolute: boolean,
    pageId?: string,
  ) =>
    setViewDatas(
      (views) =>
        new TreeHelper<ViewData>(views).map((view) => {
          return view.id === id ? { ...view, isAbsolute: absolute } : view;
        }),
      pageId,
    );

  /** 更新视图布局 */
  const updateViewDataLayout = (layouts: Layout[], pageId?: string) =>
    setViewDatas(
      (views) =>
        new TreeHelper<ViewData>(views).map((view) => {
          const lay = layouts.find((layout) => layout.i === view.id);
          return {
            ...view,
            layout: lay || view.layout,
          };
        }),
      pageId,
    );
  /** 不记录操作历史下更新layout */
  const updateViewDataLayoutNoTrace = (layouts: Layout[], pageId?: string) =>
    setViewDatas(
      (views) =>
        new TreeHelper<ViewData>(views).map((view) => {
          const lay = layouts.find((layout) => layout.i === view.id);
          return {
            ...view,
            layout: lay || view.layout,
          };
        }),
      pageId,
      false,
    );

  /** 根据id更新视图布局 */
  const updateViewDataLayoutById = (
    id: string,
    layout: Partial<Layout>,
    pageId?: string,
  ) =>
    setViewDatas(
      (views) =>
        new TreeHelper<ViewData>(views).map((view) => {
          return view.id === id
            ? { ...view, layout: { ...view.layout, ...layout } }
            : view;
        }),
      pageId,
    );

  /** 移动视图顺序 */
  const moveViewData = (
    startIndex: number,
    endIndex: number,
    containerId?: string,
    pageId?: string,
  ) =>
    setViewDatas(
      (views) =>
        new TreeHelper<ViewData>(views).move(startIndex, endIndex, containerId),
      pageId,
    );

  /** 更新视图锁 */
  const updateViewLock = (id: string, pageId?: string) => {
    setViewDatas(
      (views) =>
        new TreeHelper<ViewData>(views).map((view) => {
          const isStatic = !!!view.layout.static;
          return view.id === id
            ? { ...view, layout: { ...view.layout, static: isStatic } }
            : view;
        }),
      pageId,
    );
  };

  /** 更新视图样式 */
  const updateViewStyle = (
    id: string,
    style: CSSProperties,
    pageId?: string,
  ) => {
    setViewDatas(
      (views) =>
        new TreeHelper<ViewData>(views).map((view) => {
          let newStyle: Record<string, any> = { ...view.style, ...style };
          Object.keys(newStyle).forEach(
            (key) =>
              (newStyle[key] === null || newStyle[key] === undefined) &&
              delete newStyle[key],
          );
          return view.id === id ? { ...view, style: newStyle } : view;
        }),
      pageId,
    );
  };

  /** 更新视图配置 */
  const updateViewConfig = (id: string, config: any, pageId?: string) => {
    setViewDatas(
      (views) =>
        new TreeHelper<ViewData>(views).map((view) => {
          return view.id === id
            ? {
                ...view,
                item: {
                  ...view.item,
                  config: { ...view.item.config, ...config },
                },
              }
            : view;
        }),
      pageId,
    );
  };

  /** 更新视图交互 */
  const updateViewAction = (
    id: string,
    actions: ViewAction[],
    pageId?: string,
  ) => {
    setViewDatas(
      (views) =>
        new TreeHelper<ViewData>(views).map((view) => {
          return view.id === id
            ? {
                ...view,
                actions,
              }
            : view;
        }),
      pageId,
    );
  };

  /** 更新视图的状态映射 */
  const updateViewVarMaps = (
    id: string,
    varMaps: VarMap[],
    pageId?: string,
  ) => {
    setViewDatas((views) => {
      return new TreeHelper<ViewData>(views).map((view) => {
        return view.id === id
          ? {
              ...view,
              varMaps,
            }
          : view;
      });
    }, pageId);
  };

  return {
    pageDatas,
    setPageDatas,
    addPageData,
    removePageData,
    updatePageData,
    clearPageData,
    undoPageData,
    redoPageData,
    currentPageData,
    viewDatas,
    setViewDatas,
    addViewData,
    removeViewData,
    moveViewData,
    updateViewData,
    updateViewDataName,
    updateViewDataPosition,
    updateViewDataLayout,
    updateViewDataLayoutById,
    updateViewDataLayoutNoTrace,
    updateViewStyle,
    updateViewConfig,
    updateViewLock,
    updateViewAction,
    updateViewVarMaps,
  };
};

export default usePageDatas;
