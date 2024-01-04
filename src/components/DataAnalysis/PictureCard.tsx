import { ItemTypes } from '@/constants';
import React from 'react';
import { useDrag } from 'react-dnd';
import '../../../node_modules/react-grid-layout/css/styles.css';
import '../../../node_modules/react-resizable/css/styles.css';

const PictureCard: React.FC = (props: any) => {
  const [{ opacity }, dragRef] = useDrag(
    () => ({
      type: ItemTypes.PICTURECARD,
      item: { label: props.label, name: props.name },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.5 : 1,
      }),
    }),
    [],
  );
  return (
    <div className="picture-card" ref={dragRef} style={{ opacity }}>
      {props.label}
    </div>
  );
};

export default PictureCard;
