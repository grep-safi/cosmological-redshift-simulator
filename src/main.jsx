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
                initialSeparationDistance: 5,
                expansionRate: 0.1,
            },

            times: [0],
            targetDistances: [5],
            lightDistances: [5],
            lightTravelledDistances: [0],

            completeTimes: [0],
            completeTargetDistances: [5],
            completeLightDistances: [5],
            completeLightTravelledDistances: [0],

            animationRate: 1.5,
            startBtnText: 'play animation',
            isPlaying: false,
            simulationStarted: false,
            simulationEnded: false,

            distanceTravelledLight: 5,
            distanceBetweenBodies: 5,

            index: 0,
            maxIndex: 0,
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

            <div className="box">
                <Chart
                    lightValues={this.state.lightTravelledDistances}
                    targetDistances={this.state.targetDistances}
                    lightDistances={this.state.lightDistances}
                    times={this.state.times}
                />
            </div>
        </React.Fragment>;
    }

    componentDidMount() {
        this.calculateData();
    }

    calculateData() {
        let dt = 0.001;
        let expansion_rate = this.state.parameters.expansionRate;
        let current_time = this.state.times[this.state.times.length - 1];

        let current_separation = this.state.targetDistances[this.state.targetDistances.length - 1];
        let light_travel_distance = this.state.lightTravelledDistances[this.state.lightTravelledDistances.length - 1];
        let distance_to_light = this.state.lightDistances[this.state.lightDistances.length - 1];

        let index = this.state.index;

        let timeLines = this.state.completeTimes.slice(0, index);
        let target_distances = this.state.completeTargetDistances.slice(0, index);
        let light_distances = this.state.completeLightDistances.slice(0, index);
        let light_traveled_distances = this.state.completeLightTravelledDistances.slice(0, index);

        let maxSimIndex = this.state.index;
        while ((distance_to_light > 0) && maxSimIndex < 200000) {
            current_separation += current_separation * expansion_rate*dt;
            distance_to_light += distance_to_light * expansion_rate*dt;

            distance_to_light -= dt;
            light_travel_distance = light_travel_distance + dt;

            current_time += dt;

            timeLines.push(current_time);
            target_distances.push(current_separation);
            light_distances.push(distance_to_light);
            light_traveled_distances.push(light_travel_distance);

            maxSimIndex += 1;
        }
        console.log(`timeLines ${timeLines.length}, times: ${this.state.times.length}`);

        // console.log(`GREAT: light travelled distances first: ${light_traveled_distances[0]}
        //     last: ${light_traveled_distances[maxSimIndex - 1]}\``);
        //
        // console.log(`GREAT: light distances (bw earth and photon) first: ${light_distances[0]}
        //     last: ${light_distances[maxSimIndex - 1]}`);
        //
        // console.log(`GREAT: target distances first: ${target_distances[0]}
        //     last: ${target_distances[maxSimIndex - 1]}\``);

        // console.log(`index: ${this.state.index}`);
        this.setState({
            completeTimes: timeLines,
            completeTargetDistances: target_distances,
            completeLightDistances: light_distances,
            completeLightTravelledDistances: light_traveled_distances,
            maxIndex: maxSimIndex,

            lightTravelledDistances: light_traveled_distances.slice(0, this.state.index + 1),
            targetDistances:  target_distances.slice(0, this.state.index + 1),
            lightDistances: light_distances.slice(0, this.state.index + 1),
            times: timeLines.slice(0, this.state.index + 1),
        })
    }

    handleNewParameters(newParams) {
        this.setState({ parameters: newParams });

        if (!this.state.simulationStarted) {
            this.setState({
                completeTargetDistances: [newParams.initialSeparationDistance],
                completeLightDistances: [newParams.initialSeparationDistance],
                distanceBetweenBodies: newParams.initialSeparationDistance,

                distanceTravelledLight: newParams.initialSeparationDistance,
            })
        }
    }

    changeSimState() {
        this.setState({
            simulationEnded: true
        })
    }

    animate() {
        if (this.state.simulationEnded) return;

        console.log(`index: ${this.state.index}`);
        let index = this.state.index;

        this.state.targetDistances.push(this.state.completeTargetDistances[index]);
        this.state.lightDistances.push(this.state.completeLightDistances[index]);
        this.state.lightTravelledDistances.push(this.state.completeLightTravelledDistances[index]);
        this.state.times.push(this.state.completeTimes[index]);

        if (this.state.isPlaying) {
            this.setState({
                distanceTravelledLight: this.state.completeLightDistances[index],
                distanceBetweenBodies: this.state.completeTargetDistances[index],

                simulationStarted: true,

                targetDistances: this.state.targetDistances,
                lightDistances: this.state.lightDistances,
                lightTravelledDistances: this.state.lightTravelledDistances,
                times: this.state.times,

                index: this.state.index + 20,
                // index: this.state.index + 1,
                simulationEnded: index >= this.state.maxIndex - 21
            });
        }

        this.raf = requestAnimationFrame(this.animate.bind(this));
    }

    onStartClick() {
        if (!this.state.isPlaying) {
            this.calculateData();
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
        this.calculateData();
    }
}

const domContainer = document.querySelector('#sim-container');
ReactDOM.render(<CosmologicalRedshiftSim />, domContainer);
