import React from 'react';
import * as PIXI from 'pixi.js';
import PropTypes from 'prop-types';

const ORBIT_CENTER_X = 460;
const ORBIT_CENTER_Y = 212;

// We start at 3/4 of the strip
const STARTING_US_X = (3 / 4) * (ORBIT_CENTER_X * 2);

// Galaxy starts at 1/4 of the strip
const STARTING_GALAXY_X = (1 / 4) * (ORBIT_CENTER_X * 2);

export default class ZodiacStrip extends React.Component {
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
            <div className="ZodiacStrip"
                 ref={(thisDiv) => {this.el = thisDiv;}} />
        );
    }

    componentDidMount() {
        this.app = new PIXI.Application({
            width: ORBIT_CENTER_X * 2,
            height: ORBIT_CENTER_Y,
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

        me.targetPlanetZodiacContainer = me.drawTargetPlanetZodiac();
        me.sunZodiacContainer = me.drawSunZodiac();

        me.directLine = me.drawLine();

        me.sunName = me.drawPlanetText('Galaxy', me.sunZodiacContainer.x, me.sunZodiacContainer.y);
        me.targetName = me.drawPlanetText('Us', me.targetPlanetZodiacContainer.x, me.targetPlanetZodiacContainer.y);

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

    drawSunZodiac() {
        const sunZodiacContainer = new PIXI.Container();
        sunZodiacContainer.name = 'sunZodiac';
        sunZodiacContainer.position = new PIXI.Point(STARTING_GALAXY_X, 48.5 + 50);

        const sunZodiac = new PIXI.Sprite(PIXI.Texture.from('img/galaxy.png'));
        sunZodiac.anchor.set(0.5);
        sunZodiac.width = 20;
        sunZodiac.height = 20;
        sunZodiacContainer.addChild(sunZodiac);

        this.app.stage.addChild(sunZodiacContainer);

        return sunZodiacContainer;

    }

    drawTargetPlanetZodiac() {
        const targetPlanetContainer = new PIXI.Container();
        targetPlanetContainer.name = 'targetPlanetZodiac';
        targetPlanetContainer.position = new PIXI.Point(STARTING_US_X, 48.5 + 50);

        const targetPlanetImage = new PIXI.Sprite(PIXI.Texture.from('img/earth.svg'));
        targetPlanetImage.anchor.set(0.5);
        targetPlanetImage.width = 15;
        targetPlanetImage.height = 15;
        targetPlanetContainer.addChild(targetPlanetImage);

        this.app.stage.addChild(targetPlanetContainer);

        return targetPlanetContainer;
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

        let distanceMoved = this.sunZodiacContainer.x + this.props.distanceTravelledLight;
        this.directLine.moveTo(this.sunZodiacContainer.x, this.sunZodiacContainer.y);

        if (distanceMoved >= this.targetPlanetZodiacContainer.x) {
            distanceMoved = this.targetPlanetZodiacContainer.x;
        }

        this.directLine.lineTo(distanceMoved, this.sunZodiacContainer.y);

        this.drawVerticalLineForGalaxy();
        this.drawVerticalLineForUs();
    }

    updateBodiesSliderChange() {
        let distanceMoved = this.sunZodiacContainer.x + this.props.distanceTravelledLight;
        if (distanceMoved <= this.targetPlanetZodiacContainer.x) {
            this.targetPlanetZodiacContainer.x = ORBIT_CENTER_X + this.props.distanceBetween;
            this.sunZodiacContainer.x = ORBIT_CENTER_X - this.props.distanceBetween;
        }
    }

    updateBodiesAnimation() {
        let distanceMoved = this.sunZodiacContainer.x + this.props.distanceTravelledLight;
        if (distanceMoved <= this.targetPlanetZodiacContainer.x) {
            this.targetPlanetZodiacContainer.x = ORBIT_CENTER_X + this.props.distanceBetween;
            this.sunZodiacContainer.x = ORBIT_CENTER_X - this.props.distanceBetween;
        }
    }

    drawVerticalLineForGalaxy() {
        // Does top vertical line for target planet
        this.directLine.lineStyle(2, 0xa64e4e);
        this.directLine.moveTo(this.targetPlanetZodiacContainer.x, this.targetPlanetZodiacContainer.y - 15);
        this.directLine.lineTo(this.targetPlanetZodiacContainer.x, this.targetPlanetZodiacContainer.y - 35);

        // Draws Name
        this.targetName.x = this.targetPlanetZodiacContainer.x;
        this.targetName.y = this.targetPlanetZodiacContainer.y - 45;
    }

    drawVerticalLineForUs() {
        // Does top vertical line for sun
        this.directLine.lineStyle(2, 0xa64e4e);
        this.directLine.moveTo(this.sunZodiacContainer.x, this.sunZodiacContainer.y - 15);
        this.directLine.lineTo(this.sunZodiacContainer.x, this.sunZodiacContainer.y - 50);

        // Draws name
        this.sunName.x = this.sunZodiacContainer.x;
        this.sunName.y = this.sunZodiacContainer.y - 60;
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
// Into ZodiacStrip by main.jsx
ZodiacStrip.propTypes = {
    params: PropTypes.exact({
        initialSeparationDistance: PropTypes.number.isRequired,
        expansionRate: PropTypes.number.isRequired,
    }).isRequired,
    isPlaying: PropTypes.bool.isRequired
};
