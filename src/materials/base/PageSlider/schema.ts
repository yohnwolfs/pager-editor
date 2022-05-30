import { FormItemType } from '../../enums';
import { Schema } from '../../interface';

const PageSlider: Schema = {
  props: [
    {
      key: 'pageIds',
      name: '管理页面',
      type: FormItemType.MultiplePageSelector,
    },
  ],
  config: {},
};

export default PageSlider;
