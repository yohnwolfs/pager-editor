import { Schema } from '../../../materials/interface';
import { FormItemType } from '../../enums';

const Button: Schema = {
  props: [
    {
      key: 'src',
      name: '图标',
      type: FormItemType.IconSelector,
    },
    {
      key: 'size',
      name: '大小',
      type: FormItemType.InputNumber,
    },
  ],
  config: {
    size: 32,
  },
};

export default Button;
