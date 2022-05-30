import { Dragger } from '../../core';
import { MetaData } from '../../materials/interface';
import { QuestionCircleOutlined } from '@ant-design/icons';
import React from 'react';
import style from './index.module.less';

export interface EditorWidgetCardProps {
  metadata: MetaData;
}
/**
 * 组件卡片
 * @returns
 */
const EditorWidgetCard = (props: EditorWidgetCardProps) => {
  const { metadata } = props;
  return (
    <Dragger item={props.metadata}>
      <div className={style.componentCard}>
        {metadata.img ? (
          <div className={style.componentThumbWrapper}>
            <div
              className={style.componentThumb}
              style={{ backgroundImage: 'url(' + metadata.img + ')' }}
            />
          </div>
        ) : (
          <div className={style.componentThumbWrapper}>
            <div className={style.componentThumb}>
              <QuestionCircleOutlined style={{ fontSize: 30, color: '#333' }} />
            </div>
          </div>
        )}
        <div className={style.componentName}>{metadata.displayName}</div>
      </div>
    </Dragger>
  );
};

/**
 * 列表
 * @param props
 * @returns
 */
export interface EditorWidgetListProps extends React.PropsWithChildren<any> {}
export const EditorWidgetList = (props: EditorWidgetListProps) => {
  return (
    <div className={style.componentListWrapper}>
      <div className={style.componentList}>{props.children}</div>
    </div>
  );
};

export default EditorWidgetCard;
