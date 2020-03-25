import React from 'react';
import DataCircles  from './data-circles';
import Line  from './line';
import XYAxis       from './x-y-axis';
import * as d3 from "d3/dist/d3";

// Returns the largest X coordinate from the data set
const xMax = (data) => data.length;

// Returns the largest Y coordinate from the data set
const yMax = (data) => d3.max(data);

// Returns a function that "scales" X coordinates from the data to fit the chart
const xScale = (props) => {
    return d3.scaleLinear()
        // .domain([0, xMax(props.data)])
        .domain([0, 280])
        .range([props.padding, props.width - props.padding]);
        // .range([props.padding, props.width - props.padding * 2]);
};

// Returns a function that "scales" Y coordinates from the data to fit the chart
const yScale = (props) => {
    return d3.scaleLinear()
        // .domain([0, yMax(props.data) + 1])
        .domain([0, 300])
        .range([props.height - props.padding, props.padding]);
};

const lineGenerator = (xScaleLine, yScaleLine) => {
    return d3.line()
        .x((d, i) => xScaleLine(i))
        .y(d => yScaleLine(d.y));
};

export default (props) => {
    const scales = { xScale: xScale(props), yScale: yScale(props) };
    const lineData = props.data.map(d => {return {"y": d}; });
    const lineGen = lineGenerator(scales.xScale, scales.yScale);
    console.log('these are the required values', props.targetDistances, props.data);
    return <svg width={props.width} height={props.height}>
        <DataCircles {...props} {...scales} />
        <DataCircles
            data={props.targetDistances}
            {...scales} />
        <XYAxis {...props} {...scales} />
        <Line
            data={lineData}
            lineGenerator={lineGen}
            width={props.width}
            height={props.height}
        />
        <line x1={31} y1={30.5} x2={771} y2={30.5} style={{stroke: "rgb(0,0,0)"}} />
        <line x1={770.5} y1={270} x2={770.5} y2={30} style={{stroke: "rgb(0,0,0)"}} />
    </svg>
}
