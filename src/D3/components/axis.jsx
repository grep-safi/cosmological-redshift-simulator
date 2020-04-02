import React, { Component } from 'react';
import { axisBottom, axisLeft, select } from 'd3/dist/d3';
import PropTypes from 'prop-types';

export default class Axes extends Component {
    constructor(props) {
        super(props);
        this.xAxis = React.createRef();
        this.yAxis = React.createRef();
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
               transform={`translate(${this.props.paddingLeft}, 0)`}
            />

            <g className="xAxis" ref={this.xAxis}
               transform={`translate(0, ${this.props.height})`}
            />

            <text
                x="316"
                y="245"
                dy=".8em"
                fontSize=".9em"
                fontWeight="bold"
                className="axisLabelText"
                textAnchor="end">
                Time
            </text>

            <text
                transform="rotate(-90)"
                x="-95"
                y="0"
                dy=".8em"
                fontSize=".9em"
                fontWeight="bold"
                className="axisLabelText"
                textAnchor="end">
                Distance
            </text>

        </React.Fragment>;
    }
}

Axes.propTypes = {
    yScale: PropTypes.func.isRequired,
    xScale: PropTypes.func.isRequired,
    height: PropTypes.number.isRequired,
    paddingLeft: PropTypes.number.isRequired
};
