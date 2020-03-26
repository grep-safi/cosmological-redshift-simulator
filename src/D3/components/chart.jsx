import React       from 'react';
import LineGraph from './scatter-plot';

const styles = {
    width   : 850,
    height  : 300,
    padding : 45,
};

export default class Chart extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        console.log(`Light vals: ${this.props.lightValues}, targetDistances: ${this.props.targetDistances}, lightDistances: ${this.props.lightDistances}`);
        return (
            <div>
                <h1>Graph</h1>
                <LineGraph
                    data={this.props.lightValues}
                    targetDistances={this.props.targetDistances}
                    lightDistances={this.props.lightDistances}
                    {...styles}
                />
            </div>
        );
    }
}
