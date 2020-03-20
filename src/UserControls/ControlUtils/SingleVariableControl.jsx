import React from "react";
import PropTypes from 'prop-types';
import NumberInputField from "./NumberInputField";

/**
 * A Single Variable Control is a combination of both a number input box and a
 * slider.  It can be used to adjust a single "planetary parameter" at a time.
 * @extends React
 */

export default class SingleVariableControl extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const value = Number.parseFloat(this.props.value).toFixed(this.props.decimals);
        return (
            <label>
                {this.props.displayName}:&nbsp;
                <NumberInputField
                    type="number"
                    name={this.props.name}
                    min={this.props.min}
                    max={this.props.max}
                    step={this.props.step}
                    onNewValue={this.handleNewValue.bind(this)}
                    value={this.props.value}
                    decimals={this.props.decimals}
                />
                <input
                    type="range"
                    name={this.props.name}
                    min={this.props.min}
                    max={this.props.max}
                    step={this.props.step}
                    onChange={this.handleChange.bind(this)}
                    value={value}
                />
            </label>
        )
    }

    handleNewValue(value) {
        let name = this.props.name;
        value = this.convertEntryToValidNumber(value);
        this.props.onChange(name, value);
    }

    handleChange(event) {
        let name = this.props.name;
        let value = this.convertEntryToValidNumber(event.target.value);
        this.props.onChange(name, value);
    }

    /**
     * Converts string into a number, and ensures that it is within the valid
     * range of numbers, using the "min" and "max" provided by the props passed
     * to this component.
     * @param  {String} value The direct input string from user.
     * @return {Number} The validated number output
     */
    convertEntryToValidNumber(value) {
        let type = typeof(value);
        if (isNaN(value) || type !== 'string' && type !== 'number') {
            return this.props.min;
        }
        value = Number.parseFloat(value);
        value = Math.min(this.props.max, value);
        value = Math.max(this.props.min, value);
        return value;
    }

}

SingleVariableControl.propTypes = {
    name: PropTypes.string,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    value: PropTypes.number,
    decimals: PropTypes.number,
    onChange: PropTypes.func,
    displayName: PropTypes.string,
}