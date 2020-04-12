import React from 'react';
import ReactDOM from 'react-dom';
import Redshift from './Redshift';
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
                initialSeparationDistance: 6.50,
                expansionRate: 6.50,
            },

            times: [0],
            targetDistances: [6.50],
            lightDistances: [6.50],
            lightTravelledDistances: [0],

            completeTimes: [0],
            completeTargetDistances: [6.50],
            completeLightDistances: [6.50],
            completeLightTravelledDistances: [0],

            animationRate: 20,
            startBtnText: 'play animation',
            isPlaying: false,
            simulationStarted: false,
            simulationEnded: false,

            distanceTravelledLight: 6.50,
            distanceBetweenBodies: 6.50,

            index: 0,
            maxIndex: 0,
            simulationWillNeverEnd: false,

            backgroundStars: data,



            q1: 0,
            q2: 0,
            q3: 0,
            q4: 0,
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

            <Redshift
                params={this.state.parameters}
                distanceTravelledLight={this.state.distanceTravelledLight}
                distanceBetweenBodies={this.state.distanceBetweenBodies}
                isPlaying={this.state.isPlaying}
                simulationStarted={this.state.simulationStarted}
                changeSimState={() => { this.changeSimState() }}
            />

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

            <div id={"topHalf"}>
                <Chart
                    lightValues={this.state.lightTravelledDistances}
                    targetDistances={this.state.targetDistances}
                    lightDistances={this.state.lightDistances}
                    times={this.state.times}
                />

                <Legend/>

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

            <div style={{ visibility: this.state.simulationWillNeverEnd ? 'visible' : 'hidden' }}>>
                <div className="paramAlertText">
                    <svg width={500} height={100}>
                        <text
                            x="0"
                            y="30"
                            fill="orchid"
                        >
                            With this configuration, the light from the galaxy will never reach Earth
                        </text>
                    </svg>
                </div>
            </div>

            <div id={"dynamicBackground"}>
                <DynamicBackground
                    backgroundStars={this.state.backgroundStars}
                />
            </div>

        </React.Fragment>;
    }

    componentDidMount() {
        this.calculateData();
    }

    createBackground() {
        let width = 910;
        let height = 290;
        let maxRadius = 3.5;
        let numOfStars = 110;

        let bgStars = [];
        for (let i = 0; i < numOfStars; i++) {
            let circleX = Math.random() * (width - 5) + 5;
            let circleY = Math.random() * (height - 5) + 5;
            let radius = Math.random() * (maxRadius - 1) + 1;
            let starOpacity = Math.random() * (0.25) + 0.75;
            let fill = "rgba(255,255,255," + starOpacity + ")";

            let starProperties = {
                cx: circleX,
                cy: circleY,
                r: radius,
                fill: fill,
                key: i,
            };

            bgStars.push(starProperties);
        }

        this.setState({ backgroundStars: bgStars});
    };

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

        if (this.state.distanceBetweenBodies > 17) { this.shrinkBackground(); }

        this.state.targetDistances.push(this.state.completeTargetDistances[index]);
        this.state.lightDistances.push(this.state.completeLightDistances[index]);
        this.state.lightTravelledDistances.push(this.state.completeLightTravelledDistances[index]);
        this.state.times.push(this.state.completeTimes[index]);

        this.setState({
            distanceTravelledLight: this.state.completeLightDistances[index],
            distanceBetweenBodies: this.state.completeTargetDistances[index],

            simulationStarted: true,

            targetDistances: this.state.targetDistances,
            lightDistances: this.state.lightDistances,
            lightTravelledDistances: this.state.lightTravelledDistances,
            times: this.state.times,

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

            let incrementX = circleX < 455 ? 0.25 : -0.25;
            // let incrementY = 0;
            let incrementY = circleY < 145 ? 0.05 : -0.05;

            circleX += incrementX;
            circleY += incrementY;

            let starProperties = {
                cx: circleX,
                cy: circleY,
                r: star.r,
                fill: star.fill,
                key: i,
            };

            if ((circleX > 455 - 1 && circleX < 455 + 1) || (circleY > 145 - 1 && circleY < 145 + 1 )) {
                continue;
            }
            newBackgroundStars.push(starProperties);
        }

        if (Math.random() > 0.8) {
            let circleX;
            let circleY;
            let shift = 20;

            if (Math.random() < 0.5) {
                if (Math.random() < 0.5) {
                    circleX = Math.random() * (shift) + width;
                } else {
                    circleX = Math.random() * shift * -1;
                    this.setState({ q3: this.state.q3 + 1});
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

            if (circleX >= width) {
                this.setState({ q1: this.state.q1 + 1});
            } else if (circleX <= 0) {
                this.setState({ q2: this.state.q2 + 1});
            }


            let radius = Math.random() * (3.5 - 1) + 1;
            let starOpacity = Math.random() * (0.25) + 0.75;
            let fill = "rgba(255,255,255," + starOpacity + ")";

            let starProperties = {
                cx: circleX,
                cy: circleY,
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
            targetDistances: [6.50],
            lightDistances: [6.50],
            lightTravelledDistances: [0],

            completeTimes: [0],
            completeTargetDistances: [6.50],
            completeLightDistances: [6.50],
            completeLightTravelledDistances: [0],
        });
    }
}

const domContainer = document.querySelector('#sim-container');
ReactDOM.render(<CosmologicalRedshiftSim />, domContainer);
