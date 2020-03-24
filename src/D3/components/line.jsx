import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from "d3/dist/d3";

export default class Line extends Component {
    constructor(props) {
        super(props);
        this.lineRef = React.createRef();

        this.line = d3.line()
            .x((d, i) => this.props.xScale(i))
            .y(d => this.props.yScale(d))
            .curve(d3.curveCatmullRom.alpha(0.5)); //curve line
    }

    componentDidMount() {
        this.renderLine();
    }

    componentDidUpdate() {
        this.renderLine();
    }

    renderLine() {
       const node = this.lineRef.current;
        d3.select(node).call(this.line);
        // console.log('ive got a good feeling about this onee',this.props.data);
    }

    render() {
        return <React.Fragment>
            <path d={this.line(this.props.data)} className="line" ref={this.lineRef}/>
        </React.Fragment>;
    }
}





//
// import React from 'react';
// import * as d3 from "d3/dist/d3";
//
// export default (props) => {
//     //x scale
//     const xScale = props.xScale;
//     //y scale
//     const yScale = props.yScale;
//
//     //line generator: each point is [x(d.a), y(d.b)] where d is a row in data
//     // and x, y are scales (e.g. x(10) returns pixel value of 10 scaled by x)
//     const line = d3.line()
//         .x((d, i) => xScale(i))
//         .y(d => yScale(d))
//         .curve(d3.curveCatmullRom.alpha(0.5)); //curve line
//
//     return <path d={line(props.data)}/>
// }

// const renderCircles = (props) => {
//     return (coords, index) => {
//         const circleProps = {
//             cx: props.xScale(index),
//             cy: props.yScale(coords),
//             r: 2,
//             key: index,
//         };
//         return <circle {...circleProps} />;
//     };
// };
//
// export default (props) => {
//     return <g>{ props.data.map(renderCircles(props)) }</g>
// }
// //
//
//
//
//
//
//
// import React from 'react';
// import { select, selectAll } from 'd3-selection';
// import { transition } from 'd3-transition';
//
// class Line extends React.Component {
//     constructor() {
//         super();
//         this.ref = React.createRef();
//     }
//
//     componentDidMount() {
//         const node = this.ref.current;
//         const { xScale, yScale, data, lineGenerator } = this.props;
//
//         const initialData = data.map(d => ({
//             name: d.name,
//             value: 0
//         }));
//
//         select(node)
//             .append('path')
//             .datum(initialData)
//             .attr('id', 'line')
//             .attr('stroke', 'black')
//             .attr('stroke-width', 2)
//             .attr('fill', 'none')
//             .attr('d', lineGenerator);
//
//         this.updateChart()
//     }
//
//     componentDidUpdate() {
//         this.updateChart();
//     }
//
//     updateChart() {
//         const {
//             lineGenerator, xScale, yScale, data,
//         } = this.props;
//
//         const t = transition().duration(1000);
//
//         const line = select('#line');
//         const dot = selectAll('.circle');
//
//         line
//             .datum(data)
//             .transition(t)
//             .attr('d', lineGenerator);
//     }
//
//     render() {
//         return <g className="line-group" ref={this.ref} />;
//     }
// }
//
// export default Line;
//
// //
// //
// // import React from 'react';
// // import * as d3 from 'd3';
// //
// // class Line extends React.Component {
// //     render() {
// //         const data = this.props.data;
// //
// //         const x = this.props.xScale;
// //         const y = this.props.yScale;
// //
// //         const me = this;
// //         const line = d3
// //             .line()
// //             // Cut off the graph edge so the line doesn't wrap around to
// //             // the beginning.
// //             .defined(function(d) {
// //                 const xPos = (
// //                     ((d[0] + me.props.offset) / me.props.width)
// //                     + 0.5) % 1;
// //                 if (xPos > 0.995) {
// //                     return false;
// //                 }
// //
// //                 return true;
// //             })
// //             .x(function(d) {
// //                 return x((
// //                     ((d[0] + me.props.offset) / me.props.width)
// //                     + 0.5) % 1);
// //             })
// //             .y(function(d) {
// //                 const yPos = -d[1] / me.props.height;
// //                 return y(-d[1] / me.props.height);
// //             });
// //
// //         const newline = line(data);
// //         const visibility = this.props.showLightcurve ?
// //             'visible' : 'hidden';
// //
// //         return (
// //             <path className="line"
// //                   visibility={visibility}
// //                   stroke="#000000"
// //                   strokeWidth="2"
// //                   fill="none"
// //                   d={newline} />
// //         );
// //     }
// // };
// //
// // const renderLine = (props) => {
// //     return (coords, index) => {
// //         const lineProps = {
// //             d: props.line,
// //             key: index
// //         };
// //         console.log('I should b rendering somthing here', lineProps );
// //         return <line {...lineProps} />;
// //     };
// // };
// //
// // export default (props) => {
// //     return <g>{ props.data.map(renderLine(props)) }</g>
// // }