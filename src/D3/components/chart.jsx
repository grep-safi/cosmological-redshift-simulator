import React       from 'react';
import LineGraph from './scatter-plot';

const styles = {
    width   : 800,
    height  : 300,
    padding : 30,
};

export default class Chart extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
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
