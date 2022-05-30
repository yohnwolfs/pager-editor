import config from '../../../config';
const thumb = require('./thumb.png');

const metadata = {
  ...config.baseMaterialConfig,
  name: 'Video',
  displayName: '视频组件',
  group: 'media',
  img: thumb,
  w: 100,
  h: 90,
};

export default metadata;
