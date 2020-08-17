import React from 'react';
import ReactDOM from 'react-dom';
import NavBar from "./UserControls/NavBar";
import Parameters from "./UserControls/Parameters";
import Chart from "./D3/components/Chart";
import Legend from "./D3/components/Legend";
import DynamicBackground from "./DynamicBackground";
import { data } from './Data';

const getScaledInitialSeparation = (initDist, currDist) => {
    let initialSeparation = initDist / 2;
    let currWidth = 17.228377773099474;
    let maxWidth = currDist > currWidth ? currDist : currWidth;
    initialSeparation = (initialSeparation / maxWidth) * 860;
    initialSeparation = initialSeparation > 0.5 ? initialSeparation : 0.5;
    return initialSeparation;
};

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
            alertUser: false,
            notified: false,

            distanceTravelledLight: 7.00,
            distanceBetweenBodies: 7.00,

            index: 0,
            maxIndex: 0,
            simulationWillNeverEnd: false,
            autoPause: true,

            backgroundStars: data,
            wavelength: 400,
            redShift: 0,
            hubbleConstant: 98,
            lightWavelengthColor: "#8300b5",
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
                <div className="animationSlider">
                    <h6  id="animationSpeedText">Animation </h6>
                    <h6  id="animationSpeedTextLineTwo">Speed</h6>
                    <input
                        type="range"
                        id="animationSliderRange"
                        min={1}
                        max={100}
                        step={1}
                        value={this.state.animationRate}
                        onChange={this.changeAnimationRate.bind(this)}
                    />
                </div>

                <Chart
                    lightValues={this.state.lightTravelledDistances}
                    targetDistances={this.state.targetDistances}
                    lightDistances={this.state.lightDistances}
                    times={this.state.times}
                />

                <div className="legendAndText">
                    <Legend />

                    <div className={"timeElapsed"}>
                        <p className={"timeText"}>Time Elapsed: </p>
                        <p className={"timeText"}>{this.getTimeElapsed()}</p>
                        <p className={"timeText"}>Billions of Years</p>
                    </div>
                </div>
            </div>

            <div id={"dynamicBackground"}>
                <DynamicBackground
                    params={this.state.parameters}
                    distanceTravelledLight={this.state.distanceTravelledLight}
                    distanceBetweenBodies={this.state.distanceBetweenBodies}
                    isPlaying={this.state.isPlaying}
                    simulationStarted={this.state.simulationStarted}
                    backgroundStars={this.state.backgroundStars}
                    lightWavelengthColor={this.state.lightWavelengthColor}
                />
            </div>

            <div className={"bottom-half"}>

                <div className="parameters">
                    <h4 id="parameterText">Parameters</h4>

                    <Parameters
                        params={this.state.parameters}
                        onChange={this.handleNewParameters.bind(this)}
                        simulationStarted={this.state.simulationStarted}
                        simulationEnded={this.state.simulationEnded}
                        isPlaying={this.state.isPlaying}
                        changeAnimationState={this.changeAnimationState.bind(this)}
                    />
                </div>


                <div className={"criticalValues"}>
                    <p className={"darkcyan-text"}>Wavelength:</p>
                    <p className={"darkgoldenrod-text"}>{this.state.wavelength.toFixed(0)} nm</p>
                    <p className={"darkcyan-text"}>Redshift Factor (Z):</p>
                    <p className={"darkgoldenrod-text"}>{this.state.redShift.toFixed(1)}</p>
                    <p className={"darkcyan-text"}>Hubble Constant:</p>
                    <p className={"darkgoldenrod-text"}>{this.state.hubbleConstant.toFixed(0)} km/s / Mpc</p>
                </div>

                <div className="animation-and-survey-btns">
                    <div className="animationButton">
                        <button type="box"
                                className="btn btn-danger btn-sm"
                                onClick={this.onStartClick.bind(this)}>
                            {this.state.startBtnText}
                        </button>
                    </div>

                    <div className="survey">
                        <a href="https://tinyurl.com/yd4n28bx"
                           target="_blank"
                           rel="noopener noreferrer">
                            <button type="button" className="btn btn-warning">Give us feedback!</button>
                        </a>
                    </div>
                </div>

            </div>
        </React.Fragment>;
    }

    changeAnimationState() {
        this.setState({
            isPlaying: false,
            startBtnText: 'play animation'
        });
    }

    getTimeElapsed() {
        return this.state.times[this.state.times.length - 1].toFixed(2);
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
        let hubbleConst = (newParams.expansionRate / 100) * 978.440076093849;
        this.setState({
            parameters: newParams,
            hubbleConstant: hubbleConst
        });

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

    notifyUser() {
        let CENTER_X = 460;
        let SCALING_FACTOR = 50;
        let sizeShift = 10;
        let scaleToPixel = distance => distance * SCALING_FACTOR;
        let distanceFromCenter = scaleToPixel(this.state.distanceBetweenBodies / 2);

        let initSeparation = getScaledInitialSeparation(this.state.parameters.initialSeparationDistance,
            this.state.distanceBetweenBodies);

        let xPositionEarth;
        if (!(distanceFromCenter > CENTER_X - 40)) {
            xPositionEarth = CENTER_X + distanceFromCenter - sizeShift;
        } else {
            xPositionEarth = 868.2624688305211;
        }

        let initialLightLine = CENTER_X - initSeparation;
        let finalLightLine = xPositionEarth - scaleToPixel(this.state.distanceTravelledLight) + 15;
        if (!this.state.simulationStarted) finalLightLine = initialLightLine;

        return initialLightLine - finalLightLine > 0;
    }

    animate() {
        if (this.state.simulationEnded || !this.state.isPlaying) return;

        if (this.state.autoPause && !this.state.notified && this.notifyUser()) {
            alert('The simulation will never end because light will never reach Earth');
            this.setState({ notified: true });
        }

        let index = this.state.index;
        let speedOfAnimation = this.state.animationRate;

        let simulationWillComplete = index >= this.state.maxIndex - (speedOfAnimation + 1);
        if (simulationWillComplete) { index = this.state.maxIndex - 1; }

        // If the Galaxy and Earth is on the edge, then shrink the background
        if (this.state.distanceBetweenBodies >  17.228377773099474) { this.shrinkBackground(); }

        this.state.targetDistances.push(this.state.completeTargetDistances[index]);
        this.state.lightDistances.push(this.state.completeLightDistances[index]);
        this.state.lightTravelledDistances.push(this.state.completeLightTravelledDistances[index]);
        this.state.times.push(this.state.completeTimes[index]);

        let ratio = this.state.completeTargetDistances[index] / this.state.parameters.initialSeparationDistance;
        // new wavelength
        let wv = ratio * 400;

        // color of light
        let hexColor = this.getHex(wv);
        let redShiftValue = ratio - 1;

        this.setState({
            distanceTravelledLight: this.state.completeLightDistances[index],
            distanceBetweenBodies: this.state.completeTargetDistances[index],

            simulationStarted: true,

            index: this.state.index + speedOfAnimation,
            simulationEnded: simulationWillComplete,
            wavelength: wv,
            redShift: redShiftValue,
            lightWavelengthColor: hexColor,
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

    changeAutoPause(e) {
        this.setState({
            autoPause: !this.state.autoPause,
        });
    }

    decimalToHex(dec) {
        let d = Math.round(dec);
        let hex = d.toString(16);
        while (hex.length < 2) {
            hex = "0" + hex;
        }

        return hex;
    }

    getHex(wavelength)
    {
        let w = parseFloat(wavelength);
        let red = 0;
        let green = 0;
        let blue = 0;

        if (w >= 380 && w < 440)
        {
            red   = -(w - 440) / (440 - 380);
            green = 0.0;
            blue  = 1.0;
        }
        else if (w >= 440 && w < 490)
        {
            red   = 0.0;
            green = (w - 440) / (490 - 440);
            blue  = 1.0;
        }
        else if (w >= 490 && w < 510)
        {
            red   = 0.0;
            green = 1.0;
            blue  = -(w - 510) / (510 - 490);
        }
        else if (w >= 510 && w < 580)
        {
            red   = (w - 510) / (580 - 510);
            green = 1.0;
            blue  = 0.0;
        }
        else if (w >= 580 && w < 645)
        {
            red   = 1.0;
            green = -(w - 645) / (645 - 580);
            blue  = 0.0;
        }
        else if (w >= 645 && w < 781)
        {
            red   = 1.0;
            green = 0.0;
            blue  = 0.0;
        }
        else
        {
            red   = 0.0;
            green = 0.0;
            blue  = 0.0;
        }


        // Let the intensity fall off near the vision limits
        let factor = 0;
        if (w >= 380 && w < 420)
            factor = 0.3 + 0.7*(w - 380) / (420 - 380);
        else if (w >= 420 && w < 701)
            factor = 1.0;
        else if (w >= 701 && w < 781)
            factor = 0.3 + 0.7*(780 - w) / (780 - 700);
        else
            factor = 0.0;

        let gamma = 0.80;
        let R = (red   > 0 ? 255*Math.pow(red   * factor, gamma) : 0);
        let G = (green > 0 ? 255*Math.pow(green * factor, gamma) : 0);
        let B = (blue  > 0 ? 255*Math.pow(blue  * factor, gamma) : 0);

        return "#" + this.decimalToHex(R) + this.decimalToHex(G) + this.decimalToHex(B);
    }
}


const domContainer = document.querySelector('#React-Simulation');
ReactDOM.render(<CosmologicalRedshiftSim />, domContainer);
