import { MaterialSchema } from '../materials';
import { MetaData } from '../materials/interface';
import React from 'react';
import { useDrag } from 'react-dnd';
import { CollectedDragProps, DragObject, DropResult } from './interface';

interface DraggerProps extends React.PropsWithChildren<unknown> {
  item: MetaData;
}

/**
 * 拖拽源的容器
 * @param props
 * @returns
 */
const Dragger = (props: DraggerProps) => {
  const { item, children } = props;
  const { img, ...restItemAttrs } = item;
  const schema = MaterialSchema[item.name];
  const [_, dragRef] = useDrag<DragObject, DropResult, CollectedDragProps>({
    type: item.group,
    item: {
      ...restItemAttrs,
      config: schema?.config || {},
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return <div ref={dragRef}>{children}</div>;
};

export default Dragger;
