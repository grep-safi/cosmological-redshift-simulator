import React from 'react';

const dimensions = {
    width: 920,
    height: 290,
};

const CENTER_X = 460;
const CENTER_Y = 145;

const SCALING_FACTOR = 50;
const scaleToPixel   = distance => distance * SCALING_FACTOR;

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

        return <circle {...circleProps} />;
    };
};

export default (props) => {
    let distanceFromCenter = scaleToPixel(props.distanceBetweenBodies / 2);

    // if (!(distanceFromCenter > halfOfScreen - 30)) {
    //     this.us.x = CENTER_X + distanceFromCenter;
    //     this.galaxy.x = CENTER_X - distanceFromCenter;
    // }

    let sizeShift = 10;
    let galaxySizeShift = 25;
    let xPositionEarth = CENTER_X + distanceFromCenter - sizeShift;
    let xPositionGalaxy = CENTER_X - distanceFromCenter - galaxySizeShift;

    return (
        <svg width={dimensions.width} height={dimensions.height}>
            <rect width="100%" height="100%" fill="black"/>
            <g>{ props.backgroundStars.map(renderCircles(props)) }</g>

            <line x1={0} y1={0} x2={200} y2={200} style={{stroke: "rgb(255,0,0)", strokeWidth:"2"}}/>

            <image x={xPositionEarth} y={135} href="../assets/earth.svg" height="20" width="20"/>
            <image x={xPositionGalaxy} y={120} href="../assets/GalaxySVG.svg" height="50" width="50"/>

            <text x={xPositionEarth - 8} y={105} fill={"rgb(228, 209, 160)"}>Earth</text>

        </svg>
    );
}


// Remember to credit:
// <div>Icon made from <a href="http://www.onlinewebfonts.com/icon">Icon Fonts</a> is licensed by CC BY 3.0</div>
// <div>Icon made from <a href="http://www.onlinewebfonts.com/icon">Icon Fonts</a> is licensed by CC BY 3.0</div>