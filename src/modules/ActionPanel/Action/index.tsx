import {
  ActionTypeMap,
  EventTypeMap,
  VarAssign,
  ViewAction,
} from '../../../core/interface';
import React, { useLayoutEffect, useState } from 'react';
import style from './index.module.less';
import { Input, Select } from '@phoenixs/form-components';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { VarSetter } from '../../../components/VarSelector';
import { classnames } from '../../../utils';

export interface ActionProps {
  value?: ViewAction;
  active?: boolean;
  onChange?: (v?: ViewAction) => void;
  onClick?: (e: React.MouseEvent) => void;
}

export interface CommonFormProps<T> {
  value?: T;
  onChange?: (v?: T) => void;
  [key: string]: any;
}

/**
 * 动作表单
 * @param props
 * @returns
 */
export const Action = ({ value, active, onChange, onClick }: ActionProps) => {
  const { event, type, ...restValue } = value || {};

  const handleEventChange = (event: string) => {
    onChange && onChange(value && { ...value, event: event as any });
  };
  const handleTypeChange = (type: string) => {
    onChange && onChange(value && { ...value, type: type as any });
  };
  const handleDFormChange = (v: any) => {
    onChange && onChange(value && { ...value, ...v });
  };
  // const handleRemove = () => {
  //   onRemove && onRemove();
  // };

  /** 动态表单 */
  const DForm = value ? FormMap[value.type] : () => {};

  return (
    <div
      className={classnames(style.action, active ? style.active : '')}
      onClick={onClick}
    >
      <div className={style.common}>
        <Select<string>
          value={value?.event}
          options={Object.keys(EventTypeMap).map((key) => ({
            key: key,
            value: key,
            label: EventTypeMap[key],
          }))}
          style={{ width: 120, marginRight: 8 }}
          onChange={handleEventChange}
        />
        <Select<string>
          value={value?.type}
          options={Object.keys(ActionTypeMap).map((key) => ({
            key: key,
            value: key,
            label: ActionTypeMap[key],
          }))}
          style={{ width: 100 }}
          onChange={handleTypeChange}
        />
      </div>
      <div className={style.body}>
        <DForm value={restValue} onChange={handleDFormChange} />
      </div>
    </div>
  );
};

/** 跳转链接表单 */
const UrlForm = ({ value, onChange }: CommonFormProps<{ url?: string }>) => {
  const [innerValue, setInnerValue] = useState(value?.url);
  useLayoutEffect(() => {
    value?.url !== innerValue && setInnerValue(value?.url);
  }, [value?.url]);
  return (
    <Input
      placeholder="请输入链接地址"
      value={innerValue}
      onChange={(e) => setInnerValue(e.target.value)}
      onBlur={(e) => onChange && onChange({ url: innerValue })}
    />
  );
};

/** 赋值变量表单 */
const VarsForm = ({
  value,
  onChange,
}: CommonFormProps<{ vars: VarAssign[] | undefined }>) => {
  const [innerValue, setInnerValue] = useState(value?.vars);
  const handleChange = (index: number, fvalue: Partial<VarAssign>) => {
    const res = {
      vars: innerValue?.map((item, i) =>
        i === index ? { ...item, ...fvalue } : item,
      ),
    };
    onChange && onChange(res);
  };
  const handleAddRow = () => {
    const res: { vars: VarAssign[] | undefined } = {
      vars: [
        ...(innerValue || []),
        { id: undefined as any, name: undefined as any, value: undefined },
      ],
    };
    onChange && onChange(res);
  };
  const handleRemoveRow = (index: number) => {
    const res: { vars: VarAssign[] | undefined } = {
      vars: innerValue?.filter((item, i) => i !== index),
    };
    onChange && onChange(res);
  };
  useLayoutEffect(() => {
    setInnerValue(value?.vars);
  }, [value?.vars]);
  return (
    <div className={style.varsForm}>
      {value?.vars?.map((item, index) => (
        <div key={index} className={style.varsFormRow}>
          <VarSetter
            value={item}
            onChange={(v) => v && handleChange(index, v)}
          />
          <CloseOutlined
            style={{ padding: '0 8px' }}
            onClick={() => handleRemoveRow(index)}
          />
        </div>
      ))}
      <div className={style.btnAdd} onClick={handleAddRow}>
        <PlusOutlined style={{ marginRight: 4 }} />
        添加变量赋值
      </div>
    </div>
  );
};

/** 请求接口表单 */
const RequestForm = () => {
  return <></>;
};

/** 自定义脚本表单 */
const ScriptForm = () => {
  return <></>;
};

/** 表单映射 */
const FormMap: Record<string, any> = {
  link: UrlForm,
  vars: VarsForm,
  request: RequestForm,
  script: ScriptForm,
};
