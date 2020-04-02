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
        if (!this.props.displayGraph) return null;

        return (
            <div>
                <h4 align={"center"} style={{color: "rgb(0, 255, 255)", marginBottom: "-15px"}}>Distance vs Time</h4>
                <LineGraph
                    {...this.props}
                    {...styles}
                />
            </div>
        );
    }
}
