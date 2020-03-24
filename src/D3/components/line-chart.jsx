import React  from 'react';
import Line   from './line';

export default (props) => {
    const settings = {
        xScale: props.xScale,
        yScale: props.yScale,
        data: props.data,
        paddingLeft: 30
    };

    return <Line {...settings}/>;
}