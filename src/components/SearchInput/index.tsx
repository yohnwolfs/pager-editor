import { SearchOutlined } from '@ant-design/icons';
import { Input, InputProps } from 'antd';
import style from './index.module.less';

interface SearchInputProps extends InputProps {
  showBottomLine?: boolean;
}

/**
 * 搜索框
 * @param props
 * @returns
 */
const SearchInput = (props: SearchInputProps) => {
  const { showBottomLine = true, ...inputProps } = props;
  return (
    <div
      className={
        style.searchInput + ' ' + (showBottomLine ? style['bottomLine'] : '')
      }
    >
      <Input
        prefix={<SearchOutlined style={{ fontSize: 16, marginRight: 8 }} />}
        bordered={false}
        placeholder="搜索..."
        allowClear
        {...inputProps}
      />
    </div>
  );
};

export default SearchInput;
