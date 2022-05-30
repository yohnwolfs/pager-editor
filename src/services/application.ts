import { AppData } from '../core/interface';
import { downloadContent } from '../utils';
import request from './request';

const scope = 'application';

export const downloadCode = (appData: AppData) => {
  return request(`${scope}/downloadCode`, {
    method: 'POST',
    data: appData,
    responseType: 'arraybuffer',
  }).then((res: any) => {
    downloadContent(res, 'project.zip');
    return res;
  });
};
