import { MetaData } from '../../materials/interface';
import Container from '../../state';
import EditorWidgetCard, { EditorWidgetList } from './EditorWidgetCard';
import style from './index.module.less';

export interface WidgetMarketListProps {}

const WidgetMarketList = (props: WidgetMarketListProps) => {
  const shareState = Container.useContainer();
  const handleLoadMore = () => shareState.loadMoreWidgets();
  return (
    <div>
      <EditorWidgetList>
        {shareState.widgets.map((widget) => {
          const meta: MetaData = {
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
          };
          return <EditorWidgetCard key={widget.name} metadata={meta} />;
        })}
      </EditorWidgetList>
      <div className={style.btnLoadMore} onClick={handleLoadMore}>
        {shareState.loadMoreLoading ? '加载中' : '加载更多'}
      </div>
    </div>
  );
};

export default WidgetMarketList;
