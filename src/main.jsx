import React from 'react';
import ReactDOM from 'react-dom';
import NavBar from "./UserControls/NavBar";
import Parameters from "./UserControls/Parameters";
import Chart from "./D3/components/Chart";
import Legend from "./D3/components/Legend";
import DynamicBackground from "./DynamicBackground";
import { data } from './Data';

class CosmologicalRedshiftSim extends React.Component {
    constructor(props) {
        super(props);
        this.initialState = {
            parameters: {
                initialSeparationDistance: 7.00,
                expansionRate: 10.0,
            },

            times: [0],
            targetDistances: [7.00],
            lightDistances: [7.00],
            lightTravelledDistances: [0],

            completeTimes: [0],
            completeTargetDistances: [7.00],
            completeLightDistances: [7.00],
            completeLightTravelledDistances: [0],

            animationRate: 70,
            startBtnText: 'play animation',
            isPlaying: false,
            simulationStarted: false,
            simulationEnded: false,

            distanceTravelledLight: 7.00,
            distanceBetweenBodies: 7.00,

            index: 0,
            maxIndex: 0,
            simulationWillNeverEnd: false,

            backgroundStars: data,
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

            <div id={"topHalf"}>
                <Chart
                    lightValues={this.state.lightTravelledDistances}
                    targetDistances={this.state.targetDistances}
                    lightDistances={this.state.lightDistances}
                    times={this.state.times}
                />

                <Legend />

                <div className="animationSlider">
                    <h6  id="animationSpeedText">Animation </h6>
                    <h6  id="animationSpeedTextLineTwo">Speed</h6>
                    <input
                        type="range"
                        min={1}
                        max={100}
                        step={1}
                        value={this.state.animationRate}
                        onChange={this.changeAnimationRate.bind(this)}
                    />
                </div>

            </div>

            <div id={"dynamicBackground"}>
                <DynamicBackground
                    params={this.state.parameters}
                    distanceTravelledLight={this.state.distanceTravelledLight}
                    distanceBetweenBodies={this.state.distanceBetweenBodies}
                    isPlaying={this.state.isPlaying}
                    simulationStarted={this.state.simulationStarted}
                    changeSimState={() => { this.changeSimState() }}
                    backgroundStars={this.state.backgroundStars}
                />
            </div>

            <div className="animationButton">
                <button type="box"
                        className="btn btn-danger btn-sm"
                        onClick={() => this.onStartClick()}>
                    {this.state.startBtnText}
                </button>
            </div>

            <div className="parameters">
                <Parameters
                    params={this.state.parameters}
                    onChange={this.handleNewParameters.bind(this)}
                    simulationStarted={this.state.simulationStarted}
                    simulationEnded={this.state.simulationEnded}
                    isPlaying={this.state.isPlaying}
                />
            </div>

            <div className={"units"}>
                <p id={"separationUnits"}>Billion Light Years</p>
                <p id={"expansionUnits"}>% per Billion Years</p>
            </div>

        </React.Fragment>;
    }

    componentDidMount() { this.calculateData(); }

    /**
     * calculateData() completes the underlying calculation for the data
     * and stores it within four arrays:
     * 1. Time array
     * 2. Target distances array
     * 3. Light Distances array
     * 4. Light travelled distances array
     *
     * Each of these is then stored as state variables with the word
     * "complete" prepended to them (because we do not want the graph and
     * drawings to be immediately displayed--rather, we need it to be "animated")
     */
    calculateData() {
        let dt = 0.001;
        let expansion_rate = this.state.parameters.expansionRate / 100;
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
            current_separation += current_separation * expansion_rate * dt;
            distance_to_light += distance_to_light * expansion_rate * dt;

            distance_to_light -= dt;
            light_travel_distance = light_travel_distance + dt;

            current_time += dt;

            timeLines.push(current_time);
            target_distances.push(current_separation);
            light_distances.push(distance_to_light);
            light_traveled_distances.push(light_travel_distance);

            maxSimIndex += 1;
        }

        this.setState({
            completeTimes: timeLines,
            completeTargetDistances: target_distances,
            completeLightDistances: light_distances,
            completeLightTravelledDistances: light_traveled_distances,
            maxIndex: maxSimIndex,

            lightTravelledDistances: this.state.lightTravelledDistances.slice(0, this.state.index + 1),
            targetDistances: this.state.targetDistances.slice(0, this.state.index + 1),
            lightDistances: this.state.lightDistances.slice(0, this.state.index + 1),
            times: this.state.times.slice(0, this.state.index + 1),

            simulationWillNeverEnd: maxSimIndex === 200000,
        });
    }

    handleNewParameters(newParams) {
        this.setState({ parameters: newParams });

        if (!this.state.simulationStarted) {
            this.setState({
                completeTargetDistances: [newParams.initialSeparationDistance],
                completeLightDistances: [newParams.initialSeparationDistance],

                targetDistances: [newParams.initialSeparationDistance],
                lightDistances: [newParams.initialSeparationDistance],

                distanceBetweenBodies: newParams.initialSeparationDistance,
                distanceTravelledLight: newParams.initialSeparationDistance,
            })
        }
    }

    animate() {
        if (this.state.simulationEnded) return;

        let index = this.state.index;
        let speedOfAnimation = this.state.animationRate;

        let simulationWillComplete = index >= this.state.maxIndex - (speedOfAnimation + 1);
        if (simulationWillComplete) { index = this.state.maxIndex - 1; }

        if (this.state.distanceBetweenBodies >  17.228377773099474) { this.shrinkBackground(); }
        // this.shrinkBackground();

        // console.log(`length of arr: ${this.state.backgroundStars.length}`);

        this.state.targetDistances.push(this.state.completeTargetDistances[index]);
        this.state.lightDistances.push(this.state.completeLightDistances[index]);
        this.state.lightTravelledDistances.push(this.state.completeLightTravelledDistances[index]);
        this.state.times.push(this.state.completeTimes[index]);

        this.setState({
            distanceTravelledLight: this.state.completeLightDistances[index],
            distanceBetweenBodies: this.state.completeTargetDistances[index],

            simulationStarted: true,

            // targetDistances: this.state.targetDistances,
            // lightDistances: this.state.lightDistances,
            // lightTravelledDistances: this.state.lightTravelledDistances,
            // times: this.state.times,

            index: this.state.index + speedOfAnimation,
            simulationEnded: simulationWillComplete,
        });

        this.raf = requestAnimationFrame(this.animate.bind(this));
    }

    shrinkBackground() {
        let width = 910;
        let height = 290;

        let newBackgroundStars = [];
        for (let i = 0; i < this.state.backgroundStars.length; i++) {
            let star = this.state.backgroundStars[i];
            let circleX = star.cx;
            let circleY = star.cy;
            let radius = star.r;
            let distToCenter = Math.sqrt(Math.pow((circleX - (width / 2)), 2) + Math.pow((circleY - (height / 2)), 2));

            let speedOfConvergence = this.state.animationRate / 500;

            let incrementX = star.deltaX * speedOfConvergence;
            let incrementY = star.deltaY * speedOfConvergence;
            let incrementRadius = (1 - (distToCenter / 1100)) * speedOfConvergence / 35;
            // let rad = (1 -)
            // let incrementRadius = (1 - (distToCenter / 1100)) * speedOfConvergence / 20;

            circleX -= incrementX;
            circleY -= incrementY;
            radius -= incrementRadius;
            // Make sure radius isn't negative or it'll throw an error
            radius = radius < 0 ? 0 : radius;

            let starProperties = {
                cx: circleX,
                cy: circleY,
                deltaX: star.deltaX,
                deltaY: star.deltaY,
                r: radius,
                fill: star.fill,
                key: star.key,
                center: star.center,
            };

            if (star.center === undefined && (circleX > 455 - 1 && circleX < 455 + 1) && (circleY > 145 - 1 && circleY < 145 + 1 )) {
                // console.log(`im being deleted`);
                continue;
            }

            newBackgroundStars.push(starProperties);
        }

        for(let i = 0; i < (110 - newBackgroundStars.length); i++) {
            let circleX;
            let circleY;
            let shift = 1;

            if (Math.random() < 0.5) {
                if (Math.random() < 0.5) {
                    circleX = Math.random() * (shift) + width;
                } else {
                    circleX = Math.random() * shift * -1;
                }

                circleY = Math.random() * height;
            } else {
                if (Math.random() < 0.5) {
                    circleY = Math.random() * (shift) + height;
                } else {
                    circleY = Math.random() * shift * -1;
                }

                circleX = Math.random() * width;
            }

            let radius = Math.random() * (3.5 - 1) + 1;
            let starOpacity = Math.random() * (0.25) + 0.75;
            let fill = "rgba(255,255,255," + starOpacity + ")";

            let theta = Math.atan2(circleY - (height / 2), circleX - (width / 2));
            let alpha = 5;
            let deltaX = (alpha * Math.cos(theta));
            let deltaY = (alpha * Math.sin(theta));

            let starProperties = {
                cx: circleX,
                cy: circleY,
                deltaX: deltaX,
                deltaY: deltaY,
                r: radius,
                fill: fill,
                key: newBackgroundStars.length + 1,
            };

            newBackgroundStars.push(starProperties);
        }

        this.setState({ backgroundStars: newBackgroundStars});
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

    changeAnimationRate(event) {
        this.setState({ animationRate: Number.parseFloat(event.target.value), });
    }

    stopAnimation() {
        cancelAnimationFrame(this.raf);
    }

    onResetClick(e) {
        e.preventDefault();
        this.stopAnimation();
        this.setState(this.initialState);

        // Reset the array values
        this.setState({
            times: [0],
            targetDistances: [7.00],
            lightDistances: [7.00],
            lightTravelledDistances: [0],

            completeTimes: [0],
            completeTargetDistances: [7.00],
            completeLightDistances: [7.00],
            completeLightTravelledDistances: [0],
        });
    }
}

const domContainer = document.querySelector('#React-Simulation');
ReactDOM.render(<CosmologicalRedshiftSim />, domContainer);
