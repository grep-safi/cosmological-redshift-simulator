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
                <br />
                <fieldset>
                    <legend id="parameterText">Parameters</legend>
                    <SingleVariableControl
                        name={"initialSeparationDistance"}
                        displayName={"Initial Separation Distance: "}
                        className={"separationParameter"}
                        min={3.0}
                        max={10.0}
                        step={0.01}
                        decimals={2}
                        value={this.props.params.initialSeparationDistance}
                        onChange={this.handleSingleVariableChange}
                        backgroundColors={this.props.backgroundColors}
                    />
                    <br />
                    <SingleVariableControl
                        name={"expansionRate"}
                        displayName={"Universe Expansion Rate: "}
                        className={"expansionParameter"}
                        min={0.00}
                        max={13.00}
                        step={0.01}
                        decimals={2}
                        value={this.props.params.expansionRate}
                        onChange={this.handleSingleVariableChange}
                        backgroundColors={this.props.backgroundColors}
                    />
                    <br />
                </fieldset>
                <br />
            </React.Fragment>
        )
    }

    handleSingleVariableChange(key, value) {
        let separationDistChangeIsLegal = !(key === 'initialSeparationDistance'
            && this.props.simulationStarted);
        let expansionRateChangeIsLegal = !(key === 'expansionRate' && this.props.isPlaying);
        if (separationDistChangeIsLegal && expansionRateChangeIsLegal) {
            this.props.onChange({
                ...this.props.params,
                [key]: value
            });
            return;
        }

        if (!expansionRateChangeIsLegal) {
            alert("Hit pause and then change expansion rate!");
            return;
        }

        // If they're trying to change initial separation distance after the simulation has started
        alert("You can't change the INITIAL Separation Distance after starting the simulation, silly." +
            " Hit reset and give it another go");
    }
}

Parameters.propTypes = {
    params: PropTypes.exact({ initialSeparationDistance: PropTypes.number.isRequired, expansionRate: PropTypes.number.isRequired,
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    simulationStarted: PropTypes.bool.isRequired
};

