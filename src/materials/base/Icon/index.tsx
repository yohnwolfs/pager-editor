import React from 'react';

export interface IconProps {
  src?: string;
  size?: number;
}

/**
 * 图表组件
 * @param props
 * @returns
 */
const Icon = ({ src, size }: IconProps) => {
  return (
    <div>
      {src ? <img style={{ width: size }} src={src} alt="图标" /> : '选择图标'}
    </div>
  );
};

export default Icon;
