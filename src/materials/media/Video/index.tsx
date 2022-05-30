import { VideoHTMLAttributes } from 'react';
import { ViewProps } from '../../../core/interface';

interface VideoProps extends VideoHTMLAttributes<Element>, ViewProps {}

/**
 * 媒体组件 - 视频
 * @param props
 * @returns
 */
const Video = ({ superData, src, ...restProps }: VideoProps) => {
  return (
    <div>
      {src ? (
        <video width="100%" src={src} {...restProps}>
          <p>
            你的浏览器不支持 HTML5 视频。可点击<a href={src}>此链接</a>观看
          </p>
        </video>
      ) : (
        '选择视频'
      )}
    </div>
  );
};

export default Video;
