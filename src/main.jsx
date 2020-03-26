import React from 'react';
import ReactDOM from 'react-dom';
import Redshift from './Redshift';
import NavBar from "./UserControls/NavBar";
import Parameters from "./UserControls/Parameters";
import Chart from "./D3/components/chart.jsx";

const SCALING_FACTOR = 350;

const scaleToDistance = (pixel)    => pixel / SCALING_FACTOR;
const scaleToPixel    = (distance) => distance * SCALING_FACTOR;

class CosmologicalRedshiftSim extends React.Component {
    constructor(props) {
        super(props);
        this.initialState = {
            parameters: {
                initialSeparationDistance: 0.5,
                expansionRate: 10,
            },

            lightTravelledDistances: [0],
            targetDistances: [0.5],
            lightDistances: [0.5],

            animationRate: 1.5,
            startBtnText: 'play animation',
            isPlaying: false,
            simulationStarted: false,
            simulationEnded: false,

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
                    lightDistances={this.state.lightDistances}
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
        let rate = (0.05 * me.state.parameters.expansionRate);

        let newDistanceBetween = me.state.distanceTravelledBodies + rate;
        if (me.state.isPlaying) {
            // This should be light travelled distance
            this.updateDataSets(this.state.lightTravelledDistances, rate);
            // This should be distance between the bodies
            this.updateDataSets(this.state.targetDistances, rate);
            // This should be difference between light position and body position
            this.updateDataSets(this.state.lightDistances, -rate);

            me.setState(({
                distanceTravelledLight: newLightDist,
                distanceTravelledBodies: newDistanceBetween,
                simulationStarted: true,
            }));
        }

        this.raf = requestAnimationFrame(this.animate.bind(this));
    }

    updateDataSets(dataSet, progressionRate) {
        let possibleValue = progressionRate + dataSet[dataSet.length - 1];
        possibleValue = Math.round(possibleValue * 100000) / 100000;
        if (!dataSet.includes(possibleValue)) {
            this.setState({
                dataSet: dataSet.push(possibleValue)
            });
        }
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

        this.setState({
            lightTravelledDistances: [0],
            targetDistances:  [0.5],
            lightDistances: [0.5]
        });
    }
}

const domContainer = document.querySelector('#sim-container');
ReactDOM.render(<CosmologicalRedshiftSim />, domContainer);
