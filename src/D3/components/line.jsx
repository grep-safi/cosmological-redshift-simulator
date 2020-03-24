import React from 'react';
import * as d3 from "d3/dist/d3";
import { select } from 'd3-selection';

// Line chart code was derived from: https://stackblitz.com/edit/d3-react-line-chart
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
            .attr('stroke', 'red')
            .attr('stroke-width', 2)
            .attr('fill', 'none')
            .attr('d', this.props.lineGenerator);

        // this.updateChart()
    }
    componentDidUpdate() {
        // this.updateChart();
    }
    updateChart() {
        const lD = this.props.data.map((d, i) => { return {"name": i, "value": d}});

        const line = select('#line');
        line
            .datum(this.props.data)
            .attr('d', this.props.lineGenerator);
    }
    render() {
        return <g ref={this.ref} />;
    }
}
