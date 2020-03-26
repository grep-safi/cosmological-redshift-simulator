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
                initialSeparationDistance: 50,
                expansionRate: 1.0,
            },

            targetDistances: [50],
            lightDistances: [50],
            lightTravelledDistances: [0],
            times: [0],

            animationRate: 1.5,
            startBtnText: 'play animation',
            isPlaying: false,
            simulationStarted: false,
            simulationEnded: false,

            distanceTravelledLight: 0,
            distanceBetweenBodies: 50,
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
                    distanceBetweenBodies={this.state.distanceBetweenBodies}
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

            {/*<div className="box">*/}
            {/*    <Chart*/}
            {/*        lightValues={this.state.lightTravelledDistances}*/}
            {/*        targetDistances={this.state.targetDistances}*/}
            {/*        lightDistances={this.state.lightDistances}*/}
            {/*        times={this.state.times}*/}
            {/*    />*/}
            {/*</div>*/}
        </React.Fragment>;
    }

    handleNewParameters(newParams) {
        this.setState({ parameters: newParams });

        if (!this.state.simulationStarted) {
            this.setState({
                targetDistances: [newParams.initialSeparationDistance],
                lightDistances: [newParams.initialSeparationDistance],
                distanceBetweenBodies: newParams.initialSeparationDistance
            })
        }
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

        let dt = 0.50;
        let currentSeparation = this.state.targetDistances[this.state.targetDistances.length - 1];
        let ratePerYear = this.state.parameters.expansionRate / 100.0;
        currentSeparation = currentSeparation + currentSeparation * ratePerYear * dt;

        let distToLight = this.state.lightDistances[this.state.lightDistances.length - 1];
        distToLight = distToLight + distToLight * ratePerYear * dt;
        distToLight = distToLight - dt;

        let lightTravel = this.state.lightTravelledDistances[this.state.lightDistances.length - 1];
        lightTravel = lightTravel + dt;

        let currentTime = this.state.times[this.state.times.length - 1] + dt;

        // Update array values
        this.state.targetDistances.push(currentSeparation);
        this.state.lightDistances.push(distToLight);
        this.state.lightTravelledDistances.push(lightTravel);
        this.state.times.push(currentTime);

        if (this.state.isPlaying) {
            this.setState({
                distanceTravelledLight: lightTravel,
                distanceBetweenBodies: currentSeparation,
                simulationStarted: true,
                targetDistances: this.state.targetDistances,
                lightDistances: this.state.lightDistances,
                lightTravelledDistances: this.state.lightTravelledDistances,
                times: this.state.times,
            });
        }

        this.raf = requestAnimationFrame(this.animate.bind(this));
    }

    // updateDataSets(dataSet, progressionRate) {
    //     let possibleValue = progressionRate + dataSet[dataSet.length - 1];
    //     possibleValue = Math.round(possibleValue * 100000) / 100000;
    //     if (!dataSet.includes(possibleValue)) {
    //         this.setState({
    //             dataSet: dataSet.push(possibleValue)
    //         });
    //     }
    // }

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
            targetDistances:  [50],
            lightDistances: [50],
            times: [0]
        });
    }
}

const domContainer = document.querySelector('#sim-container');
ReactDOM.render(<CosmologicalRedshiftSim />, domContainer);
