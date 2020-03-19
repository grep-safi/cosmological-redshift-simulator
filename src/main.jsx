import React from 'react';
import ReactDOM from 'react-dom';
import ZodiacStrip from './ZodiacStrip';
import { forceNumber } from './utils';

class CosmologicalRedshiftSim extends React.Component {
    constructor(props) {
        super(props);
        this.initialState = {
            separationDistance: 2.00,
            expansionRate: 1.00,
            animationRate: 1.5,
            holdSeparationDistance: 2.00,
            holdExpansionRate: 1.00,
            distanceTravelledLight: 0,
            distanceTravelledBodies: 0,
            startBtnText: 'play animation',
            isPlaying: false,
        };

        this.state = this.initialState;
        this.raf = null;

        this.stopAnimation = this.stopAnimation.bind(this);
    }

    render() {
        return <React.Fragment>
            <nav className="navbar navbar-expand-md navbar-light bg-dark d-flex justify-content-between">
                <span className="navbar-brand mb-0 text-light h1">Cosmological Redshift Simulator</span>
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <a className="nav-link text-light" href="#" onClick={this.onResetClick.bind(this)}>Reset</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link text-light" href="#" data-toggle="modal" data-target="#helpModal">Help</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link text-light" href="#" data-toggle="modal" data-target="#aboutModal">About</a>
                    </li>
                </ul>
            </nav>
            <div className="bot">
                <ZodiacStrip
                    distanceTravelledLight={this.state.distanceTravelledLight}
                    separationDistance={this.state.separationDistance}
                />
            </div>
            
            <div className="animationButton">
                <button type="button"
                        className="btn btn-danger btn-sm"
                        onClick={this.onStartClick.bind(this)}>
                    {this.state.startBtnText}
                </button>
            </div>
                
            <div className="col">
                <h4 id="text">Redshift Controls</h4>
                <div className="radiusText">
                    <label htmlFor="radSeparationDistanceRange" id="text">Separation Distance</label>
                </div>
                <div className="separationDistanceInput">
                    <form onSubmit={this.onSubmitSeparationDistance.bind(this)}>
                        <input
                            className="input"
                            type="number"
                            min={0.25}
                            max={10.00}
                            step={0.01}
                            value={this.state.holdSeparationDistance}
                            onChange={this.changeValSeparationDistance.bind(this)}
                        />
                    </form>
                </div>

                <div className="separationDistanceSlider">
                    <input
                        type="range"
                        min={0.25}
                        max={10.00}
                        step={0.01}
                        value={this.state.separationDistance}
                        onChange={this.onSeparationDistanceChange.bind(this)}
                    />
                </div>

                <div className="radiusText">
                    <label htmlFor="radExpansionRateRange" id="text">Galaxy Expansion Rate</label>
                </div>
                <div className="expansionRateInput">
                    <form onSubmit={this.onSubmitExpansionRate.bind(this)}>
                        <input
                            className="input"
                            type="number"
                            min={0.25}
                            max={10.00}
                            step={0.01}
                            value={this.state.holdExpansionRate}
                            onChange={this.changeValExpansionRate.bind(this)}
                        />
                    </form>
                </div>

                <div className="expansionRateSlider">
                    <input
                        type="range"
                        min={0.25}
                        max={10.00}
                        step={0.01}
                        value={this.state.expansionRate}
                        onChange={this.onExpansionRateChange.bind(this)}
                    />
                </div>
            </div>
        </React.Fragment>;
    }

    animate() {
        const me = this;
        let speedOfLight = 3;
        let newLightDist = this.state.distanceTravelledLight + speedOfLight;
        let newSeparationDist = this.state.separationDistance + (0.05 * me.state.expansionRate);
        this.setState(({
            distanceTravelledLight: newLightDist,
            separationDistance: newSeparationDist
        }));

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

    onSubmitSeparationDistance(e) {
        e.preventDefault();
        this.onSeparationDistanceChange(this.state.holdSeparationDistance);
    }

    onSeparationDistanceChange(separationDist) {
        let newDist;
        if (typeof (separationDist) === 'object') {
            newDist = forceNumber(separationDist.target.value);
        } else {
            newDist = separationDist;
        }
        this.setState({
            separationDistance: newDist,
            holdSeparationDistance: newDist
        });
    }

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

    onSubmitExpansionRate(e) {
        e.preventDefault();
        this.onExpansionRateChange(this.state.holdExpansionRate);
    }

    changeValSeparationDistance(e) {
        let enteredValue = forceNumber(e.target.value);
        this.setState({holdSeparationDistance: enteredValue});
    }

    changeValExpansionRate(e) {
        let enteredValue = forceNumber(e.target.value);
        this.setState({holdExpansionRate: enteredValue});
    }
}

const domContainer = document.querySelector('#sim-container');
ReactDOM.render(<CosmologicalRedshiftSim />, domContainer);
