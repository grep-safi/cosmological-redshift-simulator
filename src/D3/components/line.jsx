import React from 'react';
import * as d3 from "d3/dist/d3";
import { select } from 'd3-selection';

export default class Line extends React.Component {
    constructor() {
        super();
        this.ref = React.createRef();
    }
    componentDidMount() {
        const node = this.ref.current;

        select(node)
            .append('path')
            .datum(this.props.data)
            .attr('id', 'line')
            .attr('stroke', 'blue')
            .attr('stroke-width', 2)
            .attr('fill', 'none')
            .attr('d', this.props.lineGenerator);
    }
    componentDidUpdate() {
        this.updateChart();
    }
    updateChart() {
        const line = select('#line');

        line
            .datum(this.props.data)
            .attr('d', this.props.lineGenerator);
    }
    render() {
        return <g ref={this.ref} />;
    }
}
