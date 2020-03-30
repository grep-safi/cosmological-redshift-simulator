import React  from 'react';
import Axis   from './axis';

export default (props) => {
    const settings = {
        translate: `translate(0, ${props.height - props.padding})`,
        xScale: props.xScale,
        yScale: props.yScale,
        height: 265,
        offSet: 0,
        padding: 30,
        paddingLeft: 45
    };

    return <g className="xy-axis">
        <Axis {...settings}/>
    </g>
}