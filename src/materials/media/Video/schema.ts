import { Schema } from '../../../materials/interface';
import { FormItemType } from '../../enums';

const Video: Schema = {
  props: [
    {
      key: 'src',
      name: '视频',
      type: FormItemType.VideoSelector,
    },
    {
      key: 'controls',
      name: '可控制',
      type: FormItemType.Switch,
    },
    {
      key: 'autoPlay',
      name: '自动播放',
      type: FormItemType.Switch,
    },
    {
      key: 'loop',
      name: '循环',
      type: FormItemType.Switch,
    },
    {
      key: 'muted',
      name: '静音',
      type: FormItemType.Switch,
    },
  ],
  config: {
    controls: true,
  },
};

export default Video;
