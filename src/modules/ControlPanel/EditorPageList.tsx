import React from 'react';
import { PageData } from '../../core/interface';
import style from './index.module.less';
import { classnames } from '../../utils';

export interface EditorPageListProps {
  data: PageData[];
  activeId: string;
  onItemClick: (id: string) => void;
  onItemContextMenu: (id: string, e: React.MouseEvent) => void;
}

/**
 * 页面列表
 * @param props
 * @returns
 */
const EditorPageList = ({
  data,
  activeId,
  onItemClick,
  onItemContextMenu,
}: EditorPageListProps) => {
  return (
    <ul>
      {data.map((page) => (
        <li
          key={page.id}
          className={classnames(
            style.pageListElement,
            activeId === page.id ? style.pageListElementActive : '',
          )}
          onClick={() => onItemClick && onItemClick(page.id)}
          onContextMenu={(e) =>
            onItemContextMenu && onItemContextMenu(page.id, e)
          }
        >
          {page.displayName}
        </li>
      ))}
    </ul>
  );
};

export default EditorPageList;
