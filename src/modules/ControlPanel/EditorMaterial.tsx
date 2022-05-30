import { AppstoreOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import React, { useState } from 'react';
import IconButton from '../../components/IconButton';
import Loading from '../../components/Loading';
import SearchInput from '../../components/SearchInput';
import style from './index.module.less';
import { materialMenuData } from '../../materials';
import EditorWidgetCard, { EditorWidgetList } from './EditorWidgetCard';
import WidgetMarketList from './WidgetMarketList';
import { MaterialGroup } from '../../materials/enums';
import { MaterialMetadata } from '../../materials';
import { widgetService } from '../../services';
import { useDebounceFunc } from '../../hooks';
import { MetaData } from '../../materials/interface';
import { WidgetData } from '../../services/interface';

interface MaterialPanelProps {}

/**
 * 素材区
 * @param props
 * @returns
 */
export const MaterialPanel = (props: MaterialPanelProps) => {
  const [searchKey, setSearchKey] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<MetaData[]>([]);
  const showBasicPanel = searching === false && searchKey === '';
  const showSearchResult = searching === false && searchKey !== '';

  const renderTabs = () => {
    return materialMenuData.map((menu) => (
      <Tabs.TabPane
        key={menu.group}
        tab={
          <IconButton text={menu.displayName} inheritColor>
            {menu.icon}
          </IconButton>
        }
      >
        <EditorWidgetList>
          {menu.data.map((item) => (
            <EditorWidgetCard key={item.name} metadata={item} />
          ))}
        </EditorWidgetList>
      </Tabs.TabPane>
    ));
  };

  /** 搜索系统的material */
  const searchSysMaterial = (searchKey: string) => {
    const metadatas = Object.keys(MaterialMetadata).map(
      (key) => MaterialMetadata[key],
    );
    const result = metadatas.filter(
      (metadata) =>
        metadata.name.toLowerCase().includes(searchKey.toLowerCase()) ||
        metadata.displayName?.toLowerCase().includes(searchKey.toLowerCase()),
    );
    return result;
  };

  /** 搜索市场的material */
  const searchMarketMaterial = async (searchKey: string) => {
    const result = await widgetService.getWidgets({ keyword: searchKey });
    return result?.list || [];
  };

  const searchWidgets = useDebounceFunc((key: string) => {
    if (key === '') {
      setSearchKey('');
      setSearching(false);
      return;
    }
    const sysSearchResult = searchSysMaterial(key);
    searchMarketMaterial(key).then((res) => {
      const formatedRes = res?.map((widget) => ({
        name: widget.name,
        displayName: widget.displayName || widget.name,
        version: widget.version,
        group: 'market',
        w: widget.w,
        h: widget.h,
        img: widget.cover,
        remote: true,
        url: widget.code,
        schema: widget.schema,
      }));
      setSearching(false);
      setSearchResults(sysSearchResult.concat(formatedRes));
    });
  }, 1000);

  const handleSearchInput = (e: React.ChangeEvent<any>) => {
    setSearching(true);
    setSearchKey(e.target.value);
    searchWidgets(e.target.value);
  };

  return (
    <div className={style.materialPanel}>
      <SearchInput value={searchKey} onChange={handleSearchInput} />
      {searching && <Loading />}
      {showSearchResult && (
        <EditorWidgetList>
          {searchResults?.map((item) => {
            return <EditorWidgetCard key={item.name} metadata={item} />;
          })}
        </EditorWidgetList>
      )}
      {showBasicPanel && (
        <Tabs
          tabPosition="left"
          size="large"
          defaultActiveKey={MaterialGroup.Base}
          className={style.tabs}
        >
          {renderTabs()}
          <Tabs.TabPane
            key="shop"
            tab={
              <IconButton text="商店" inheritColor>
                <AppstoreOutlined />
              </IconButton>
            }
          >
            <WidgetMarketList />
          </Tabs.TabPane>
        </Tabs>
      )}
    </div>
  );
};
