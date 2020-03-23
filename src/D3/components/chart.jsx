import React       from 'react';
import ScatterPlot from './scatter-plot';

const styles = {
    width   : 950,
    height  : 300,
    padding : 30,
};

export default class Chart extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        return <div>
            <h1>Graph</h1>
            <ScatterPlot
                data={this.props.lightValues}
                {...styles}
            />
        </div>
    }
}
