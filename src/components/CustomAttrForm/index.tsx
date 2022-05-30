import { Schema } from '../../materials/interface';
import { Form, FormInstance } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import {
  Input,
  InputNumber,
  Switch,
  ColorPicker,
  IconSelector,
  AudioSelector,
  VideoSelector,
  Select,
} from '@phoenixs/form-components';
import { MultiplePageSelector, PageSelector } from '../PageSelector';
import { FormItemType } from '../../materials/enums';
import { useDebounceFunc } from '../../hooks';

export interface CustomAttrFormProps {
  form: FormInstance;
  schema?: Schema;
  onValuesChange?: (changedValues: any, values: any) => void;
}

/**
 * 组件自定义配置的表单
 * @param props
 * @returns
 */
const CustomAttrForm = ({
  form,
  schema,
  onValuesChange,
}: CustomAttrFormProps) => {
  const handleValuesChange = useDebounceFunc(onValuesChange || (() => {}), 500);

  return (
    <Form form={form} onValuesChange={handleValuesChange}>
      {schema?.props.map(({ key, name, type, options }) => {
        const Component = FormItemMaps[type];
        const optionsProps = options ? { options } : {};
        return (
          <FormItem
            key={key}
            name={key}
            label={name}
            colon={false}
            labelCol={{ span: name.length < 3 ? 5 : 5 }}
          >
            <Component {...optionsProps} />
          </FormItem>
        );
      })}
    </Form>
  );
};

const FormItemMaps: Record<FormItemType, any> = {
  [FormItemType.Input]: Input,
  [FormItemType.InputNumber]: InputNumber,
  [FormItemType.Switch]: Switch,
  [FormItemType.ColorPicker]: ColorPicker,
  [FormItemType.Select]: Select,
  [FormItemType.DatePicker]: Input,
  [FormItemType.PageSelector]: PageSelector,
  [FormItemType.MultiplePageSelector]: MultiplePageSelector,
  [FormItemType.IconSelector]: IconSelector,
  [FormItemType.AudioSelector]: AudioSelector,
  [FormItemType.VideoSelector]: VideoSelector,
};

export default CustomAttrForm;
