import { VarAssign, VarType } from '../../core/interface';
import { CSSProperties, useLayoutEffect, useMemo, useState } from 'react';
import gstyle from './index.module.less';
import { Input, InputNumber, Switch } from '@phoenixs/form-components';
import Container from '../../state';
import { Controlled } from 'react-codemirror2';
import { DoubleRightOutlined } from '@ant-design/icons';
import { useDebounceFunc } from '../../hooks';
import VarSelector from './VarSelector';

export interface VarSetterProps {
  value?: VarAssign;
  style?: CSSProperties;
  onChange?: (v?: VarAssign) => void;
}

/**
 * 变量赋值器
 * @param props
 * @returns
 */
const VarSetter = ({ style, value, onChange }: VarSetterProps) => {
  const shareState = Container.useContainer();
  const [varId, setVarId] = useState(value?.id);
  const [varValue, setVarValue] = useState(value?.value);
  const [varName, setVarName] = useState(value?.name);
  const [varType, setVarType] = useState<string>();

  const debounceChange = useDebounceFunc(onChange ? onChange : () => {}, 1000);

  const FormComponent = useMemo(
    () => varType && (VarSetterFormMap[varType] || Input),
    [varType],
  );

  useLayoutEffect(() => {
    if (!value) return;
    value.id !== varId && setVarId(value.id);
    value.value !== varValue && setVarValue(value.value);
    value.name !== varName && setVarName(value.name);
    const res = shareState.vars.find((v) => v.id === value.id);
    if (res && res.type !== varType) setVarType(res.type);
    else if (!res) setVarType(undefined);
  }, [value?.id, value?.value, value?.name]);

  return (
    <div style={style} className={gstyle.varSetter}>
      <VarSelector
        value={varId}
        style={{ width: 120, marginRight: 8 }}
        onChange={(v, option) => {
          const res = shareState.vars.find((va) => va.id === v);
          if (res) {
            onChange && onChange({ id: v, name: res.name, value: res.value });
          }
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
      <div style={{ flex: 1, minWidth: 100 }}>
        {FormComponent && (
          <FormComponent
            value={varValue}
            onChange={(v: any) => {
              setVarValue(v);
              varId && debounceChange({ id: varId, value: v });
            }}
          />
        )}
      </div>
    </div>
  );
};

/** 字符串编辑器 */
const StringEditor = (props: any) => {
  return (
    <Input
      {...props}
      onChange={(e) => {
        props.onChange && props.onChange(e.target.value);
      }}
    />
  );
};

/** 数字编辑器 */
const NumberEditor = ({ value, ...restProps }: any) => {
  return (
    <InputNumber value={isNaN(Number(value)) ? 0 : value} {...restProps} />
  );
};

/** 布尔值编辑器 */
const BooleanEditor = (props: any) => {
  return (
    <Switch<boolean>
      width={100}
      options={[
        { label: '是', value: true },
        { label: '否', value: false },
      ]}
      {...props}
    />
  );
};

/** 代码编辑器 */
interface CodeEditorProps {
  type: VarType;
  value?: string;
  onChange?: (v: any) => void;
}
const CodeEditor = ({ value, onChange, type }: CodeEditorProps) => {
  const [innerValue, setInnerValue] = useState<string | undefined>('');
  const [error, setError] = useState<string>();
  useLayoutEffect(() => {
    setInnerValue(value);
  }, [value]);
  return (
    <div>
      <Controlled
        value={innerValue || ''}
        options={{
          mode: 'application/javascript',
          theme: 'material',
          lineNumbers: true,
          smartIndent: true,
          tabSize: 2,
        }}
        onBlur={(editor, event) => {
          const curValue = editor.getValue();
          try {
            if (type === 'object') {
              const obj = JSON.parse(curValue);
              obj instanceof Object && onChange && onChange(curValue);
            } else if (type === 'array') {
              const array = JSON.parse(curValue);
              array instanceof Array && onChange && onChange(curValue);
            }
          } catch (e) {
            setError('格式不正确');
          }
        }}
        onBeforeChange={(_, __, value) => {
          setError(undefined);
          setInnerValue(value);
        }}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

/** 对象编辑器 */
const ObjectEditor = (props: any) => {
  return <CodeEditor type="object" {...props} />;
};

/** 数组编辑器 */
const ArrayEditor = (props: any) => {
  return <CodeEditor type="array" {...props} />;
};

/** 数组编辑器 */

const VarSetterFormMap: Record<string, any> = {
  string: StringEditor,
  number: NumberEditor,
  boolean: BooleanEditor,
  object: ObjectEditor,
  array: ArrayEditor,
};

export default VarSetter;
