import React       from 'react';

const styles = {
    width   : 150,
    height  : 150,
    padding : 45,
};

export default class Legend extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={this.props.backgroundColors} id="legend">
                <svg width={styles.width} height={styles.height}>
                    <text
                        x="150"
                        y="0"
                        fontSize=".8em"
                        className="legendText"
                        textAnchor="end">
                        <tspan x="150" dy="1.9em">Separation Distance</tspan>
                        <tspan x="140" dy="4.0em">Distance Travelled</tspan>
                        <tspan x="85" dy="1.0em">By Light</tspan>
                        <tspan x="140" dy="3.1em">Distance Between</tspan>
                        <tspan x="125" dy="1.2em">Light and Earth</tspan>
                    </text>

                    <line x1={5} y1={20} x2={30} y2={20} style={{stroke: "green", strokeWidth: "2.5"}} />
                    <line x1={5} y1={78} x2={30} y2={78} style={{stroke: "yellow", strokeWidth: "2.5"}} />
                    <line x1={5} y1={130} x2={30} y2={130} style={{stroke: "red", strokeWidth: "2.5"}} />
                </svg>
            </div>
        );
    }
}