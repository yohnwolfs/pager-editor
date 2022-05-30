import { Form, FormInstance } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { Store } from 'antd/lib/form/interface';
import React from 'react';
import {
  ColorPicker,
  Select,
  Input,
  InputNumber,
  InputTextArea,
} from '@phoenixs/form-components';
import { VarSelector } from '../components/VarSelector';
import { MethodMap, VarTypeMap } from '../core/interface';

/**
 * 页面设置
 * @param props
 * @returns
 */
export const PageSetting = () => {
  return (
    <>
      <FormItem name="name" label="名称" colon={false} labelCol={{ span: 5 }}>
        <Input autoFocus />
      </FormItem>
      <FormItem
        name="displayName"
        label="展示名"
        colon={false}
        labelCol={{ span: 5 }}
      >
        <Input />
      </FormItem>
      <FormItem
        name="backgroundColor"
        label="背景色"
        colon={false}
        initialValue="#fff"
        labelCol={{ span: 5 }}
      >
        <ColorPicker />
      </FormItem>
      <FormItem name="width" label="宽度" colon={false} labelCol={{ span: 5 }}>
        <InputNumber />
      </FormItem>
      <FormItem name="height" label="高度" colon={false} labelCol={{ span: 5 }}>
        <InputNumber />
      </FormItem>
    </>
  );
};

/** 修改组件名称表单 */
export const ChangeItemName = () => (
  <FormItem name="name" rules={[{ required: true, message: '请输入名称' }]}>
    <Input placeholder="组件名称" autoFocus />
  </FormItem>
);

/** 新增状态变量 */
const StatusVarTypeOptions = Object.keys(VarTypeMap).map((type) => ({
  key: type,
  value: type,
  label: VarTypeMap[type],
}));
export const AddStatusVar = () => (
  <>
    <FormItem
      name="name"
      label="变量名"
      labelCol={{ span: 5 }}
      rules={[{ required: true, message: '请输入名称' }]}
    >
      <Input placeholder="变量名" autoFocus />
    </FormItem>
    <FormItem name="displayName" label="展示名" labelCol={{ span: 5 }}>
      <Input placeholder="展示名" />
    </FormItem>
    <FormItem
      name="type"
      label="类型"
      labelCol={{ span: 5 }}
      validateTrigger="onBlur"
      rules={[
        { required: true, message: '请选择类型' },
        // () => ({
        //   validator(_, value) {
        //     if (
        //       !value ||
        //       ['string', 'number', 'boolean', 'object', 'array'].includes(value)
        //     ) {
        //       return Promise.resolve();
        //     }
        //     return Promise.reject(
        //       new Error('只能填写string/number/boolean/object/array'),
        //     );
        //   },
        // }),
      ]}
    >
      <Select<string> options={StatusVarTypeOptions} placeholder="类型" />
    </FormItem>
    <FormItem name="value" label="默认值" labelCol={{ span: 5 }}>
      <Input />
    </FormItem>
  </>
);

/** 数据源表单 */
export const DataSourceForm = () => (
  <>
    <FormItem name="name" label="名称">
      <Input />
    </FormItem>
  </>
);

const dataSourceMethodOptions = Object.keys(MethodMap).map((key) => ({
  value: key,
  label: MethodMap[key],
}));
export class DataSourceMethodForm extends React.Component<
  {
    initialValues?: any;
    onSubmit?: any;
    onFinish?: any;
  } & React.PropsWithChildren<any>
> {
  formRef = React.createRef<FormInstance>();

  submit() {
    const { onSubmit } = this.props;
    return this.formRef?.current?.validateFields().then((values: any) => {
      onSubmit && onSubmit(values);
    });
  }

  handleFinish = (values: any) => {
    this.props.onSubmit && this.props.onSubmit(values);
    this.props.onFinish && this.props.onFinish(values);
  };

  componentDidMount = () => {
    if (this.props.initialValues)
      this.formRef.current?.setFieldsValue(this.props.initialValues);
  };

  render() {
    return (
      <Form ref={this.formRef} onFinish={this.handleFinish}>
        {
          ((values: Store) => {
            return (
              <>
                <FormItem name="name" label="名称">
                  <Input />
                </FormItem>
                <FormItem name="method" label="方法">
                  <Select options={dataSourceMethodOptions} />
                </FormItem>
                {values.method !== 'static' ? (
                  <>
                    <FormItem name="url" label="地址">
                      <Input />
                    </FormItem>
                    <FormItem name="data" label="参数">
                      <Input />
                    </FormItem>
                  </>
                ) : (
                  <FormItem name="staticData" label="数据">
                    <Input />
                  </FormItem>
                )}
                <FormItem name="description" label="描述">
                  <InputTextArea />
                </FormItem>
              </>
            );
          }) as any
        }
      </Form>
    );
  }
}

export const DataSourceMethodSavedToVar = () => (
  <div style={{ padding: '16px 16px 24px 16px' }}>
    <FormItem name="savedToVar">
      <VarSelector />
    </FormItem>
  </div>
);
