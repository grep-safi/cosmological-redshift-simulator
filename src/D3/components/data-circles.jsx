import React from 'react';

const renderCircles = (props) => {
    return (coords, index) => {
        const circleProps = {
            cx: props.xScale(coords),
            cy: props.yScale(index),
            r: 2,
            key: index
        };
        return <circle {...circleProps} />;
    };
};

export default (props) => {
    return <g>{ props.data.map(renderCircles(props)) }</g>
}