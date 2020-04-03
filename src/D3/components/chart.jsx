import React       from 'react';
import LineGraph from './LineGraph';

const styles = {
    width   : 600,
    height  : 260,
    padding : 45,
};

export default class Chart extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        // if (!this.props.displayGraph) return null;

        return (
            <div style={{
                visibility: this.props.displayGraph ? 'visible' : 'hidden'
            }}>
                <h4 className="graphTitleText" >Distance vs Time</h4>
                <LineGraph
                    {...this.props}
                    {...styles}
                />
            </div>
        );
    }
}
