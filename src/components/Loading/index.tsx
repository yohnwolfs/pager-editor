import { Spin } from 'antd';

interface LoadingProps {}

/**
 * 加载组件
 * @param props
 * @returns
 */
const Loading = (props: LoadingProps) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Spin />
    </div>
  );
};

export default Loading;
