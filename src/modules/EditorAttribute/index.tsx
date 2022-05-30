import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  EditOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignMiddleOutlined,
  VerticalAlignTopOutlined,
} from '@ant-design/icons';
import { FileUploadSelector } from '@phoenixs/fileupload';
import { Col, Modal, Row } from 'antd';
import Form, { useForm } from 'antd/lib/form/Form';
import FormItem from 'antd/lib/form/FormItem';
import { CSSProperties, useLayoutEffect, useMemo, useState } from 'react';
import Collapse from '../../components/Collapse';
import CustomAttrForm from '../../components/CustomAttrForm';
import { ColorPicker, InputNumber, Switch } from '@phoenixs/form-components';
import { VarMappers } from '../../components/VarSelector';
import { ViewData } from '../../core/interface';
import { MaterialSchema } from '../../materials';
import Container from '../../state';
import { classnames, TreeHelper } from '../../utils';
import ActionPanel from '../ActionPanel';
import style from './index.module.less';

enum Alignment {
  HorizontalLeft,
  HorizontalRight,
  HorizontalCenter,
  VerticalTop,
  VerticalBottom,
  VerticalCenter,
}

interface AttributePanelProps {}

const collapseStyle = { borderTop: '1px solid #eee' };

/**
 * 属性面板
 * @param props
 * @returns
 */
export const AttributePanel = (props: AttributePanelProps) => {
  const shareState = Container.useContainer();
  const [containerForm] = useForm();
  const [componentForm] = useForm();
  const [actionPanelVisible, setActionPanelVisible] = useState(false);
  const [selectedItem, schema] = useMemo(() => {
    const tree = new TreeHelper<ViewData>(shareState.viewDatas);
    const view = shareState.selectedItemId
      ? tree.find(shareState.selectedItemId)
      : undefined;
    return [view, view && (view.item.schema || MaterialSchema[view.item.name])];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shareState.selectedItemId]);

  const noSelectedItem = !shareState.selectedItemId;
  const appData = shareState.getAppData();

  const handleContainerFormChange = (changeValues: any, values: any) => {
    const { isAbsolute, backgroundImage, ...restStyle } = values;
    const bg =
      backgroundImage && backgroundImage[0]
        ? `url('${backgroundImage[0]}')`
        : undefined;
    if (!shareState.selectedItemId) return;
    shareState.updateViewStyle(shareState.selectedItemId, {
      backgroundImage: bg,
      ...restStyle,
    });
    /** 设置定位 */
    if (isAbsolute !== undefined)
      shareState.updateViewDataPosition(shareState.selectedItemId, isAbsolute);
  };
  const handleComponentFormChange = (changeValues: any) => {
    if (!shareState.selectedItemId) return;
    shareState.updateViewConfig(shareState.selectedItemId, changeValues);
  };
  const handleAlignmentChange = (alignment: number) => {
    let style: CSSProperties = {};
    switch (alignment) {
      case Alignment.HorizontalLeft:
        style['justifyContent'] = 'flex-start';
        break;
      case Alignment.HorizontalRight:
        style['justifyContent'] = 'flex-end';
        break;
      case Alignment.HorizontalCenter:
        style['justifyContent'] = 'center';
        break;
      case Alignment.VerticalTop:
        style['alignItems'] = 'flex-start';
        break;
      case Alignment.VerticalBottom:
        style['alignItems'] = 'flex-end';
        break;
      case Alignment.VerticalCenter:
        style['alignItems'] = 'center';
        break;
    }
    shareState.selectedItemId &&
      shareState.updateViewStyle(shareState.selectedItemId, style);
  };
  // const handleAddAction = () => {};

  /** 渲染表单的值 */
  useLayoutEffect(() => {
    if (shareState.selectedItemId && selectedItem) {
      containerForm.resetFields();
      componentForm.resetFields();
      containerForm.setFieldsValue({
        ...selectedItem.style,
        backgroundImage: selectedItem.style?.backgroundImage && [
          selectedItem.style.backgroundImage
            .replace("url('", '')
            .replace("')", ''),
        ],
        isAbsolute: selectedItem.isAbsolute,
      });
      componentForm.setFieldsValue(selectedItem.item.config);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shareState.selectedItemId]);

  // TODO: 添加一个图表按钮，显示该组件的详细信息，包括组件的id等
  return (
    <div className={style.editorAttrPanel}>
      <div
        className={classnames(
          style.alignAttr,
          noSelectedItem ? style.attrDisable : '',
        )}
      >
        <AlignLeftOutlined
          onClick={() => handleAlignmentChange(Alignment.HorizontalLeft)}
        />
        <AlignCenterOutlined
          onClick={() => handleAlignmentChange(Alignment.HorizontalCenter)}
        />
        <AlignRightOutlined
          onClick={() => handleAlignmentChange(Alignment.HorizontalRight)}
        />
        <VerticalAlignTopOutlined
          onClick={() => handleAlignmentChange(Alignment.VerticalTop)}
        />
        <VerticalAlignMiddleOutlined
          onClick={() => handleAlignmentChange(Alignment.VerticalCenter)}
        />
        <VerticalAlignBottomOutlined
          onClick={() => handleAlignmentChange(Alignment.VerticalBottom)}
        />
      </div>

      <Collapse
        title="容器配置"
        disable={noSelectedItem}
        defaultCollapse={false}
        style={collapseStyle}
      >
        <Form form={containerForm} onValuesChange={handleContainerFormChange}>
          <Row gutter={8}>
            <Col span={12}>
              <FormItem name="backgroundColor" label="背景色" colon={false}>
                <ColorPicker />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem name="color" label="字体色" colon={false}>
                <ColorPicker />
              </FormItem>
            </Col>
          </Row>
          <FormItem name="opacity" label="透明度" colon={false}>
            <InputNumber range={[0, 1]} showSlider sliderWidth={120} />
          </FormItem>
          <FormItem
            name="isAbsolute"
            label="定位"
            colon={false}
            labelCol={{ span: 4 }}
          >
            <Switch<boolean>
              width={130}
              options={[
                { label: '堆叠模式', value: false },
                { label: '自由模式', value: true },
              ]}
            />
          </FormItem>
          <div style={{ marginTop: 4 }}>
            <FormItem name="backgroundImage" label="背景图" colon={false}>
              <FileUploadSelector formName={appData.id} />
            </FormItem>
          </div>
        </Form>
      </Collapse>
      <Collapse
        title="交互配置"
        disable={noSelectedItem}
        style={collapseStyle}
        defaultCollapse={true}
        collapsable={false}
        actionRender={() => (
          <EditOutlined
            style={{ cursor: 'pointer' }}
            onClick={() => setActionPanelVisible(true)}
          />
        )}
      />
      <Collapse
        title="状态映射"
        disable={noSelectedItem}
        style={collapseStyle}
        defaultCollapse={false}
      >
        <VarMappers
          value={selectedItem?.varMaps}
          onChange={(v) =>
            v &&
            shareState.selectedItemId &&
            shareState.updateViewVarMaps(shareState.selectedItemId, v)
          }
        />
      </Collapse>
      <Collapse
        title="组件配置"
        disable={noSelectedItem}
        style={collapseStyle}
        defaultCollapse={false}
      >
        <CustomAttrForm
          form={componentForm}
          schema={schema}
          onValuesChange={handleComponentFormChange}
        />
      </Collapse>
      <Modal
        width={500}
        title={false}
        footer={false}
        closable={false}
        mask={false}
        maskClosable={true}
        bodyStyle={{ padding: 0 }}
        visible={actionPanelVisible}
        onCancel={() => setActionPanelVisible(false)}
        destroyOnClose
      >
        <ActionPanel
          onSave={(v) => {
            if (shareState.selectedItemId) {
              shareState.updateViewAction(shareState.selectedItemId, v);
            }
          }}
        />
      </Modal>
    </div>
  );
};
