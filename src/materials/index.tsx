import {
  BankOutlined,
  PieChartOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { metadata as BaseMetadata, schema as BaseSchema } from './base';
import { metadata as MediaMetadata, schema as MediaSchema } from './media';
import { MaterialGroup } from './enums';
import { MaterialMenu } from './interface';

/**
 * 物料分组
 */
export const MaterialGroups = [
  MaterialGroup.Base,
  MaterialGroup.Media,
  MaterialGroup.Chart,
  MaterialGroup.Market,
];

/**
 * 物料Schema汇总
 */
export const MaterialSchema = {
  ...BaseSchema,
  ...MediaSchema,
};

/**
 * 物料Metadata汇总
 */
export const MaterialMetadata = {
  ...BaseMetadata,
  ...MediaMetadata,
};

/**
 * 物料菜单数据
 */
export const materialMenuData: MaterialMenu[] = [
  {
    group: MaterialGroup.Base,
    displayName: '基础',
    icon: <BankOutlined />,
    data: Object.keys(BaseMetadata).map((key) => BaseMetadata[key]),
  },
  {
    group: MaterialGroup.Media,
    displayName: '媒体',
    icon: <PlayCircleOutlined />,
    data: Object.keys(MediaMetadata).map((key) => MediaMetadata[key]),
  },
  {
    group: MaterialGroup.Chart,
    displayName: '图表',
    icon: <PieChartOutlined />,
    data: [],
  },
];
