import React from 'react';
import ReactDOM from 'react-dom';
import Redshift from './Redshift';
import NavBar from "./UserControls/NavBar";
import Parameters from "./UserControls/Parameters";
import Chart from "./D3/components/chart.jsx";

class CosmologicalRedshiftSim extends React.Component {
    constructor(props) {
        super(props);
        this.initialState = {
            parameters: {
                initialSeparationDistance: 175,
                expansionRate: 10,
            },

            lightValuesSet: new Set(),
            lightTravelledDistances: [0],

            targetDistancesSet: new Set(),
            targetDistances: [175],

            animationRate: 1.5,
            startBtnText: 'play animation',
            isPlaying: false,
            simulationStarted: false,
            simulationEnded: false,

            distanceTravelledLight: 0,
            distanceTravelledBodies: 0,
        };


        this.state = this.initialState;

        // Initializing the sets with their initial data values
        this.state.lightValuesSet.add(0);
        this.state.targetDistancesSet.add(this.state.parameters.initialSeparationDistance);

        this.raf = null;

        this.stopAnimation = this.stopAnimation.bind(this);
    }

    render() {
        return <React.Fragment>
            <NavBar
                onResetClick={this.onResetClick.bind(this)}
            />

            <div className="box">
                <Redshift
                    params={this.state.parameters}
                    distanceTravelledLight={this.state.distanceTravelledLight}
                    distanceTravelledBodies={this.state.distanceTravelledBodies}
                    isPlaying={this.state.isPlaying}
                    simulationStarted={this.state.simulationStarted}
                    changeSimState={() => {this.changeSimState()} }
                />
            </div>

            <div className="animationButton">
                <button type="box"
                        className="btn btn-danger btn-sm"
                        onClick={() => {this.onStartClick()} }>
                    {this.state.startBtnText}
                </button>
            </div>

            <div className="box">
                <Parameters
                    params={this.state.parameters}
                    onChange={this.handleNewParameters.bind(this)}
                    simulationStarted={this.state.simulationStarted}
                />
            </div>

            <div className="box">
                <Chart
                    lightValues={this.state.lightTravelledDistances}
                    targetDistances={this.state.targetDistances}
                />
            </div>
        </React.Fragment>;
    }

    handleNewParameters(newParams) {
        this.setState({ parameters: newParams });
    }

    changeSimState() {
        this.setState({
            simulationEnded: true
        })
    }

    animate() {
        if (this.state.simulationEnded) {
            return;
        }

        const me = this;
        let speedOfLight = 2;

        let newLightDist = me.state.distanceTravelledLight + speedOfLight;

        let newDistanceBetween = me.state.distanceTravelledBodies + (0.05 * me.state.parameters.expansionRate);
        let newTargetDistanceValue = (0.05 * me.state.parameters.expansionRate)
            + this.state.targetDistances[this.state.targetDistances.length - 1];

        if (me.state.isPlaying) {
            me.setState(({
                distanceTravelledLight: newLightDist,
                distanceTravelledBodies: newDistanceBetween,
                simulationStarted: true,

                lightValuesSet: me.state.lightValuesSet.add(newDistanceBetween),
                lightTravelledDistances: Array.from(me.state.lightValuesSet),

                targetDistancesSet: me.state.targetDistancesSet.add(newTargetDistanceValue),
                targetDistances: Array.from(me.state.targetDistancesSet)
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
        this.state.lightValuesSet.clear();
        this.state.lightValuesSet.add(0);

        this.state.targetDistancesSet.clear();
        this.state.targetDistancesSet.add(175);

        this.setState(this.initialState);
    }
}

const domContainer = document.querySelector('#sim-container');
ReactDOM.render(<CosmologicalRedshiftSim />, domContainer);
