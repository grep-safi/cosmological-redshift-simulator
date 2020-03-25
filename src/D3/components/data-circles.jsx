import React from 'react';

const renderCircles = (props) => {
    return (coords, index) => {
        const circleProps = {
            cx: props.xScale(index),
            cy: props.yScale(coords),
            r: 1.5,
            stroke: "black",
            fill: "black",
            key: index,
        };
        return <circle {...circleProps} />;
    };
};

export default (props) => {
    return <g>{ props.data.map(renderCircles(props)) }</g>
}