import React from 'react';
import { DropTargetHookSpec, useDrop } from 'react-dnd';
import config from '../config';
import { MaterialGroups } from '../materials';
import { CollectedDropProps, DragObject, DropResult } from './interface';

interface DropperProps extends React.PropsWithChildren<unknown> {
  drop?: DropTargetHookSpec<DragObject, DropResult, CollectedDropProps>['drop'];
  height?: number;
}

/**
 * 拖拽目的点的容器
 * @param props
 * @returns
 */
const Dropper = (props: DropperProps) => {
  const [{ isOver }, drop] = useDrop<
    DragObject,
    DropResult,
    CollectedDropProps
  >({
    accept: MaterialGroups,
    drop: (...params) => {
      const didDrop = params[1].didDrop();
      if (didDrop) return;
      props.drop && props.drop(...params);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
      item: monitor.getItem(),
    }),
  });
  const style = {
    backgroundColor: isOver ? '#EDFAEA' : 'transparent',
    minHeight: props.height || config.defaultViewPortHeight,
  };

  return (
    <div ref={drop} style={style}>
      {props.children}
    </div>
  );
};

export default Dropper;
