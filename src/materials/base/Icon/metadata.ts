import config from '../../../config';
const thumb = require('./thumb.png');

const metadata = {
  ...config.baseMaterialConfig,
  name: 'Icon',
  displayName: '图标组件',
  group: 'base',
  img: thumb,
  w: 16,
  h: 16,
};

export default metadata;
