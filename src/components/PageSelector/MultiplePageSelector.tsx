import { useState } from 'react';
import style from './index.module.less';
import { PageSelector } from './PageSelector';
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from 'react-sortable-hoc';
import {
  CloseCircleOutlined,
  MenuOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import update from 'immutability-helper';

export interface MultiplePageSelectorProps {
  value?: string[];
  onChange?: (v?: string[]) => void;
}

/**
 * 多页面选择器
 * @param props
 * @returns
 */
export const MultiplePageSelector = ({
  value,
  onChange,
}: MultiplePageSelectorProps) => {
  const [pageIds, setPageIds] = useState<string[]>(value || []);
  const [addedItemId, setAddedItemId] = useState<string>();
  const innerValue = value || pageIds;
  return (
    <>
      <PageList
        data={innerValue}
        lockAxis="y"
        useDragHandle
        onSortEnd={({ oldIndex, newIndex }) => {
          const temp = innerValue[oldIndex];
          const res = update(innerValue, {
            $splice: [
              [oldIndex, 1],
              [newIndex, 0, temp],
            ],
          });
          setPageIds(res);
          onChange && onChange(res);
        }}
        onItemDelete={(key: string) => {
          const res = innerValue.filter((pageId) => pageId !== key);
          setPageIds(res);
          onChange && onChange(res);
        }}
        onItemChange={(v, index) => {
          const res = innerValue.map((pageId, i) => (i === index ? v : pageId));
          setPageIds(res);
          onChange && onChange(res);
        }}
      />
      <div className={style.btnAdd}>
        <div style={{ flex: 1 }}>
          <PageSelector
            value={addedItemId}
            onChange={(v) => setAddedItemId(v)}
          />
        </div>
        <div
          style={{ padding: '0 12px 0 0' }}
          onClick={() => {
            if (!addedItemId) return;
            const res = [...innerValue, addedItemId];
            setPageIds(res);
            onChange && onChange(res);
            setAddedItemId(undefined);
          }}
        >
          <PlusCircleOutlined />
        </div>
      </div>
    </>
  );
};

interface PageListProps {
  data?: string[];
  onItemDelete?: (key: string) => void;
  onItemChange?: (v: string, index: number) => void;
}
const PageList = SortableContainer<PageListProps>(
  ({ data, onItemDelete, onItemChange }: PageListProps) => {
    return (
      <ul>
        {data?.map((pageId, index) => (
          <PageItem
            key={index}
            index={index}
            data={pageId}
            onDelete={onItemDelete}
            onChange={(v) => onItemChange && onItemChange(v, index)}
          />
        ))}
      </ul>
    );
  },
);

interface PageItemProps {
  data?: string;
  onDelete?: (key: string) => void;
  onChange?: (v: string) => void;
}
const PageItem = SortableElement<PageItemProps>(
  ({ data, onDelete, onChange }: PageItemProps) => {
    return (
      <li className={style.pageItem}>
        <DragHandler />
        <div className={style.pageItemContent}>
          <PageSelector value={data} onChange={onChange} />
        </div>
        <div
          style={{ padding: '4px 12px 4px 0', cursor: 'pointer' }}
          onClick={() => onDelete && data && onDelete(data)}
        >
          <CloseCircleOutlined />
        </div>
      </li>
    );
  },
);

const DragHandler = SortableHandle(() => (
  <div style={{ padding: '4px 0px 4px 12px', cursor: 'pointer' }}>
    <MenuOutlined />
  </div>
));
