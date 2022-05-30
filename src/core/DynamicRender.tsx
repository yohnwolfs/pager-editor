import { useMemo } from 'react';
import { ViewData } from './interface';
import { RemoteComponent } from './RemoteComponent';
import WebRenderStateContainer from './WebRender/state';
import GlobalStateContainer from '../state';
import Loadable from '../plugins/ReactLoadable';

interface DynamicRenderProps {
  data: ViewData;
  renderer: 'web' | 'editor';
  extraProps?: Record<string, any>;
}

/**
 * 动态组件渲染器
 * @param props
 * @returns
 */
const DynamicRender = (props: DynamicRenderProps) => {
  const {
    data: { item },
    extraProps,
    renderer,
  } = props;
  const { name, group, config, remote, url } = item;

  const LocalComponent = useMemo(() => {
    const Inner = Loadable({
      loader: () => import(`../materials/${group}/${name}`),
      loading: () => <div>loading</div>,
    });
    return Inner;
  }, [group, name]);

  const Component: any = useMemo(
    () => (remote ? RemoteComponent : LocalComponent),
    [LocalComponent, remote],
  );

  return remote && url ? (
    <Component
      superData={props.data}
      renderer={renderer}
      url={url}
      {...config}
      {...extraProps}
    />
  ) : (
    <Component
      superData={props.data}
      renderer={renderer}
      {...config}
      {...extraProps}
    />
  ); // 约定往动态组件传入固定prop：superData
};

/**
 * 包含状态映射的动态组件渲染器
 * @param props
 */
export const DynamicRenderWithState = (props: DynamicRenderProps) => {
  const {
    data: { varMaps },
    extraProps,
  } = props;
  const shareState = GlobalStateContainer.useContainer();
  // 关联的变量输入
  const relateStateProps = useMemo(() => {
    return varMaps?.reduce(
      (acc, item) => ({
        ...acc,
        [item['prop']]: shareState.varsObj[item['id']],
      }),
      {},
    );
  }, [varMaps, shareState.varsObj]);

  return (
    <DynamicRender
      {...props}
      extraProps={{ ...relateStateProps, ...extraProps }}
    />
  );
};

/**
 * 实际部署后使用的渲染器
 * @param props
 * @returns
 */
export const DynamicWebRender = (props: DynamicRenderProps) => {
  const {
    data: { varMaps, actions },
    extraProps,
  } = props;
  const renderState = WebRenderStateContainer.useContainer();
  // 关联的变量输入
  const relateStateProps = useMemo(() => {
    return varMaps?.reduce(
      (acc, item) => ({
        ...acc,
        [item['prop']]: renderState.vars[item['id']],
      }),
      {},
    );
  }, [varMaps, renderState.vars]);

  const actionProps = useMemo(() => {
    return actions?.reduce(
      (acc, item) => ({
        [item.event]: () => {
          const varSetters =
            item.type === 'vars'
              ? item.vars?.reduce(
                  (acc, item) => ({ ...acc, [item.id]: item.value }),
                  {},
                )
              : null;
          renderState.setVars((vars) => ({ ...vars, ...varSetters }));
        },
      }),
      {},
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions]);

  return (
    <DynamicRender
      {...props}
      extraProps={{ ...relateStateProps, ...actionProps, ...extraProps }}
    />
  );
};

export default DynamicRender;
