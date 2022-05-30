import config from '../../../config';
const thumb = require('./thumb.png');

const metadata = {
  ...config.baseMaterialConfig,
  name: 'Text',
  displayName: '文本组件',
  group: 'base',
  img: thumb,
};

export default metadata;
