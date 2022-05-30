import { DataSource, PageData, StatusVar } from './core/interface';

const mainPageId = 'MainPage';

export const pageDatas: PageData[] = [
  {
    id: mainPageId,
    name: 'IndexPage',
    displayName: '主页',
    views: [
      {
        id: 'aaa',
        item: {
          version: '0.0.0',
          name: 'Container',
          config: {},
          group: 'base',
          displayName: '容器组件',
        },
        layout: { i: 'aaa', x: 0, y: 0, w: 100, h: 100 },
        actions: [
          { event: 'onClick', type: 'link', url: 'https://baidu.com' },
          {
            event: 'onClick',
            type: 'vars',
            vars: [{ id: 'va', name: 'test', value: 'test' }],
          },
        ],
        children: [
          {
            id: 'sdsd',
            item: {
              version: '0.0.0',
              name: 'Button',
              config: {},
              group: 'base',
              displayName: '按钮',
            },
            layout: { i: 'sdsd', x: 0, y: 0, w: 50, h: 30 },
          },
        ],
      },
    ],
    width: 320,
  },
  {
    id: 'testpage',
    name: 'TestPage',
    displayName: '测试页',
    views: [
      {
        id: 'dsds',
        item: {
          version: '0.0.0',
          name: 'Button',
          config: {},
          group: 'base',
          displayName: '按钮1',
        },
        layout: { i: 'dsds', x: 30, y: 0, w: 20, h: 20 },
      },
    ],
    width: 320,
  },
  {
    id: 'testpage2',
    name: 'TestPagee',
    displayName: '测试页2',
    views: [
      {
        id: 'dsds2',
        item: {
          version: '0.0.0',
          name: 'Button',
          config: {},
          group: 'base',
          displayName: '按钮2',
        },
        layout: { i: 'dsds2', x: 10, y: 0, w: 20, h: 20 },
      },
    ],
    width: 320,
  },
];

export const statusVars: StatusVar[] = [
  {
    id: 'va',
    name: 'test',
    displayName: '变量A',
    type: 'string',
    value: 'testsss',
  },
  {
    id: 'vb',
    name: 'variable B',
    displayName: '变量B',
    type: 'number',
    value: 100,
  },
  {
    id: 'vc',
    name: 'variable C',
    displayName: '变量C',
    type: 'boolean',
    value: true,
  },
  {
    id: 'vd',
    name: 'variable D',
    displayName: '变量D',
    type: 'object',
    value: JSON.stringify({ a: 2 }),
  },
  {
    id: 've',
    name: 'variable E',
    displayName: '变量E',
    type: 'array',
    value: JSON.stringify(['1', 2, 3]),
  },
];

export const dataSources: DataSource[] = [
  {
    id: 'a',
    name: '订单模块',
    methods: [
      {
        id: 'a1',
        method: 'get',
        name: '获取订单列表',
        url: 'https://testprops/getsss',
      },
      {
        id: 'a2',
        method: 'post',
        name: '添加订单',
        url: 'https://testprops/addstet',
        data: { a: 2, b: 2 },
      },
    ],
  },
  {
    id: 'b',
    name: '奖励模块',
    methods: [
      {
        id: 'b1',
        name: '获取奖励列表',
        method: 'get',
        url: 'http://sdfdsf/eee',
      },
      {
        id: 'b2',
        name: '奖品列表',
        method: 'static',
        staticData: [1, 2, 3, 4, 5],
      },
    ],
  },
];
