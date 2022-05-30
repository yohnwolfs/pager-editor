import { AudioHTMLAttributes } from 'react';
import { ViewProps } from '../../../core/interface';

interface AudioProps extends AudioHTMLAttributes<Element>, ViewProps {}

/**
 * 媒体组件 - 音频
 * @param props
 * @returns
 */
const Audio = ({ superData, src, ...restProps }: AudioProps) => {
  return (
    <div>
      {src ? (
        <audio src={src} {...restProps}>
          <p>
            你的浏览器不支持 HTML5 音频。可点击<a href={src}>此链接</a>查看
          </p>
        </audio>
      ) : (
        '选择音频'
      )}
    </div>
  );
};

export default Audio;
