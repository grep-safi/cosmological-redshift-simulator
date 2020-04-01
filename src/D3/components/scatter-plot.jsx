import React from 'react';
// import DataCircles  from './data-circles';
import Line  from './line';
import XYAxis       from './x-y-axis';
import { curveCardinal, max, scaleLinear, line } from 'd3/dist/d3';

// Returns the largest X coordinate from the data set
// const xMax = (data) => max(data) + 1.0;
const xMax = (data) => max(data) + 0.1;

// Returns the largest Y coordinate from the data set
const yMax = (data) => max(data);

// Returns a function that "scales" X coordinates from the data to fit the chart
const xScale = (props) => {
    return scaleLinear()
        .domain([0, xMax(props.times)])
        .range([props.padding, props.width - props.padding]);
};

// Returns a function that "scales" Y coordinates from the data to fit the chart
const yScale = (props) => {
    return scaleLinear()
        .domain([0, yMax(props.targetDistances)])
        .range([props.height - props.padding + 10, props.padding - 20]);
};

const lineGenerator = (xScaleLine, yScaleLine) => {
    return line()
        .x(d => xScaleLine(d.t))
        .y(d => yScaleLine(d.y))
        .curve(curveCardinal)
};

export default (props) => {
    const scales = { xScale: xScale(props), yScale: yScale(props) };
    let timeVals = props.times;

    const lineDataLightVal = props.lightValues.map((d, i) => {return {"y": d, "t": timeVals[i]}; });
    const lineDataTargetDist = props.targetDistances.map((d, i) => {return {"y": d, "t": timeVals[i]}; });
    const lineDataLightDist = props.lightDistances.map((d, i) => {return {"y": d, "t": timeVals[i]}; });

    const lineGenLightVal = lineGenerator(scales.xScale, scales.yScale);
    const lineGenTargetDist = lineGenerator(scales.xScale, scales.yScale);
    const lineGenLightDist = lineGenerator(scales.xScale, scales.yScale);
    return <svg width={props.width} height={props.height}>
       <XYAxis {...props} {...scales} />
        <Line
            data={lineDataLightVal}
            lineGenerator={lineGenLightVal}
            width={props.width}
            height={props.height}
            id={'id1'}
            color={'blue'}
        />
        <Line
            data={lineDataTargetDist}
            lineGenerator={lineGenTargetDist}
            width={props.width}
            height={props.height}
            id={'id2'}
            color={'black'}
        />
        <Line
            data={lineDataLightDist}
            lineGenerator={lineGenLightDist}
            width={props.width}
            height={props.height}
            id={'id3'}
            color={'red'}
        />

        {/*Horizontal Upper line*/}
        <line x1={39} y1={24.5} x2={886} y2={24.5} style={{stroke: "rgb(0,0,0)"}} />
        {/*Vertical Line Right*/}
        <line x1={885.5} y1={265} x2={885.5} y2={25} style={{stroke: "rgb(0,0,0)"}} />

    </svg>
}
