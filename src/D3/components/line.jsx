import React from 'react';
import { select } from 'd3-selection';

export default class Line extends React.Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
    }
    componentDidMount() {
        const node = this.ref.current;

        select(node)
            .append('path')
            .datum(this.props.data)
            .attr('id', this.props.id)
            .attr('stroke', this.props.color)
            .attr('stroke-width', 2)
            .attr('fill', 'none')
            .attr('d', this.props.lineGenerator);
    }
    componentDidUpdate() {
        this.updateChart();
    }
    updateChart() {
        const str = '#' + this.props.id;
        const line = select(str);

        line
            .datum(this.props.data)
            .attr('d', this.props.lineGenerator);
    }
    render() {
        return <g ref={this.ref} />;
    }
}
