import React  from 'react';
import Axis   from './axis';

export default (props) => {
    const xSettings = {
        translate: `translate(0, ${props.height + props.padding})`,
        xScale: props.xScale,
        yScale: props.yScale,
        height: 255,
        offSet: 0,
        padding: 60,
        paddingLeft: 20
    };
    const ySettings = {
        translate: `translate(${props.padding}, 0)`,
        scale: props.yScale,
    };

    console.log('look here', xSettings);

    return <g className="xy-axis">
        <Axis {...xSettings}/>
        {/*<Axis {...ySettings}/>*/}
    </g>
}