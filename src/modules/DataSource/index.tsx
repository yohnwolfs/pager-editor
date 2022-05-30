import {
  CloseOutlined,
  EditOutlined,
  PlusOutlined,
  QuestionOutlined,
  RightOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { createFormModal, createFormModalOrigin } from '@phoenixs/antd-modal';
import { Button, Empty, Form, Modal, Space } from 'antd';
import { useMemo, useState } from 'react';
import { useContextMenu } from 'react-contexify';
import { v4 as uuid } from 'uuid';
import { DataSourceMethod } from '../../core/interface';
import Container from '../../state';
import { classnames } from '../../utils';
import {
  DataSourceForm,
  DataSourceMethodForm,
  DataSourceMethodSavedToVar,
} from '../EditorForm';
import { DataSourceMenu } from '../EditorMenu';
import style from './index.module.less';

export interface DataSourcePanelProps {}

const DATASOURCE_MENU_ID = 'dataSourceMenu';

/**
 * 数据源面板
 * @param props
 * @returns
 */
export const DataSourcePanel = (props: DataSourcePanelProps) => {
  const shareState = Container.useContainer();
  const { show: showDataSourceMenu } = useContextMenu({
    id: DATASOURCE_MENU_ID,
  });
  const [savedToVarForm] = Form.useForm();
  const [selectedItemId, setSelectedItemId] = useState<string | undefined>();
  const [selectedMethod, setSelectedMethod] = useState<
    DataSourceMethod | undefined
  >(); // TODO: 权宜之计：后续需要改进useModal,提供contextHolder 占位
  const selectedItem = useMemo(
    () => shareState.dataSources.find((data) => data.id === selectedItemId),
    [selectedItemId, shareState.dataSources],
  );
  const [modalMethodSavedToVarVisible, setModalMethodSavedToVarVisible] =
    useState(false);
  const handleAddMethod = async () => {
    const res = await createFormModalOrigin<Omit<DataSourceMethod, 'id'>>(
      <DataSourceMethodForm />,
      {
        title: '添加数据源方法',
        width: 300,
      },
    );
    if (selectedItemId && res) {
      const nId = uuid();
      shareState.addDataSourceMethod(selectedItemId, { id: nId, ...res });
    }
  };

  return (
    <div className={style.dataSourcePanel}>
      <div className={style.header}>
        <Button
          shape="circle"
          icon={<PlusOutlined />}
          onClick={async () => {
            const res = await createFormModal<{ name: string }>(
              <DataSourceForm />,
              {
                title: '添加数据源',
                width: 300,
              },
            );
            if (res) {
              const nId = uuid();
              shareState.addDataSource({ id: nId, methods: [], ...res });
            }
          }}
        />
      </div>
      <div className={style.content}>
        <div className={style.list}>
          {shareState.dataSources.length ? (
            shareState.dataSources.map((data) => (
              <div
                key={data.id}
                className={classnames(
                  style.listItem,
                  data.id === selectedItemId ? style.selectedListItem : '',
                )}
                onClick={() => setSelectedItemId(data.id)}
                onContextMenu={(e) => showDataSourceMenu(e, { props: data.id })}
              >
                <div className={style.listIcon}>
                  <QuestionOutlined />
                </div>
                <div className={style.listInfo}>
                  <strong>{data.name}</strong>
                  <p>......</p>
                </div>
                <RightOutlined />
              </div>
            ))
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="暂无数据"
            />
          )}
        </div>
        <div className={style.detail}>
          {selectedItem ? (
            <>
              <div className={style.detailHeader}>
                <div className={style.title}>
                  {selectedItem.name}
                  <p>......</p>
                </div>
                <Space>
                  <Button
                    shape="circle"
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddMethod}
                  />
                </Space>
              </div>
              {selectedItem.methods?.map((method) => (
                <div key={method.id} className={style.methodItem}>
                  <div className={style.methodHeader}>
                    <div className={style.methodTitle}>{method.name}</div>
                    <Space>
                      <EditOutlined
                        onClick={async () => {
                          const res = await createFormModalOrigin<
                            Partial<DataSourceMethod>
                          >(<DataSourceMethodForm initialValues={method} />, {
                            title: '编辑数据源方法',
                            width: 300,
                          });
                          selectedItemId &&
                            shareState.updateDataSourceMethod(
                              selectedItemId,
                              method.id,
                              res,
                            );
                        }}
                      />
                      <SaveOutlined
                        onClick={() => {
                          savedToVarForm.setFieldsValue({
                            savedToVar: method.savedToVar,
                          });
                          setSelectedMethod(method);
                          setModalMethodSavedToVarVisible(true);
                        }}
                      />
                      <CloseOutlined
                        onClick={() =>
                          selectedItemId &&
                          shareState.removeDataSourceMethod(
                            selectedItemId,
                            method.id,
                          )
                        }
                      />
                    </Space>
                  </div>
                  <div className={style.methodBody}>
                    <div className={style.url}>{method.url}</div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="暂无数据"
            />
          )}
        </div>
      </div>
      <DataSourceMenu
        menuId={DATASOURCE_MENU_ID}
        onDelete={(id) => {
          shareState.removeDataSource(id);
          if (selectedItemId === id) setSelectedItemId(undefined);
        }}
        onModify={async (id) => {
          const dataSource = shareState.dataSources.find((d) => d.id === id);
          const res = await createFormModal(
            <DataSourceForm />,
            {
              title: '编辑数据源',
              width: 300,
            },
            { initialValues: dataSource },
          );
          if (res) shareState.updateDataSource(id, res);
        }}
      />
      <Modal
        width={300}
        title={'存储到变量'}
        closable={false}
        mask={false}
        maskClosable={true}
        bodyStyle={{ padding: 0 }}
        visible={modalMethodSavedToVarVisible}
        onCancel={() => setModalMethodSavedToVarVisible(false)}
        okText="确定"
        cancelText="取消"
        onOk={() => {
          const id = savedToVarForm.getFieldsValue().savedToVar;
          selectedItemId &&
            selectedMethod &&
            id &&
            shareState.updateDataSourceMethod(
              selectedItemId,
              selectedMethod.id,
              { savedToVar: id },
            );
          setModalMethodSavedToVarVisible(false);
        }}
        destroyOnClose
      >
        <Form form={savedToVarForm}>
          <DataSourceMethodSavedToVar />
        </Form>
      </Modal>
    </div>
  );
};
