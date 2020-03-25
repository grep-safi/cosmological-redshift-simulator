import React  from 'react';
import Axis   from './axis';

export default (props) => {
    const xSettings = {
        translate: `translate(0, ${props.height - props.padding})`,
        xScale: props.xScale,
        yScale: props.yScale,
        height: 265,
        offSet: 0,
        padding: 30,
        paddingLeft: 45
    };

    const ySettings = {
        translate: `translate(${props.padding}, 0)`,
        scale: props.yScale,
    };

    return <g className="xy-axis">
        <Axis {...xSettings}/>
        {/*<Axis {...ySettings}/>*/}
    </g>
}