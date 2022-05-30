import { AppData, PageData } from './core/interface';

export const saveAppData = (data?: AppData) => {
  if (!data) return;
  localStorage.setItem('appData', JSON.stringify(data));
};

export const saveCurrentPageData = (data?: PageData) => {
  if (!data) return;
  localStorage.setItem('currentPageData', JSON.stringify(data));
};

export const getAppData = () => {
  return localStorage.getItem('appData');
};

export const getCurrentPageData = () => {
  return localStorage.getItem('currentPageData');
};
