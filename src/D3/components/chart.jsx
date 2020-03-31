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
        // console.log(`Time array: ${this.props.times}`);
        return (
            <div>
                <h1>Graph</h1>
                <LineGraph
                    {...this.props}
                    {...styles}
                />
            </div>
        );
    }
}
