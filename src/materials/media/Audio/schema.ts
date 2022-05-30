import { Schema } from '../../../materials/interface';
import { FormItemType } from '../../enums';

const Audio: Schema = {
  props: [
    {
      key: 'src',
      name: '音频',
      type: FormItemType.AudioSelector,
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

export default Audio;
