import { useDebounceFunc } from '../../hooks';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Empty } from 'antd';
import Form from 'antd/lib/form';
import { useEffect, useMemo, useState } from 'react';
import { ViewAction, ViewData } from '../../core/interface';
import Container from '../../state';
import { TreeHelper } from '../../utils';
import { Action } from './Action';
import style from './index.module.less';

export interface ActionPanelProps {
  onSave?: (v: ViewAction[]) => void;
}

/**
 * 动作面板
 * @param props
 * @returns
 */
const ActionPanel = ({ onSave }: ActionPanelProps) => {
  const shareState = Container.useContainer();
  const [form] = Form.useForm();
  const [selectedIndex, setSelectedIndex] = useState<number>();

  const handleSave = (v?: ViewAction[]) => {
    onSave && onSave(v || form.getFieldsValue().actions);
  };
  const debounceSave = useDebounceFunc(handleSave, 500);

  const selectedItem = useMemo(() => {
    const tree = new TreeHelper<ViewData>(shareState.viewDatas);
    const view = shareState.selectedItemId
      ? tree.find(shareState.selectedItemId)
      : undefined;
    return view;
  }, [shareState.selectedItemId]);

  useEffect(() => {
    form.setFieldsValue({ actions: selectedItem?.actions });
    setSelectedIndex(undefined);
  }, [selectedItem]);

  return (
    <div
      className={style.actionPanel}
      onClick={() => setSelectedIndex(undefined)}
    >
      <Form
        form={form}
        onValuesChange={(changeValues, v) => debounceSave(v?.actions || [])}
      >
        <Form.List name="actions">
          {(fields, { add, remove }, { errors }) => {
            return (
              <div
                className={style.actionItem}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.keyCode === 8)
                    selectedIndex !== undefined && remove(selectedIndex);
                }}
              >
                <div className={style.header}>
                  <PlusCircleOutlined
                    onClick={() => add({ event: 'onClick', type: 'link' })}
                  />
                  {/* <SaveOutlined onClick={handleSave} /> */}
                </div>
                <div
                  className={style.content}
                  onKeyDown={(e) => e.stopPropagation()}
                >
                  {fields.length ? (
                    fields.map((field, index) => (
                      <Form.Item {...field}>
                        <Action
                          active={selectedIndex === index}
                          onClick={(e) => {
                            setSelectedIndex(index);
                            e.stopPropagation();
                          }}
                        />
                      </Form.Item>
                    ))
                  ) : (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description="暂无交互动作"
                    />
                  )}
                </div>
              </div>
            );
          }}
        </Form.List>
      </Form>
    </div>
  );
};

export default ActionPanel;
