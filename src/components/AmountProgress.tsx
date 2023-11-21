import { Progress } from '@antv/g2plot';
import _ from 'lodash';
import React, { useEffect } from 'react';

interface Props {
  id: number;
  moment: number;
  target: number;
}

const AmountProgress: React.FC<Props> = (props) => {
  useEffect(() => {
    const percent = _.floor(_.divide(props.moment, props.target), 4);
    const progress = new Progress('container' + props.id, {
      height: 30,
      width: 90,
      autoFit: false,
      percent,
      color: ['#5B8FF9', '#E8EDF3'],
      annotations: [
        {
          type: 'text',
          position: ['median', 'median'],
          content: percent * 100 + '%',
          style: {
            fontSize: 15,
          },
        },
      ],
    });
    progress.render();
    return () => {
      progress.destroy();
    };
  });
  return <div id={'container' + props.id} key={'container' + props.id}></div>;
};

export default AmountProgress;
