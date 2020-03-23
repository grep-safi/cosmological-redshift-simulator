import React from 'react';
import * as PIXI from 'pixi.js';
import PropTypes from 'prop-types';

const ORBIT_CENTER_X = 460;
const ORBIT_CENTER_Y = 106;

// We start at 3/4 of the strip
// const STARTING_US_X = (3 / 4) * (ORBIT_CENTER_X * 2) - 200;
const STARTING_US_X = 460;

// Galaxy starts at 1/4 of the strip
// const STARTING_GALAXY_X = (1 / 4) * (ORBIT_CENTER_X * 2) + 200;
const STARTING_GALAXY_X = 460;

export default class Redshift extends React.Component {
    constructor(props) {
        super(props);

        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.animate = this.animate.bind(this);

        this.lightReached = false;
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

        me.us = me.drawBody('us', STARTING_US_X, 'img/earth.svg', 20);
        me.galaxy = me.drawBody('galaxy', STARTING_GALAXY_X, 'img/galaxy.png', 45);

        me.directLine = me.drawLine();

        me.galaxyName = me.drawText('Galaxy', me.galaxy.x, me.galaxy.y);
        me.usName = me.drawText('Us', me.us.x, me.us.y);

        me.initialSeparationText = me.drawText('Initial Separation', ORBIT_CENTER_X, ORBIT_CENTER_Y + 100);
        me.initialSeparationValue = me.drawText(me.props.params.initialSeparationDistance, ORBIT_CENTER_X, ORBIT_CENTER_Y + 115);

        me.separationText = me.drawText('Separation', ORBIT_CENTER_X, ORBIT_CENTER_Y + 130);
        me.separationValue = me.drawText(me.props.params.initialSeparationDistance, ORBIT_CENTER_X, ORBIT_CENTER_Y + 145);
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

    drawText(name, x, y) {
        const bodyText = new PIXI.Text(name, {
            fontFamily: 'Garamond',
            fontSize: 14,
            // fontWeight: 'bold',
            fill: 0xe4d1a0, // butter
            // fill: 0xFFD700, // gold
        });

        // angleText.rotation = degToRad(-90);
        bodyText.resolution = 3;
        bodyText.anchor.set(0.5);
        bodyText.position.x = x;
        bodyText.position.y = y - 60;
        this.app.stage.addChild(bodyText);

        return bodyText;

    }

    drawBody(name, startX, file, size) {
        const body = new PIXI.Container();
        body.name = name;
        body.position = new PIXI.Point(startX, 48.5 + 50);

        const bodySprite = new PIXI.Sprite(PIXI.Texture.from(file));
        bodySprite.anchor.set(0.5);
        bodySprite.width = size;
        bodySprite.height = size;
        body.addChild(bodySprite);

        this.app.stage.addChild(body);

        return body;
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
        // Prepares line for redrawing on canvas
        this.directLine.clear();
        this.directLine.lineStyle(2, 0xfcff4d);

        // Initializes the start point of the line
        let lineStart = STARTING_GALAXY_X - this.props.params.initialSeparationDistance;
        this.directLine.moveTo(lineStart, ORBIT_CENTER_Y - 7);

        // If light has reached us, then don't let the line go any further
        let distanceMoved = lineStart + this.props.distanceTravelledLight;
        if (distanceMoved >= this.us.x) {
            distanceMoved = this.us.x;
            this.lightReached = true;
        } else {
            this.lightReached = false;
        }

        // Draws the other end of the light ray (line)
        this.directLine.lineTo(distanceMoved, ORBIT_CENTER_Y - 7);

        // Draws the vertical lines that show name of bodies
        this.drawTopVerticalLine(this.galaxy, this.galaxyName);
        this.drawTopVerticalLine(this.us, this.usName);

        this.drawBottomVerticalLine(this.galaxy);
        this.drawBottomVerticalLine(this.us);
    }

    updateBodiesSliderChange() {
        if (!this.props.simulationStarted) {
            this.us.x = STARTING_US_X + this.props.params.initialSeparationDistance;
            this.galaxy.x = STARTING_GALAXY_X - this.props.params.initialSeparationDistance;
        }
    }

    updateBodiesAnimation() {
        if (!this.lightReached) {
            this.us.x = STARTING_US_X + this.props.distanceTravelledBodies + this.props.params.initialSeparationDistance;
            this.galaxy.x = STARTING_GALAXY_X - this.props.distanceTravelledBodies - this.props.params.initialSeparationDistance;
        }
    }

    drawTopVerticalLine(body, text) {
        // Does top vertical line for us
        this.directLine.lineStyle(2, 0xa64e4e);
        this.directLine.moveTo(body.x, body.y - 15);
        this.directLine.lineTo(body.x, body.y - 35);

        // Draws Name
        text.x = body.x;
        text.y = body.y - 45;
    }

    drawBottomVerticalLine(body) {
        this.directLine.lineStyle(2, 0xa64e4e);
        this.directLine.moveTo(STARTING_US_X + this.props.params.initialSeparationDistance, body.y + 35);
        this.directLine.lineTo(STARTING_GALAXY_X - this.props.params.initialSeparationDistance, body.y + 35);

        this.directLine.lineStyle(2, 0xa64e4e);
        this.directLine.moveTo(STARTING_US_X + this.props.params.initialSeparationDistance, body.y + 15);
        this.directLine.lineTo(STARTING_US_X + this.props.params.initialSeparationDistance, body.y + 35);

        this.directLine.lineStyle(2, 0xa64e4e);
        this.directLine.moveTo(STARTING_GALAXY_X - this.props.params.initialSeparationDistance, body.y + 15);
        this.directLine.lineTo(STARTING_GALAXY_X - this.props.params.initialSeparationDistance, body.y + 35);

    }

    drawChangingBottomLine() {

        this.directLine.lineStyle(2, 0xa64e4e);
        this.directLine.moveTo(this.us.x, this.us.y + 80);
        this.directLine.lineTo(this.galaxy.x, this.us.y + 80);

        this.directLine.lineStyle(2, 0xa64e4e);
        this.directLine.moveTo(this.us.x, this.us.y + 30);
        this.directLine.lineTo(this.us.x, this.us.y + 80);

        this.directLine.lineStyle(2, 0xa64e4e);
        this.directLine.moveTo(this.galaxy.x, this.galaxy.y + 30);
        this.directLine.lineTo(this.galaxy.x, this.galaxy.y + 80);

    }

    updateTextValues() {
        let initialSeparation = this.props.params.initialSeparationDistance;
        let separationDist = (this.us.x - this.galaxy.x) / 2;

        this.initialSeparationValue.text = initialSeparation.toFixed(0).toString();
        this.separationValue.text = separationDist.toFixed(0).toString();
    }

    animate() {
        if (this.props.isPlaying) {
            this.updateBodiesAnimation();
        } else {
            this.updateBodiesSliderChange();
        }
        this.updateTextValues();
        this.updateLines();
        this.drawChangingBottomLine();

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
    distanceTravelledLight: PropTypes.number.isRequired,
    distanceTravelledBodies: PropTypes.number.isRequired,
    isPlaying: PropTypes.bool.isRequired
};
