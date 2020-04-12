import React from 'react';

const dimensions = {
    width: 910,
    height: 290,
};

const possibleWhites = {

};

const renderCircles = (props) => {
    return (circleProperties, index) => {
        // console.log(typeof(props.backgroundStars.fill));
        const circleProps = {
            cx: circleProperties.cx,
            cy: circleProperties.cy,
            r: circleProperties.r,
            // fill: props.backgroundStars.fill,
            fill: circleProperties.fill,
            // fill: "#a8a8a8",
            key: index,
        };

        // console.log(`cx: ${coords.cx}`);
        // console.log(`cy: ${coords.cy}`);
        // console.log(`r: ${coords.r}`);
        // console.log(`fill: ${coords.fill}`);
        // console.log(`index: ${index}`);

        return <circle {...circleProps} />;
    };
};

export default (props) => {

    return <svg width={dimensions.width} height={dimensions.height}>
        <rect width="100%" height="100%" fill="black"/>
        <g>{ props.backgroundStars.map(renderCircles(props)) }</g>
        <circle cx="900" cy="50" r="5" fill="rgba(150,0,30,0.945463252323423)" />
        {/*<circle cx="883.4670120918533" cy="254.77864781639826" r="2.914660136421845" fill="rgba(255,255,255,1)" />*/}

        {/*<circle cx="90" cy="50" r="5" fill="#a8a8a8" />*/}
        {/*<circle cx="100" cy="50" r="5" fill="#d1d1d1" />*/}
        {/*<circle cx="200" cy="50" r="5" fill="#e6e6e6" />*/}
        {/*<circle cx="250" cy="50" r="5" fill="#d1d1d1" />*/}
        {/*<circle cx="130" cy="50" r="5" fill="#d1d1d1" />*/}
        {/*<circle cx="190" cy="50" r="5" fill="#d1d1d1" />*/}
    </svg>
}