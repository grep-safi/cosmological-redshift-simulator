import React from 'react';
import ReactDOM from 'react-dom';
import ZodiacStrip from './ZodiacStrip';
import { forceNumber } from './utils';
import NavBar from "./UserControls/NavBar";
import Parameters from "./UserControls/Parameters";

class CosmologicalRedshiftSim extends React.Component {
    constructor(props) {
        super(props);
        this.initialState = {
            parameters: {
                initialSeparationDistance: 300,
                expansionRate: 1.00,
            },
            animationRate: 1.5,
            startBtnText: 'play animation',
            isPlaying: false,

            distanceTravelledLight: 0,
            distanceTravelledBodies: 0,
        };

        this.state = this.initialState;
        this.raf = null;

        this.stopAnimation = this.stopAnimation.bind(this);
    }

    render() {
        return <React.Fragment>
            <NavBar
                onResetClick={this.onResetClick.bind(this)}
            />

            <div className="bot">
                <ZodiacStrip
                    distanceTravelledLight={this.state.distanceTravelledLight}
                    initialSeparationDistance={this.state.initialSeparationDistance}
                    distanceBetween={this.state.distanceBetween}
                    isPlaying={this.state.isPlaying}
                />
            </div>

            <div className="animationButton">
                <button type="button"
                        className="btn btn-danger btn-sm"
                        onClick={this.onStartClick.bind(this)}>
                    {this.state.startBtnText}
                </button>
            </div>

            <div className="bot">
                <Parameters
                    params={this.state.parameters}
                    onChange={this.handleNewParameters.bind(this)}
                />
            </div>

        </React.Fragment>;
    }

    handleNewParameters(newParams) {
        this.setState({ planetaryParameters: newParams });
    }

    animate() {
        const me = this;
        let speedOfLight = 3;
        let newLightDist = this.state.distanceTravelledLight + speedOfLight;
        let newDistanceBetween = this.state.distanceBetween + (0.05 * me.state.expansionRate);
        if (this.state.isPlaying) {
            this.setState(({
                distanceTravelledLight: newLightDist,
                distanceBetween: newDistanceBetween,

            }));
        }

        this.raf = requestAnimationFrame(this.animate.bind(this));
    }

    onStartClick() {
        if (!this.state.isPlaying) {
            this.raf = requestAnimationFrame(this.animate.bind(this));
            this.setState({
                isPlaying: true,
                startBtnText: 'pause animation'
            });
        } else {
            this.stopAnimation();
            this.setState({
                isPlaying: false,
                startBtnText: 'play animation'
            });
        }
    }

    stopAnimation() {
        cancelAnimationFrame(this.raf);
    }

    onResetClick(e) {
        e.preventDefault();
        this.stopAnimation();
        this.setState(this.initialState);
    }

    // Runs when user is typing numbers in the box
    changeValInitialSeparationDistance(e) {
        let enteredValue = forceNumber(e.target.value);
        this.setState({holdInitialSeparationDistance: enteredValue});
    }

    // Runs when user is typing numbers in the box
    changeValExpansionRate(e) {
        let enteredValue = forceNumber(e.target.value);
        this.setState({holdExpansionRate: enteredValue});
    }

    // Runs when user hits enter after typing in the number in the box
    onSubmitInitialSeparationDistance(e) {
        e.preventDefault();
        this.onInitialSeparationDistanceChange(this.state.holdInitialSeparationDistance);
    }

    // Runs when user hits enter after typing in the number in the box
    onSubmitExpansionRate(e) {
        e.preventDefault();
        this.onExpansionRateChange(this.state.holdExpansionRate);
    }

    // Runs either after user hits enter (method chaining) or when the slider is being dragged
    onInitialSeparationDistanceChange(initialSeparationDist) {
        let newDist;
        if (typeof (initialSeparationDist) === 'object') {
            newDist = forceNumber(initialSeparationDist.target.value);
        } else {
            newDist = initialSeparationDist;
        }

        this.setState({
            initialSeparationDistance: newDist,
            distanceBetween: newDist,
            holdInitialSeparationDistance: newDist
        });
    }

    // Runs either after user hits enter (method chaining) or when the slider is being dragged
    onExpansionRateChange(expansionRate) {
        let newExpansionRate;
        if (typeof (expansionRate) === 'object') {
            newExpansionRate = forceNumber(expansionRate.target.value);
        } else {
            newExpansionRate = expansionRate;
        }

        this.setState({
            expansionRate: newExpansionRate,
            holdExpansionRate: newExpansionRate
        });
    }
}

const domContainer = document.querySelector('#sim-container');
ReactDOM.render(<CosmologicalRedshiftSim />, domContainer);
