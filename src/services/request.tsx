/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { notification } from 'antd';
import auth0Client from './auth0Client';
import axios from 'axios';

const codeMessage: any = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

const throttle = (func: any, timeout: number = 1000) => {
  let timer: any;

  return () => {
    if (timer) {
      return;
    }
    timer = setTimeout(() => {
      func();
      timer = null;
    }, timeout);
  };
};

const throttleAuthNotification = throttle(() => {
  auth0Client.clearToken();
  notification.error({
    message: '身份认证过期，正在重新登录',
  });
  setTimeout(() => window.location.reload(), 1000);
});

let api = axios.create({
  baseURL: '/pager-editor/api/',
  timeout: 1000,
  withCredentials: true,
});

/**
 * 统一返回格式处理
 */
api.interceptors.response.use(
  async (response) => {
    if (response.data?.code === undefined) return response.data;
    if (response.data.code === 0) return response?.data?.data;
    else throw new Error(response.data.message);
  },
  (error) => {
    const { response } = error;
    const { data } = response || {};

    if (response && response.status) {
      const errorText =
        data?.message || codeMessage[response?.status] || response?.statusText;
      const { status, url } = response;

      if (status === 401) {
        throttleAuthNotification();
        return;
      }

      notification.error({
        message: errorText,
        description: (
          <div>
            <p style={{ marginBottom: '0' }}>{`状态：${status}`}</p>
            <p style={{ marginBottom: '0' }}>{`地址: ${url}`}</p>
          </div>
        ),
      });
    } else if (!response) {
      notification.error({
        description: '您的网络发生异常，无法连接服务器',
        message: '网络异常',
      });
    }

    return Promise.reject(response?.statusText);
  },
);

api.interceptors.request.use((async (config: any) => {
  const token = auth0Client.token;

  const headers = token
    ? {
        headers: { authorization: 'Bearer ' + token },
      }
    : {};

  return { ...config, ...headers };
}) as any);

export default api;
