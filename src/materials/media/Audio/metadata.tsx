import config from '../../../config';
const thumb = require('./thumb.png');

const metadata = {
  ...config.baseMaterialConfig,
  name: 'Audio',
  displayName: '音频组件',
  group: 'media',
  img: thumb,
  w: 100,
  h: 36,
};

export default metadata;
