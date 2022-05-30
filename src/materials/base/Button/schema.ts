import { Schema } from '../../../materials/interface';
import { FormItemType } from '../../enums';

const Button: Schema = {
  props: [
    {
      key: 'text',
      name: '文本',
      type: FormItemType.Input,
    },
    {
      key: 'type',
      name: '类型',
      type: FormItemType.Select,
      options: [
        { label: '基本', value: 'primary' },
        { label: '虚线', value: 'dashed' },
        { label: '链接', value: 'link' },
        { label: '幽灵', value: 'ghost' },
        { label: '文本', value: 'text' },
      ],
    },
    {
      key: 'shape',
      name: '形状',
      type: FormItemType.Select,
      options: [
        { label: '圆形', value: 'circle' },
        { label: '圆角', value: 'round' },
        { label: '默认', value: 'default' },
      ],
    },
    {
      key: 'size',
      name: '大小',
      type: FormItemType.Select,
      options: [
        { label: '大', value: 'large' },
        { label: '中', value: 'middle' },
        { label: '小', value: 'small' },
      ],
    },
    {
      key: 'danger',
      name: '危险类型',
      type: FormItemType.Switch,
    },
  ],
  config: { danger: false, text: '按 钮' },
};

export default Button;
