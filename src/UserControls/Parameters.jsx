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
                        min={3.0}
                        max={10.0}
                        step={0.01}
                        decimals={2}
                        value={this.props.params.initialSeparationDistance}
                        onChange={this.handleSingleVariableChange}
                    />
                    <br/>
                    <SingleVariableControl
                        name={"expansionRate"}
                        displayName={"Universe Expansion Rate: "}
                        min={0.00}
                        max={0.20}
                        step={0.01}
                        decimals={2}
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

        // If they're trying to change initial separation distance after the simulation has started
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

