import { Select } from '@phoenixs/form-components';
import Container from '../../state';
import { SelectProps } from '@phoenixs/form-components/dist/Select';

export interface VarSelectorProps
  extends Omit<SelectProps<string>, 'onChange'> {
  value?: string;
  onChange?: (
    v: string,
    option: {
      type: string;
      key: string;
      name: string;
      value: string;
      lable: string;
    },
  ) => void;
}

// interface OptionType {
//   key: string;
//   value: string;
//   label: string;
//   type: string;
// }

/**
 * 变量选择器
 * @param props
 * @returns
 */
const VarSelector = ({ value, onChange, ...restProps }: VarSelectorProps) => {
  const shareState = Container.useContainer();
  const options = shareState.vars.map((v) => ({
    key: v.id,
    value: v.id,
    name: v.name,
    label: v.displayName || v.name,
    type: v.type,
  }));

  return (
    <Select<string>
      value={value}
      options={options}
      onChange={(v, option: any) =>
        onChange && onChange(v, { ...option, type: option.type })
      }
      placeholder="选择变量"
      {...restProps}
    />
  );
};

export default VarSelector;
