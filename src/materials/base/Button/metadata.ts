import config from '../../../config';
const thumb = require('./thumb.png');

const metadata = {
  ...config.baseMaterialConfig,
  name: 'Button',
  displayName: '按钮组件',
  group: 'base',
  img: thumb,
  w: 36,
  h: 20,
};

export default metadata;
