import { SettingOutlined } from '@ant-design/icons';
import { createFormModal } from '@phoenixs/antd-modal';
import FormItem from 'antd/lib/form/FormItem';
import { ColorPicker, InputNumber, Select } from '@phoenixs/form-components';
import style from './index.module.less';
import { FileUploadSelector } from '@phoenixs/fileupload';
import Container from '../../state';

export interface BoardEditorProps {
  width: number;
  onUpdate?: (values: BoardEditorFormValues) => void;
}

export interface BoardEditorFormValues {
  width: number;
  font: string;
  backgroundColor: string;
  backgroundImage: string;
}

/**
 * 画板编辑
 * @param props
 * @returns
 */
const BoardEditor = (props: BoardEditorProps) => {
  const shareState = Container.useContainer();
  const appId = shareState.getAppData().id;
  const handleSetting = async () => {
    const res = await createFormModal<BoardEditorFormValues>(
      <BoardEditorForm appId={appId} />,
      {
        title: '页面设置',
        width: 300,
      },
      {
        initialValues: {
          width: props.width,
          font: shareState.currentPageData?.style?.font,
          backgroundColor: shareState.currentPageData?.style?.backgroundColor,
          backgroundImage: shareState.currentPageData?.style
            ?.backgroundImage && [
            shareState.currentPageData?.style?.backgroundImage
              ?.replace("url('", '')
              .replace("')", ''),
          ],
        },
      },
    );
    const { backgroundImage } = res;
    const bg =
      backgroundImage && backgroundImage[0]
        ? `url('${backgroundImage[0]}')`
        : undefined;
    res &&
      props.onUpdate &&
      props.onUpdate({
        ...res,
        ...(bg ? { backgroundImage: bg } : {}),
      });
  };

  return (
    <div className={style.boardEditor}>
      页面宽度: {props.width}px
      <SettingOutlined onClick={handleSetting} />
    </div>
  );
};

const fontOptions = [
  { value: 'microsoft yahei', label: '微软雅黑' },
  { value: 'pingfang', label: '苹方' },
];

/**
 * 编辑器表单
 * @returns
 */
const BoardEditorForm = ({ appId }: { appId: string }) => {
  const labelCol = { span: 5 };
  return (
    <>
      <FormItem name="width" label="宽度" labelCol={labelCol}>
        <InputNumber />
      </FormItem>
      <FormItem name="font" label="字体" labelCol={labelCol}>
        <Select options={fontOptions}></Select>
      </FormItem>
      <FormItem name="backgroundColor" label="背景色" labelCol={labelCol}>
        <ColorPicker />
      </FormItem>
      <FormItem name="backgroundImage" label="背景图" labelCol={labelCol}>
        <FileUploadSelector formName={appId} />
      </FormItem>
    </>
  );
};

export default BoardEditor;
