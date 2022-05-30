import { widgetService } from '../services';
import { WidgetData } from '../services/interface';
import { useCallback, useEffect, useState } from 'react';

const useWidgets = (): [WidgetData[], () => void, boolean] => {
  const [pageIndex, setPageIndex] = useState(1);
  const [widgets, setWidgets] = useState<WidgetData[]>([]);
  const [loading, setLoading] = useState(false);

  const loadMore = useCallback(() => {
    if (loading) return;
    setLoading(true);
    widgetService
      .getWidgets({ pageSize: 10, pageIndex: pageIndex + 1 })
      .then((res) => {
        if (res.list && res.list.length) {
          setWidgets((widgets) => widgets.concat(res.list));
          setPageIndex(pageIndex + 1);
        }
      })
      .finally(() => setLoading(false));
  }, [pageIndex]);

  useEffect(() => {
    widgetService
      .getWidgets({ pageSize: 10, pageIndex })
      .then((res) => res.list && setWidgets(res.list));
  }, []);

  return [widgets, loadMore, loading];
};

export default useWidgets;
