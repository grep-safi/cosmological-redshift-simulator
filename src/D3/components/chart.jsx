import React       from 'react';
import LineGraph from './scatter-plot';

const styles = {
    width   : 930,
    height  : 300,
    padding : 45,
};

export default class Chart extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
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
