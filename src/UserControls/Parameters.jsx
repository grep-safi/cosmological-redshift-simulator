import React from 'react';
import PropTypes from 'prop-types';
import SingleVariableControl from "./ControlUtils/SingleVariableControl";

/**
 * Parameters is a GUI interface that controls the
 * variables used to alter the orbit drawings in the OrbitView.
 */
export default class Parameters extends React.Component {
    constructor(props) {
        super(props);
        this.handleSingleVariableChange = this.handleSingleVariableChange.bind(this);
    }

    render() {
        return (
            <React.Fragment>
                <br/>
                <fieldset>
                    <legend>Parameters</legend>
                    <SingleVariableControl
                        name={"initialSeparationDistance"}
                        displayName={"Initial Separation Distance: "}
                        min={100}
                        max={250}
                        step={0.01}
                        decimals={0}
                        value={this.props.params.initialSeparationDistance}
                        onChange={this.handleSingleVariableChange}
                    />
                    <br/>
                    <SingleVariableControl
                        name={"expansionRate"}
                        displayName={"Universe Expansion Rate: "}
                        min={3.00}
                        max={20.00}
                        step={0.01}
                        decimals={1}
                        value={this.props.params.expansionRate}
                        onChange={this.handleSingleVariableChange}
                    />
                    <br/>
                </fieldset>
                <br/>
            </React.Fragment>
        )
    }

    handleSingleVariableChange(key, value) {
        let changeInitialParamIsLegal = !(key === 'initialSeparationDistance' && this.props.simulationStarted);
        if (changeInitialParamIsLegal) {
            this.props.onChange({
                ...this.props.params,
                [key]: value
            });
            return;
        }

        alert("You can't change the INITIAL Separation Distance after starting the simulation, silly." +
            " Hit reset and give it another go");
    }
}

Parameters.propTypes = {
    params: PropTypes.exact({
        initialSeparationDistance: PropTypes.number.isRequired,
        expansionRate: PropTypes.number.isRequired,
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    simulationStarted: PropTypes.bool.isRequired
};

