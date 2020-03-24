import React from 'react';
import DataCircles  from './data-circles';
import Line  from './line';
import XYAxis       from './x-y-axis';
import * as d3 from "d3/dist/d3";

// Returns the largest X coordinate from the data set
const xMax   = (data)  => data.length;

// Returns the largest Y coordinate from the data set
const yMax   = (data)  => d3.max(data);

// Returns a function that "scales" X coordinates from the data to fit the chart
const xScale = (props) => {
    return d3.scaleLinear()
        .domain([0, xMax(props.data)])
        .range([props.padding, props.width - props.padding]);
        // .range([props.padding, props.width - props.padding * 2]);
};

// Returns a function that "scales" Y coordinates from the data to fit the chart
const yScale = (props) => {
    return d3.scaleLinear()
        .domain([0, yMax(props.data)])
        .range([props.height - props.padding, props.padding]);
};

const xScale2 = d3.scaleLinear()
    .domain([0, 4])
    .range([30, 770]);

const yScale2 = d3.scaleLinear()
    .domain([0, 50])
    .range([300, 30]);

const lineGenerator = d3.line()
    .x((d, i) => xScale2(i))
    .y(d => yScale2(d.y))
    .curve(d3.curveMonotoneX);

export default (props) => {
    const scales = { xScale: xScale(props), yScale: yScale(props) };
    if (props.data.length < 5) {
        // let lineData = props.data.map((d, i) => { return {"name": i, "value": d}})
        // let result = lineData.reduce((acc, cur) => ({ ...acc, [cur.color]: cur.id }), {});
        // console.log('lord have mercy', lineData, 'reseu;t', result);
    }
    // let lineData = props.data.map((d) => { return {"y": d}; });
    let lineData = [{"y": 30}, {"y": 10}, {"y": 20}, {"y": 50}];
    console.log('please fucking work', lineData, props.data);
    return <svg width={props.width} height={props.height}>
        <DataCircles {...props} {...scales} />
        <g>
            <Line
                data={lineData}
                lineGenerator={lineGenerator}
                width={props.width}
                height={props.height}
            />
        </g>
        <XYAxis {...props} {...scales} />
    </svg>
}
