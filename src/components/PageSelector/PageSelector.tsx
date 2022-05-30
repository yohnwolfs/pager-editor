import Container from '../../state';
import { Select } from '@phoenixs/form-components';

export interface PageSelectorProps {
  value?: string;
  onChange?: (pageId: string) => void;
}

/**
 * 页面选择器
 * @param props
 * @returns
 */
export const PageSelector = ({ value, onChange }: PageSelectorProps) => {
  const shareState = Container.useContainer();
  const options = shareState.pageDatas
    .filter((page) => page.id !== shareState.currentPageData?.id)
    .map((page) => ({
      key: page.id,
      value: page.id,
      label: page.displayName || page.name,
    }));
  const handleSelect = (v: string) => {
    onChange && onChange(v);
  };
  return (
    <Select<string>
      value={value}
      options={options}
      onChange={handleSelect}
      placeholder="选择页面"
    />
  );
};
