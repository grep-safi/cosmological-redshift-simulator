import React, { Component } from 'react';
import { axisBottom, axisLeft, select } from 'd3/dist/d3';

export default class Redshift extends Component {
    constructor(props) {
        super(props);
        // Text on top of SVG
        this.galaxyText = React.createRef();
        this.earthText = React.createRef();

        // Actual SVGs
        this.galaxySVG = React.createRef();
        this.earthSVG = React.createRef();

        // Lines
        this.initialSeparationCenterLine = React.createRef();
        this.initialSeparationLeftLine = React.createRef();
        this.initialSeparationRightLine = React.createRef();
        this.initialSeparationMiddleLine = React.createRef();

        this.finalSeparationCenterLine = React.createRef();
        this.finalSeparationLeftLine = React.createRef();
        this.finalSeparationRightLine = React.createRef();
        this.finalSeparationMiddleLine = React.createRef();

        this.initialSeparationTopText = React.createRef();
        this.initialSeparationBottomText = React.createRef();

        this.finalSeparationTopText = React.createRef();
        this.finalSeparationBottomText = React.createRef();


        this.lightLine = React.createRef();
    }

    componentDidMount() {
        this.renderAxes();
    }

    componentDidUpdate() {
        this.renderAxes();
    }

    renderAxes() {
        const xAxis = axisBottom(this.props.xScale);
        const yAxis = axisLeft(this.props.yScale);

        const node1 = this.xAxis.current;
        select(node1).call(xAxis);

        const node2 = this.yAxis.current;
        select(node2).call(yAxis);
    }

    render() {
        return <React.Fragment>
            <g className="yAxis" ref={this.yAxis}
               transform={`translate(${this.props.paddingLeft - 2}, 0)`}
            />

            <g className="xAxis" ref={this.xAxis}
               transform={`translate(-2, ${this.props.height + 5})`}
            />

            <text
                x="386"
                y="225"
                dy=".8em"
                fontSize=".9em"
                fontWeight="bold"
                className="axisLabelText"
                textAnchor="end">
                Time in Billions of Years
            </text>

            <text
                transform="rotate(-90)"
                // x="-15"
                x="0"
                y="0"
                dy=".8em"
                fontSize=".9em"
                fontWeight="bold"
                className="axisLabelText"
                textAnchor="end">
                Distance in Billions of Light Years
            </text>

        </React.Fragment>;
    }
}
