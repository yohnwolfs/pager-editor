import { DownOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import Tree, { TreeProps } from 'antd/lib/tree';
import React, { useMemo } from 'react';
import { ViewData } from '../../core/interface';
import style from './index.module.less';
import { TreeHelper } from '../../utils';

export interface EditorElementTreeProps extends TreeProps {
  views: ViewData[];
  selectedId?: string;
  onItemToggleLockStatus?: (id: string) => void;
  onItemContextMenu?: (id: string, e: React.MouseEvent) => void;
}
const EditorElementTree = ({
  views,
  selectedId,
  onItemToggleLockStatus,
  onItemContextMenu,
  ...restProps
}: EditorElementTreeProps) => {
  const treeData = useMemo(
    () =>
      new TreeHelper<ViewData>(views).map((view) => ({
        key: view.id,
        title: view.item.displayName,
        layout: view.layout,
      })),
    [views],
  );
  const handleToggleLockStatus = (id: string, e: React.MouseEvent) => {
    onItemToggleLockStatus && onItemToggleLockStatus(id);
    e.stopPropagation();
  };
  const titleRender = (node: any) => {
    const isStatic = !!node.layout.static;
    return (
      <div
        className={style.viewTreeNode}
        onContextMenu={(e) =>
          onItemContextMenu && onItemContextMenu(node.key, e)
        }
      >
        <div className={style.viewTreeNodeTitle}>{node.title}</div>
        <div>
          {isStatic ? (
            <LockOutlined
              onClick={(e) => handleToggleLockStatus(node.key, e)}
            />
          ) : (
            <UnlockOutlined
              onClick={(e) => handleToggleLockStatus(node.key, e)}
            />
          )}
        </div>
      </div>
    );
  };
  return (
    <div className={style.editorViewTree}>
      <Tree
        autoExpandParent
        treeData={treeData}
        switcherIcon={<DownOutlined />}
        titleRender={titleRender}
        selectedKeys={selectedId !== undefined ? [selectedId] : []}
        expandedKeys={selectedId !== undefined ? [selectedId] : []}
        {...restProps}
      />
    </div>
  );
};

export default EditorElementTree;
