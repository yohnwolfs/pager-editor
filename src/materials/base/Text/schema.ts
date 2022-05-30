import { Schema } from '../../../materials/interface';
import { FormItemType } from '../../enums';

const Text: Schema = {
  props: [
    {
      key: 'text',
      name: '文本',
      type: FormItemType.Input,
    },
    {
      key: 'fontSize',
      name: '字体大小',
      type: FormItemType.InputNumber,
    },
    {
      key: 'fontColor',
      name: '字体颜色',
      type: FormItemType.ColorPicker,
    },
  ],
  config: {},
};

export default Text;
