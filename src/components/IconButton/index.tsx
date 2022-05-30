import { Tooltip } from 'antd';
import React from 'react';
import style from './index.module.less';

interface IconButtonProps {
  text?: string;
  collapse?: boolean;
  inheritColor?: boolean;
  children: React.ReactElement;
  onClick?: React.MouseEventHandler;
}
const IconButton = (props: IconButtonProps) => {
  const iconClass = props.inheritColor
    ? 'iconButtonInheritColor'
    : 'iconButton';
  if (props.collapse === true && props.text)
    return (
      <Tooltip title={props.text}>
        <div
          className={style[iconClass] + ' ' + style.bigIcon}
          onClick={props.onClick}
        >
          {props.children}
        </div>
      </Tooltip>
    );
  return (
    <div className={style[iconClass]} onClick={props.onClick}>
      {props.children}
      {props.text && <div className={style.iconText}>{props.text}</div>}
    </div>
  );
};

export const CircleButton = (props: IconButtonProps) => {
  const element = (
    <button className={style.buttonCircle} onClick={props.onClick}>
      {props.children}
    </button>
  );
  return props.text ? <Tooltip title={props.text}>{element}</Tooltip> : element;
};

export default IconButton;
