interface TextProps {
  text: string;
  fontSize: number;
  fontColor: string;
}

/**
 * 基础组件 - 文本组件
 * @param props
 * @returns
 */
const Text = ({ text, fontSize, fontColor }: TextProps) => {
  return <div style={{ fontSize, color: fontColor }}>{text || '输入文字'}</div>;
};

export default Text;
