import React from 'react';
import PropTypes from 'prop-types';
import * as PIXI from 'pixi.js';

// The coordinates for the center of the canvas
// REMINDER: (0,0) is at the top left corner and
// the positive Y direction is DOWN, not UP.
const ORBIT_CENTER_X = 305;
const ORBIT_CENTER_Y = 100;

const getPlanetPos = function(radius, phase) {
    return new PIXI.Point(
        radius * Math.cos(-phase) + ORBIT_CENTER_X,
        radius * Math.sin(-phase) + ORBIT_CENTER_Y
    );
};

export default class MainView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isHoveringOnSun: false,
            isHoveringOnObserverPlanet: false,
            isHoveringOnTargetPlanet: false,
            isHoveringOnConstellation: false
        };

        this.resources = {};

        this.orbitCenter = new PIXI.Point(ORBIT_CENTER_X, ORBIT_CENTER_Y);

        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.animate = this.animate.bind(this);
    }

    render() {
        return (
            <div className="MainView"
                 ref={(thisDiv) => {this.el = thisDiv;}} />
        );
    }

    componentDidMount() {
        this.app = new PIXI.Application({
            // Size of canvas
            width: ORBIT_CENTER_X * 2,
            height: ORBIT_CENTER_Y * 2,
            backgroundColor: 0x241b23,
        });

        this.el.appendChild(this.app.view);

        // Loads all the images
        this.app.loader
            .add('sun', 'img/sun-circle.png')
            .add('observerPlanet', 'img/blue-circle.png')
            .add('targetPlanet', 'img/grey-circle.png')
            .add('highlight', 'img/circle-highlight.svg');

        const me = this;
        this.app.loader.load((loader, resources) => {
            me.resources = resources;

            me.observerPlanetContainer = me.drawGalaxy();

            // me.targetPlanetContainer = me.drawTargetPlanet(
            //     resources.targetPlanet, resources.highlight);

            me.start();
        });
    }

    componentWillUnmount() {
        this.app.stop();
    }

    start() {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate);
        }
    }

    stop() {
        cancelAnimationFrame(this.frameId);
    }

    animate() {
        // this.observerPlanetContainer.position = getPlanetPos(
        //     this.props.radiusObserverPlanet,
        //     this.props.observerPlanetAngle
        // );

        // this.targetPlanetContainer.position = getPlanetPos(
        //     this.props.radiusTargetPlanet,
        //     this.props.targetPlanetAngle
        // );

        this.frameId = requestAnimationFrame(this.animate);
    }

    drawGalaxy() {
        const galaxyContainer = new PIXI.Container();
        galaxyContainer.name = 'galaxy';
        galaxyContainer.position = new PIXI.Point(50, 50);

        const galaxyImage = new PIXI.Sprite(PIXI.Texture.from('img/galaxy.png'));
        galaxyImage.anchor.set(0.5);
        galaxyImage.width = 15;
        galaxyImage.height = 15;
        galaxyContainer.addChild(galaxyImage);

        this.app.stage.addChild(galaxyContainer);

        return galaxyContainer;
    }


}

// These are all the parameters that MUST be passed
// Into MainView by main.jsx
MainView.propTypes = {
    // observerPlanetAngle: PropTypes.number.isRequired,
    // targetPlanetAngle: PropTypes.number.isRequired,
    // radiusObserverPlanet: PropTypes.number.isRequired,
    // radiusTargetPlanet: PropTypes.number.isRequired,
    // targetAngle: PropTypes.number.isRequired,
    // sunAngle: PropTypes.number.isRequired,
    //
    // showElongation: PropTypes.bool.isRequired,
    // labelOrbits: PropTypes.bool.isRequired,
    // zoomOut: PropTypes.bool.isRequired,
    //
    // observerName: PropTypes.string.isRequired,
    // targetName: PropTypes.string.isRequired,
    //
    // onObserverPlanetAngleUpdate: PropTypes.func.isRequired,
    // onTargetPlanetAngleUpdate: PropTypes.func.isRequired,
    // stopAnimation: PropTypes.func.isRequired,
};
