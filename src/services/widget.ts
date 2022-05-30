import request from './request';
import { PaginationResult, WidgetData, WidgetTag } from './interface';
import config from '../config';
import { Schema } from '../materials/interface';

const scope = 'widget';

interface ServerWidgetData extends Omit<WidgetData, 'schema'> {
  schema: string;
}

/**
 * 获取组件详情
 * @param id
 * @returns
 */
export const getWidget = (id: string) => {
  return request
    .get<ServerWidgetData, ServerWidgetData>(`${scope}/${id}`)
    .then((res) => {
      let decodedSchema: Schema;
      try {
        decodedSchema = JSON.parse(res.schema);
      } catch (e) {
        decodedSchema = { props: [], config: {} };
      }
      return {
        ...res,
        code: res.code && config.publicPath + res.code,
        cover: res.cover && config.publicPath + res.cover,
        schema: decodedSchema,
      };
    });
};

/**
 * 获取组件列表
 * @param params
 * @returns
 */
export const getWidgets = (params?: {
  keyword?: string;
  pageSize?: number;
  pageIndex?: number;
}) => {
  if (params?.keyword === '') delete params.keyword;
  return request
    .get<
      PaginationResult<ServerWidgetData>,
      PaginationResult<ServerWidgetData>
    >(`${scope}`, {
      params: params,
    })
    .then((res) => {
      return {
        ...res,
        list: res?.list?.map((item) => {
          let decodedSchema: Schema;
          try {
            decodedSchema = JSON.parse(item.schema);
          } catch (e) {
            decodedSchema = { props: [], config: {} };
          }
          return {
            ...item,
            code: item.code && config.publicPath + item.code,
            cover: item.cover && config.publicPath + item.cover,
            schema: decodedSchema,
          };
        }),
      } as PaginationResult<WidgetData>;
    });
};

/**
 * 获取组件标签
 * @returns
 */
export const getAllWidgetTags = () => {
  return request.get<WidgetTag[]>(`${scope}/tags`);
};

/**
 * 创建组件
 * @param dto
 * @returns
 */
export const createWidget = (dto: Omit<WidgetData, 'id'> & any) => {
  const toSubmit = new FormData();

  Object.keys(dto).forEach((key) => {
    !(dto[key] == null) && toSubmit.append(key, dto[key]);
  });

  return request(`${scope}`, {
    method: 'POST',
    headers: { contentType: 'multipart/form-data' },
    data: toSubmit,
  });
};

/**
 * 更新组件
 * @param id
 * @param dto
 * @returns
 */
export const updateWidget = (id: string, dto: Omit<WidgetData, 'id'> & any) => {
  const toSubmit = new FormData();

  Object.keys(dto).forEach((key) => {
    !(dto[key] == null) && toSubmit.append(key, dto[key]);
  });

  return request(`${scope}/info/${id}`, {
    method: 'PATCH',
    headers: { contentType: 'multipart/form-data' },
    data: toSubmit,
  });
};

/**
 * 删除组件
 * @param id
 * @returns
 */
export const deleteWidget = (id: string) => {
  return request(`${scope}/${id}`, {
    method: 'DELETE',
  });
};
