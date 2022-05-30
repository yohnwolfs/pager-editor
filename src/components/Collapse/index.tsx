import { classnames } from '../../utils';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import React, { CSSProperties, useState } from 'react';
import style from './index.module.less';

interface CollapseProps extends React.PropsWithChildren<any> {
  title: string;
  defaultCollapse?: boolean;
  disable?: boolean;
  collapsable?: boolean;
  style?: CSSProperties;
  actionRender?: (
    collapse: boolean,
    updateCollapse: React.Dispatch<React.SetStateAction<boolean>>,
  ) => React.ReactNode;
}

/**
 * 折叠面板
 * @param props
 * @returns
 */
const Collapse = (props: CollapseProps) => {
  const {
    title,
    defaultCollapse = true,
    disable = false,
    collapsable = true,
    actionRender,
    children,
  } = props;
  const [collapse, setCollapse] = useState(defaultCollapse);
  const handleToggle = () => collapsable && setCollapse((v) => !v);
  const defaultActions =
    !disable && (collapse ? <PlusOutlined /> : <MinusOutlined />);
  return (
    <div
      className={classnames(
        style.collapse,
        !collapse ? style.collapseExpand : '',
      )}
      style={{
        color: disable ? '#ddd' : 'inherit',
        overflow: collapse ? 'hidden' : 'visible',
        ...props.style,
      }}
    >
      <div className={style.collapseBar}>
        <span onClick={handleToggle}>{title}</span>
        <div
          className={style.collapseActions}
          onClick={(e) => {
            collapsable && setCollapse((v) => !v);
            e.stopPropagation();
          }}
        >
          {actionRender ? actionRender(collapse, setCollapse) : defaultActions}
        </div>
      </div>
      <div className={style.collapseContent}>{!disable && children}</div>
    </div>
  );
};

export default Collapse;
