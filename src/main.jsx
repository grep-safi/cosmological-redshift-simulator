import React from 'react';
import ReactDOM from 'react-dom';
import ZodiacStrip from './ZodiacStrip';
import { forceNumber } from './utils';

class CosmologicalRedshiftSim extends React.Component {
    constructor(props) {
        super(props);
        this.initialState = {
            radiusObserverPlanet: 1.00,
            radiusTargetPlanet: 2.40,
            animationRate: 1.5,
            holdObserver: 1.00,
            holdTarget: 2.40,
            distanceTravelled: 0,
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
                    distanceTravelled={this.state.distanceTravelled}
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
                <h4 id="text">Redshift Controls Sizes</h4>
                <div className="radiusText">
                    <label htmlFor="radObserverPlanetRange" id="text">Galaxy Distance</label>
                </div>
                <div className="observerInput">
                    <form onSubmit={this.onSubmitObserver.bind(this)}>
                        <input
                            className="input"
                            type="number"
                            min={0.25}
                            max={10.00}
                            step={0.01}
                            value={this.state.holdObserver}
                            onChange={this.changeValObserver.bind(this)}
                        />
                    </form>
                </div>

                <div className="observerSlider">
                    <input
                        type="range"
                        min={0.25}
                        max={10.00}
                        step={0.01}
                        value={this.state.radiusObserverPlanet}
                        // onChange={}
                    />
                </div>

                <div className="radiusText">
                    <label htmlFor="radTargetPlanetRange" id="text">Galaxy Expansion Rate</label>
                </div>
                <div className="targetInput">
                    <form onSubmit={this.onSubmitTarget.bind(this)}>
                        <input
                            className="input"
                            type="number"
                            min={0.25}
                            max={10.00}
                            step={0.01}
                            value={this.state.holdTarget}
                            onChange={this.changeValTarget.bind(this)}
                        />
                    </form>
                </div>

                <div className="targetSlider">
                    <input
                        type="range"
                        min={0.25}
                        max={10.00}
                        step={0.01}
                        value={this.state.radiusTargetPlanet}
                        // onChange={}
                    />
                </div>
            </div>
        </React.Fragment>;
    }

    animate() {
        const me = this;
        this.setState(prevState => ({
            distanceTravelled: prevState.distanceTravelled + me.state.animationRate
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

    onAnimationRateChange(e) {
        this.setState({
            animationRate: forceNumber(e.target.value)
        });
    }

    stopAnimation() {
        cancelAnimationFrame(this.raf);
    }

    onResetClick(e) {
        e.preventDefault();
        this.stopAnimation();
        this.setState(this.initialState);
    }

    onSubmitObserver(e) {
        e.preventDefault();
        this.onObserverPlanetRadiusChange(this.state.holdObserver);
    }

    onSubmitTarget(e) {
        e.preventDefault();
        this.onTargetPlanetRadiusChange(this.state.holdTarget);
    }

    changeValObserver(e) {
        let enteredValue = e.target.value;

        // This functionality ensures you cannoot
        // enter the same radius value for both
        // target and observer. But since the Prof didn't want it,
        // it's commented out for now.

        // let otherVal = this.state.holdTarget;
        // if (enteredValue == otherVal) {
        //     if (otherVal == 10.0) {
        //         enteredValue -= 0.01;
        //     } else {
        //         enteredValue += 0.01;
        //     }
        // }

        this.setState({holdObserver: enteredValue});
    }

    changeValTarget(e) {
        let enteredValue = e.target.value;

        // This functionality ensures you cannoot
        // enter the same radius value for both
        // target and observer. But since the Prof didn't want it,
        // it's commented out for now.

        // let otherVal = this.state.holdObserver;
        // if (enteredValue == otherVal) {
        //     if (otherVal == 10.0) {
        //         enteredValue -= 0.01;
        //     } else {
        //         enteredValue += 0.01;
        //     }
        // }

        this.setState({holdTarget: enteredValue});
    }
}

const domContainer = document.querySelector('#sim-container');
ReactDOM.render(<CosmologicalRedshiftSim />, domContainer);
