import React from 'react';
import * as PIXI from 'pixi.js';
import PropTypes from 'prop-types';

const ORBIT_CENTER_X = 460;
const ORBIT_CENTER_Y = 106;

// We start at 3/4 of the strip
const STARTING_US_X = (3 / 4) * (ORBIT_CENTER_X * 2);

// Galaxy starts at 1/4 of the strip
const STARTING_GALAXY_X = (1 / 4) * (ORBIT_CENTER_X * 2);

export default class Redshift extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            distVal: 0,
            lightReached: false
        };

        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.animate = this.animate.bind(this);
    }

    render() {
        return (
            <div className="Redshift"
                 ref={(thisDiv) => {this.el = thisDiv;}} />
        );
    }

    componentDidMount() {
        this.app = new PIXI.Application({
            width: ORBIT_CENTER_X * 2,
            height: ORBIT_CENTER_Y * 2,
            backgroundColor: 0x241B23,
            antialias: true,
        });

        this.el.appendChild(this.app.view);

        const me = this;
        const stage = new PIXI.Container();
        this.app.stage.addChild(stage);

        const starryBackground = new PIXI.Sprite(
            PIXI.Texture.from('img/starry-background.jpg')
        );

        starryBackground.x -= 300;
        starryBackground.y -= 100;
        stage.addChild(starryBackground);

        me.us = me.drawusPlanetZodiac();
        me.galaxy = me.drawgalaxyZodiac();

        me.directLine = me.drawLine();

        me.galaxyName = me.drawPlanetText('Galaxy', me.galaxy.x, me.galaxy.y);
        me.usName = me.drawPlanetText('Us', me.us.x, me.us.y);

        me.start();
    }

    drawLine() {
        const g = new PIXI.Graphics();
        g.visible = true;

        g.clear();
        g.lineStyle(2, 0xe8c3c3);
        g.beginFill(0x99c9ac, 0.7);  // 0xffe200

        this.app.stage.addChild(g);
        return g;
    }

    drawPlanetText(name, x, y) {
        const planetText = new PIXI.Text(name, {
            fontFamily: 'Garamond',
            fontSize: 14,
            // fontWeight: 'bold',
            fill: 0xe4d1a0, // butter
            // fill: 0xFFD700, // gold
        });

        // angleText.rotation = degToRad(-90);
        planetText.resolution = 3;
        planetText.anchor.set(0.5);
        planetText.position.x = x;
        planetText.position.y = y - 60;
        this.app.stage.addChild(planetText);

        return planetText;

    }

    drawgalaxyZodiac() {
        const galaxy = new PIXI.Container();
        galaxy.name = 'galaxyZodiac';
        galaxy.position = new PIXI.Point(STARTING_GALAXY_X, 48.5 + 50);

        const galaxyZodiac = new PIXI.Sprite(PIXI.Texture.from('img/galaxy.png'));
        galaxyZodiac.anchor.set(0.5);
        galaxyZodiac.width = 20;
        galaxyZodiac.height = 20;
        galaxy.addChild(galaxyZodiac);

        this.app.stage.addChild(galaxy);

        return galaxy;

    }

    drawusPlanetZodiac() {
        const usPlanetContainer = new PIXI.Container();
        usPlanetContainer.name = 'usPlanetZodiac';
        usPlanetContainer.position = new PIXI.Point(STARTING_US_X, 48.5 + 50);

        const usPlanetImage = new PIXI.Sprite(PIXI.Texture.from('img/earth.svg'));
        usPlanetImage.anchor.set(0.5);
        usPlanetImage.width = 15;
        usPlanetImage.height = 15;
        usPlanetContainer.addChild(usPlanetImage);

        this.app.stage.addChild(usPlanetContainer);

        return usPlanetContainer;
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

    updateLines() {
        this.directLine.clear();
        this.directLine.lineStyle(2, 0xa64e4e);

        let distanceMoved = this.galaxy.x + this.props.distanceTravelledLight;
        this.directLine.moveTo(this.galaxy.x, this.galaxy.y);

        if (distanceMoved >= this.us.x) {
            distanceMoved = this.us.x;
        }

        this.directLine.lineTo(distanceMoved, this.galaxy.y);

        this.drawVerticalLineForGalaxy();
        this.drawVerticalLineForUs();
    }

    updateBodiesSliderChange() {
        let distanceMoved = this.galaxy.x + this.props.distanceTravelledLight;
        if (distanceMoved <= this.us.x) {
            this.us.x = ORBIT_CENTER_X + this.props.distanceBetween;
            this.galaxy.x = ORBIT_CENTER_X - this.props.distanceBetween;
        }
    }

    updateBodiesAnimation() {
        let distanceMoved = this.galaxy.x + this.props.distanceTravelledLight;
        if (distanceMoved <= this.us.x) {
            this.us.x = ORBIT_CENTER_X + this.props.distanceBetween;
            this.galaxy.x = ORBIT_CENTER_X - this.props.distanceBetween;
        }
    }

    drawVerticalLineForGalaxy() {
        // Does top vertical line for us planet
        this.directLine.lineStyle(2, 0xa64e4e);
        this.directLine.moveTo(this.us.x, this.us.y - 15);
        this.directLine.lineTo(this.us.x, this.us.y - 35);

        // Draws Name
        this.usName.x = this.us.x;
        this.usName.y = this.us.y - 45;
    }

    drawVerticalLineForUs() {
        // Does top vertical line for galaxy
        this.directLine.lineStyle(2, 0xa64e4e);
        this.directLine.moveTo(this.galaxy.x, this.galaxy.y - 15);
        this.directLine.lineTo(this.galaxy.x, this.galaxy.y - 50);

        // Draws name
        this.galaxyName.x = this.galaxy.x;
        this.galaxyName.y = this.galaxy.y - 60;
    }

    animate() {

        if (this.props.isPlaying) {
            this.updateBodiesAnimation();
        } else {
            this.updateBodiesSliderChange();
        }
        this.updateLines();

        // this.updateText(textNum);
        // this.updateDirection(direction);

        this.frameId = requestAnimationFrame(this.animate);
    }
}

// These are all the parameters that MUST be passed
// Into Redshift by main.jsx
Redshift.propTypes = {
    params: PropTypes.exact({
        initialSeparationDistance: PropTypes.number.isRequired,
        expansionRate: PropTypes.number.isRequired,
    }).isRequired,
    isPlaying: PropTypes.bool.isRequired
};
