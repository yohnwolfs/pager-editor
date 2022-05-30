import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Menu, Item } from 'react-contexify';
import { PageData, StatusVar } from '../core/interface';
import { AddStatusVar, ChangeItemName, PageSetting } from './EditorForm';
import Container from '../state';
import { createFormModal } from '@phoenixs/antd-modal';

export interface EditorMenuProps {
  menuId: string;
}

const iconStyle = { marginRight: 6 };

/**
 * 组件右键菜单
 * @param props
 * @returns
 */
export const EditorItemMenu = ({ menuId }: EditorMenuProps) => {
  const shareState = Container.useContainer();
  return (
    <Menu id={menuId} animation="fade">
      <Item
        onClick={async ({ event, props }) => {
          const res = await createFormModal<{ name: string }>(
            <ChangeItemName />,
            {
              width: 300,
              title: '修改名称',
            },
            {
              initialValues: { name: props?.item.displayName },
            },
          );
          if (!res) return;
          res?.name &&
            shareState.selectedItemId &&
            shareState.updateViewDataName(shareState.selectedItemId, res?.name);
        }}
      >
        <EditOutlined style={iconStyle} />
        修改名称
      </Item>
      <Item
        onClick={({ event, props }) => {
          shareState.removeViewData(props?.id);
          if (props?.id === shareState.selectedItemId)
            shareState.setSelectedItemId(undefined);
        }}
      >
        <DeleteOutlined style={iconStyle} />
        删除
      </Item>
    </Menu>
  );
};

export const EditorPageMenu = ({ menuId }: EditorMenuProps) => {
  const shareState = Container.useContainer();

  return (
    <Menu id={menuId} animation="fade">
      <Item
        onClick={async ({ event, props }) => {
          const pageData = shareState.pageDatas.find(
            (page) => page.id === props,
          ) as PageData;
          const { name, displayName, width, height } = pageData;
          const res = await createFormModal<{
            name: string;
            backgroundColor: string;
            width: number;
            height: number;
          }>(
            <PageSetting />,
            {
              width: 300,
              title: '编辑页面',
            },
            {
              initialValues: {
                name,
                displayName,
                width,
                height,
              },
            },
          );
          if (!res) return;
          shareState.updatePageData(props, res);
        }}
      >
        <EditOutlined style={iconStyle} />
        编辑
      </Item>
      <Item onClick={({ event, props }) => shareState.removePageData(props)}>
        <DeleteOutlined style={iconStyle} />
        删除
      </Item>
    </Menu>
  );
};

export const EditorVarMenu = ({ menuId }: EditorMenuProps) => {
  const shareState = Container.useContainer();

  return (
    <Menu id={menuId} animation="fade">
      <Item
        onClick={async ({ event, props }) => {
          const { name, displayName, type, value } = shareState.vars.find(
            (v) => v.id === props,
          ) as StatusVar;
          const res = await createFormModal<StatusVar>(
            <AddStatusVar />,
            { width: 300, title: '编辑变量' },
            {
              initialValues: { name, displayName, type, value },
            },
          );
          if (!res) return;
          shareState.updateVar(props, res);
        }}
      >
        <EditOutlined style={iconStyle} />
        编辑
      </Item>
      <Item onClick={({ event, props }) => shareState.removeVar(props)}>
        <DeleteOutlined style={iconStyle} />
        删除
      </Item>
    </Menu>
  );
};

export const DataSourceMenu = ({
  menuId,
  onDelete,
  onModify,
}: {
  menuId: string;
  onDelete?: (id: string) => void;
  onModify?: (id: string) => void;
}) => {
  return (
    <Menu id={menuId} animation="fade">
      <Item onClick={({ event, props }) => onModify && onModify(props)}>
        <EditOutlined style={iconStyle} />
        编辑
      </Item>
      <Item onClick={({ event, props }) => onDelete && onDelete(props)}>
        <DeleteOutlined style={iconStyle} />
        删除
      </Item>
    </Menu>
  );
};
