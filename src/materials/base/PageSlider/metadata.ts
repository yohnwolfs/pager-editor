import config from '../../../config';
import { MetaData } from '../../interface';
const thumb = require('./thumb.png');

const metadata: MetaData = {
  ...config.baseMaterialConfig,
  name: 'PageSlider',
  displayName: '页面幻灯片',
  group: 'base',
  h: 250,
  img: thumb,
};

export default metadata;
