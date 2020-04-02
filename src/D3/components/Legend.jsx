import React       from 'react';
import LineGraph from './LineGraph';

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
        if (!this.props.displayGraph) return null;

        return (
            <div>
                <svg width={styles.width} height={styles.height}>
                    <text
                        x="150"
                        y="0"
                        fontSize=".8em"
                        className="legendText"
                        textAnchor="end">
                        <tspan x="140" dy="1.2em">Distance Travelled</tspan>
                        <tspan x="85" dy="1.2em">By Light</tspan>
                        <tspan x="150" dy="4.0em">Separation Distance</tspan>
                        <tspan x="140" dy="3.5em">Distance Between</tspan>
                        <tspan x="125" dy="1.2em">Light and Earth</tspan>
                    </text>


                    {/*Horizontal Upper line*/}
                    <line x1={5} y1={20} x2={30} y2={20} style={{stroke: "red", strokeWidth: "2.5"}} />
                    <line x1={5} y1={78} x2={30} y2={78} style={{stroke: "green", strokeWidth: "2.5"}} />
                    <line x1={5} y1={130} x2={30} y2={130} style={{stroke: "yellow", strokeWidth: "2.5"}} />
                    {/*/!*Vertical Right Line*!/*/}
                    {/*<line x1={885.5} y1={265} x2={885.5} y2={25} style={{stroke: "rgb(0,0,0)"}} />*/}


                </svg>
            </div>
        );
    }
}