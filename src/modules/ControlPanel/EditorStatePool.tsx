import { Empty } from 'antd';
import React from 'react';
import { StatusVar } from '../../core/interface';
import style from './index.module.less';

export interface EditorStatePoolProps {
  data: StatusVar[];
  onItemConextMenu?: (id: string, e: React.MouseEvent) => void;
}

const colorsMap = {
  string: '#084466',
  number: '#0e7646',
  boolean: '#5e780f',
  object: '#981',
  array: '#ad4720',
};

/**
 * 状态池
 * @param props
 * @returns
 */
const EditorStatePool = ({ data, onItemConextMenu }: EditorStatePoolProps) => {
  return data?.length ? (
    <div className={style.varList}>
      {data.map((v) => (
        <div
          key={v.id}
          className={style.varListElement}
          onContextMenu={(e) => onItemConextMenu && onItemConextMenu(v.id, e)}
        >
          <div
            className={style.varListElementTitle}
            style={{ color: colorsMap[v.type] }}
          >
            {v.displayName || v.name}
          </div>
          <div className={style.varListElementStitle}>{String(v.value)}</div>
          {/* <Tag color="blue">{v.type}</Tag> */}
        </div>
      ))}
    </div>
  ) : (
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="无变量" />
  );
};

export default EditorStatePool;
