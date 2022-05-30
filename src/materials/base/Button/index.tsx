import { Button as AntdButton, ButtonProps as AntdButtonProps } from 'antd';
import { ViewProps } from '../../../core/interface';

interface ButtonProps extends AntdButtonProps, ViewProps {
  text?: string;
}

/**
 * 基础组件 - 按钮组件
 * @param props
 * @returns
 */
const Button = ({ superData, ...props }: ButtonProps) => {
  return <AntdButton {...props}>{props.text}</AntdButton>;
};

export default Button;
