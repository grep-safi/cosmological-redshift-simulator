import React, { Component } from 'react';
import { axisBottom, axisLeft, select, selectAll} from 'd3/dist/d3';
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

        const nodeX = this.xAxis.current;
        const nodeY = this.yAxis.current;

        const xAxisNode = select(nodeX);
        const yAxisNode = select(nodeY);

        xAxisNode.call(xAxis);
        yAxisNode.call(yAxis);
    }

    render() {
        return <React.Fragment>
            <g className={"yAxis"} ref={this.yAxis}
               transform={`translate(${this.props.paddingLeft - 2}, 0)`}
            />

            <g className={"xAxis"} ref={this.xAxis}
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
                x="-15"
                y="0"
                dy=".8em"
                fontSize=".9em"
                fontWeight="bold"
                className="axisLabelText"
                textAnchor="end">
                Distance in Billion Light Years
            </text>

        </React.Fragment>;
    }
}

Axes.propTypes = {
    yScale: PropTypes.func.isRequired,
    xScale: PropTypes.func.isRequired,
    height: PropTypes.number.isRequired,
    paddingLeft: PropTypes.number.isRequired
}
