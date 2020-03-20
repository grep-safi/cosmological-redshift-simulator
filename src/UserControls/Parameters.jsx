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
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        return (
            <React.Fragment>
                <br/>
                <fieldset>
                    <legend>Parameters</legend>
                    <SingleVariableControl
                        name="initialSeparationDistance"
                        displayName="Initial Separation Distance"
                        min={100}
                        max={250}
                        step={0.01}
                        decimals={2}
                        value={this.props.params.initialSeparationDistance}
                        onChange={this.handleSingleVariableChange}
                    />
                    <br/>
                    <SingleVariableControl
                        name="expansionRate"
                        displayName="Expansion Rate"
                        min={3.00}
                        max={12.00}
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

    handleChange(newParams) {
        this.props.onChange(newParams);
    }

    handleSingleVariableChange(key, value) {
        let newChanges = this.props.params;
        newChanges[key] = value;
        this.props.onChange({
            newChanges
        });
    }
}

Parameters.propTypes = {
    onChange: PropTypes.func.isRequired,
    params: PropTypes.exact({
        initialSeparationDistance: PropTypes.number.isRequired,
        expansionRate: PropTypes.number.isRequired,
    }).isRequired,
}

