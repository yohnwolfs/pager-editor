import { PlusCircleOutlined } from '@ant-design/icons';
import React, { useMemo } from 'react';
import { useContextMenu } from 'react-contexify';
import Collapse from '../../components/Collapse';
import EditorElementTree from './EditorElementTree';
import { EditorItemMenu, EditorPageMenu, EditorVarMenu } from '../EditorMenu';
import { MaterialPanel } from './EditorMaterial';
import EditorPageList from './EditorPageList';
import Container from '../../state';
import { classnames, TreeHelper } from '../../utils';
import { AddStatusVar, PageSetting } from '../EditorForm';
import { PageData, StatusVar, ViewData } from '../../core/interface';
import { v4 as uuid } from 'uuid';
import EditorStatePool from './EditorStatePool';
import style from './index.module.less';
import { createFormModal } from '@phoenixs/antd-modal';
import config from '../../config';

const ELEMENT_MENU_ID = 'viewTreeItemMenu';
const PAGE_MENU_ID = 'pageItemMenu';
const VAR_MENU_ID = 'varItemMenu';

export interface EditorControlPanelProps {}

// TODO: 暂时只实现了一维列表，后续可以实现树结构
/**
 * 组件View面板
 * @param props
 * @returns
 */
export const EditorControlPanel = (props: EditorControlPanelProps) => {
  const shareState = Container.useContainer();
  const { show: showElementMenu } = useContextMenu({ id: ELEMENT_MENU_ID });
  const { show: showPageMenu } = useContextMenu({ id: PAGE_MENU_ID });
  const { show: showVarMenu } = useContextMenu({ id: VAR_MENU_ID });
  /** 反转数组，实现最上方的元素层级最高 */
  const reverseList = useMemo(
    () => [...shareState.viewDatas].reverse(),
    [shareState.viewDatas],
  );

  const handleItemSelect = (id: string) => shareState.setSelectedItemId(id);
  const handleItemContextMenu = (id: string, e: React.MouseEvent) => {
    const selectedItem = new TreeHelper<ViewData>(shareState.viewDatas).find(
      id,
    );
    shareState.setSelectedItemId(id);
    showElementMenu(e, { props: selectedItem });
  };
  const handleItemToggleLockStatus = (id: string) => {
    shareState.updateViewLock(id);
  };
  // const handleMoveItem = ({
  //   oldIndex,
  //   newIndex,
  // }: {
  //   oldIndex: number;
  //   newIndex: number;
  // }) => {
  //   const arrLeng = shareState.viewDatas.length;
  //   shareState.moveViewData(arrLeng - oldIndex - 1, arrLeng - newIndex - 1); // 因为反转了数组，所以要计算index
  // };
  const handlePageClick = (id: string) => shareState.setSelectedPageId(id);
  const handlePageContextMenu = (id: string, e: React.MouseEvent) =>
    showPageMenu(e, { props: id });
  const handleAddPage = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const res = await createFormModal<Omit<PageData, 'id'>>(<PageSetting />, {
      width: 300,
      title: '新增页面',
    });
    if (!res) return;
    if (!res.width) res.width = config.defaultViewPortWidth;
    const nId = uuid();
    shareState.addPageData({
      id: nId,
      ...res,
    });
  };
  const handleAddStatusVar = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const res = await createFormModal<Partial<StatusVar>>(<AddStatusVar />, {
      width: 360,
      title: '新增变量',
    });
    if (!res) return;
    const nId = uuid();
    shareState.addVar({ id: nId, ...res } as StatusVar);
  };
  const handleVarContextMenu = (id: string, e: React.MouseEvent) =>
    showVarMenu(e, { props: id });

  return (
    <div
      className={style.editorControlPanel}
      style={{
        overflow: shareState.materialVisible ? 'hidden' : 'hidden auto',
      }}
    >
      <Collapse
        title="页面管理"
        defaultCollapse={false}
        actionRender={(collapse) =>
          collapse ? (
            <div>{shareState.currentPageData?.displayName}</div>
          ) : (
            <PlusCircleOutlined onClick={handleAddPage} />
          )
        }
      >
        <EditorPageList
          data={shareState.pageDatas}
          activeId={shareState.selectedPageId}
          onItemClick={handlePageClick}
          onItemContextMenu={handlePageContextMenu}
        />
      </Collapse>
      <Collapse
        title="状态管理"
        defaultCollapse={false}
        style={{ borderTop: '1px solid #eee' }}
        actionRender={(collapse) => (
          <PlusCircleOutlined onClick={handleAddStatusVar} />
        )}
      >
        <EditorStatePool
          data={shareState.vars}
          onItemConextMenu={handleVarContextMenu}
        />
      </Collapse>
      <Collapse
        title="组件列表"
        defaultCollapse={false}
        style={{ borderTop: '1px solid #eee' }}
      >
        <EditorElementTree
          views={reverseList}
          selectedId={shareState.selectedItemId}
          onItemToggleLockStatus={handleItemToggleLockStatus}
          onItemContextMenu={handleItemContextMenu}
          onSelect={(selectedKeys) =>
            selectedKeys.length > 0 && handleItemSelect(String(selectedKeys[0]))
          }
        />
      </Collapse>
      <div
        className={classnames(
          style.sliderPanel,
          shareState.materialVisible ? style.sliderPanelVisible : '',
        )}
      >
        <MaterialPanel />
      </div>
      <EditorItemMenu menuId={ELEMENT_MENU_ID} />
      <EditorPageMenu menuId={PAGE_MENU_ID} />
      <EditorVarMenu menuId={VAR_MENU_ID} />
    </div>
  );
};
