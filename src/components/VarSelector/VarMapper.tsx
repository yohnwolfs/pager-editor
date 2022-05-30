import {
  CloseOutlined,
  DoubleRightOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Form } from 'antd';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { VarMap } from '../../core/interface';
import { useDebounceFunc } from '../../hooks';
import { Input } from '@phoenixs/form-components';
import gstyle from './index.module.less';
import VarSelector from './VarSelector';

export interface VarMapperProps {
  value?: Partial<VarMap>;
  style?: React.CSSProperties;
  onChange?: (v?: Partial<VarMap>) => void;
  onRemove?: () => void;
}

/**
 * 变量映射
 * @param props
 * @returns
 */
export const VarMapper = ({
  value,
  onChange,
  onRemove,
  style,
}: VarMapperProps) => {
  const [varId, setVarId] = useState(value?.id);
  const [varName, setVarName] = useState(value?.name);
  const [varProp, setVarProp] = useState(value?.prop);

  useLayoutEffect(() => {
    if (!value) return;
    value.id !== varId && setVarId(value.id);
    value.name !== varName && setVarName(value.name);
    value.prop !== varProp && setVarProp(value.prop);
  }, [value?.id, value?.prop, value?.name]);

  return (
    <div style={style} className={gstyle.varMapper}>
      <VarSelector
        value={varId}
        style={{ width: 100, marginRight: 8 }}
        onChange={(v, option) => {
          setVarId(v);
          setVarName(option.name);
          onChange && onChange({ id: v, name: option.name, prop: varProp });
        }}
      />
      <div
        style={{
          height: 26,
          marginRight: 8,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <DoubleRightOutlined />
      </div>
      <div style={{ flex: 1, minWidth: 10 }}>
        <Input
          value={varProp}
          onChange={(e) => {
            setVarProp(e.target.value);
            onChange &&
              onChange({ id: varId, name: varName, prop: e.target.value });
          }}
        />
      </div>
      <div style={{ margin: '0 8px' }} onClick={() => onRemove && onRemove()}>
        <CloseOutlined />
      </div>
    </div>
  );
};

export interface VarMappersProps {
  value?: VarMap[];
  style?: React.CSSProperties;
  onChange?: (v?: VarMap[]) => void;
}
export const VarMappers = ({ value, onChange, style }: VarMappersProps) => {
  const [form] = Form.useForm();
  const handleChange = (v?: VarMap[]) => onChange && onChange(v);
  const debounceChange = useDebounceFunc(handleChange, 500);

  useEffect(() => {
    form.setFieldsValue({ varMaps: value });
  }, [value]);

  return (
    <Form
      form={form}
      component={false}
      onValuesChange={(changedValue, value) => {
        debounceChange(value?.varMaps);
      }}
    >
      <Form.List name="varMaps">
        {(fields, { add, remove }, { errors }) => {
          return (
            <div className={gstyle.varMappers} tabIndex={0}>
              {fields.map((field, index) => (
                <Form.Item {...field}>
                  <VarMapper onRemove={() => remove(index)} />
                </Form.Item>
              ))}
              <div
                className={gstyle.btnAdd}
                onClick={() => add({ id: undefined, prop: undefined })}
              >
                <PlusOutlined style={{ marginRight: 4 }} />
                添加映射
              </div>
            </div>
          );
        }}
      </Form.List>
    </Form>
  );
};
