import React from 'react';
import * as PIXI from 'pixi.js';
import PropTypes from 'prop-types';

const CENTER_X = 460;
const CENTER_Y = 106;

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
            width: CENTER_X * 2,
            height: CENTER_Y * 2,
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

        me.us = me.drawBody('us', 'img/earth.svg', 20);
        me.galaxy = me.drawBody('galaxy', 'img/galaxy.png', 45);

        me.directLine = me.drawLine();

        me.galaxyName = me.drawText('Galaxy', me.galaxy.x, me.galaxy.y);
        me.usName = me.drawText('Us', me.us.x, me.us.y);

        me.initialSeparationText = me.drawText('Initial Separation', CENTER_X, CENTER_Y + 100);
        me.initialSeparationValue = me.drawText(me.props.params.initialSeparationDistance, CENTER_X, CENTER_Y + 115);

        me.separationText = me.drawText('Separation', CENTER_X, CENTER_Y + 130);
        me.separationValue = me.drawText(me.props.params.initialSeparationDistance, CENTER_X, CENTER_Y + 145);

        me.start();
    }

    componentWillUnmount() {
        this.app.stop();
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

    drawBody(name, file, size) {
        const body = new PIXI.Container();
        body.name = name;
        body.position = new PIXI.Point(CENTER_X, 48.5 + 50);

        const bodySprite = new PIXI.Sprite(PIXI.Texture.from(file));
        bodySprite.anchor.set(0.5);
        bodySprite.width = size;
        bodySprite.height = size;
        body.addChild(bodySprite);

        this.app.stage.addChild(body);

        return body;
    }

    start() {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate);
        }
    }

    stop() {
        cancelAnimationFrame(this.frameId);
    }

    updateLightLine() {
        // Prepares line for redrawing on canvas
        this.directLine.clear();
        this.directLine.lineStyle(2, 0xfcff4d);

        // Initializes the start point of the line
        let lineStart = CENTER_X - this.props.params.initialSeparationDistance;
        this.directLine.moveTo(lineStart, CENTER_Y - 7);

        // If light has reached us, then don't let the line go any further
        let distanceMoved = lineStart + this.props.distanceTravelledLight;
        if (distanceMoved >= this.us.x) {
            distanceMoved = this.us.x;
            this.lightReached = true;
        } else {
            this.lightReached = false;
        }

        // Draws the other end of the light ray (line)
        this.directLine.lineTo(distanceMoved, CENTER_Y - 7);

        // Draws the vertical lines that show name of bodies
        this.updateLine(
            this.galaxy.x,
            this.galaxy.x,
            this.galaxy.y - 15,
            this.galaxy.y - 35
        );

        this.updateLine(
            this.us.x,
            this.us.x,
            this.us.y - 15,
            this.us.y - 35
        );

        this.updateText(this.galaxy, this.galaxyName);
        this.updateText(this.us, this.usName);

        this.drawBottomVerticalLine(this.galaxy);
        this.drawBottomVerticalLine(this.us);
    }

    updateBodiesAnimation() {
        if (!this.lightReached) {
            this.us.x = CENTER_X + this.props.distanceTravelledBodies + this.props.params.initialSeparationDistance;
            this.galaxy.x = CENTER_X - this.props.distanceTravelledBodies - this.props.params.initialSeparationDistance;
        }
    }

    updateText(body, text) {
        // Draws Name
    }

    updateLine(startX, endX, firstYShift, secondYShift) {
        this.directLine.lineStyle(2, 0xa64e4e);
        this.directLine.moveTo(startX, firstYShift);
        this.directLine.lineTo(endX, secondYShift);
    }

    drawBottomVerticalLine(body) {
        this.directLine.lineStyle(2, 0xa64e4e);
        this.directLine.moveTo(CENTER_X + this.props.params.initialSeparationDistance, body.y + 35);
        this.directLine.lineTo(CENTER_X - this.props.params.initialSeparationDistance, body.y + 35);

        this.directLine.lineStyle(2, 0xa64e4e);
        this.directLine.moveTo(CENTER_X + this.props.params.initialSeparationDistance, body.y + 15);
        this.directLine.lineTo(CENTER_X + this.props.params.initialSeparationDistance, body.y + 35);

        this.directLine.lineStyle(2, 0xa64e4e);
        this.directLine.moveTo(CENTER_X - this.props.params.initialSeparationDistance, body.y + 15);
        this.directLine.lineTo(CENTER_X - this.props.params.initialSeparationDistance, body.y + 35);
    }

    drawChangingBottomLine() {

        this.directLine.lineStyle(2, 0xa64e4e);
        this.directLine.moveTo(this.us.x, this.us.y + 80);
        this.directLine.lineTo(this.galaxy.x, this.us.y + 80);

        this.directLine.lineStyle(2, 0xa64e4e);
        this.directLine.moveTo(this.us.x, this.us.y + 60);
        this.directLine.lineTo(this.us.x, this.us.y + 80);

        this.directLine.lineStyle(2, 0xa64e4e);
        this.directLine.moveTo(this.galaxy.x, this.galaxy.y + 60);
        this.directLine.lineTo(this.galaxy.x, this.galaxy.y + 80);

    }

    updateTextValues() {
        let initialSeparation = this.props.params.initialSeparationDistance;
        let separationDist = (this.us.x - this.galaxy.x) / 2;

        this.initialSeparationValue.text = initialSeparation.toFixed(0).toString();
        this.separationValue.text = separationDist.toFixed(0).toString();

        this.galaxyName.x = this.galaxy.x;
        this.galaxyName.y = this.galaxy.y - 45;

        this.usName.x = this.us.x;
        this.usName.y = this.us.y - 45;
    }

    animate() {

        this.updateBodiesAnimation();
        this.updateTextValues();
        this.updateLightLine();
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
