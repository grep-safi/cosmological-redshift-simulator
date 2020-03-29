import React from 'react';
import * as PIXI from 'pixi.js';
import PropTypes from 'prop-types';
// import * as d3 from "d3/dist/d3";

const CENTER_X = 460;
const CENTER_Y = 106;

const SCALING_FACTOR = 50;

const scaleToDistance = (pixel)    => pixel / SCALING_FACTOR;
const scaleToPixel    = (distance) => distance * SCALING_FACTOR;

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

        starryBackground.x = -5150 / 2 + CENTER_X;
        starryBackground.y -= 3433 / 2;
        // starryBackground.x -= 300;
        // starryBackground.y -= 100;
        this.bg = starryBackground;
        stage.addChild(this.bg);

        me.us = me.drawBody('us', 'img/earth.svg', 20);
        me.galaxy = me.drawBody('galaxy', 'img/galaxy.png', 45);

        me.directLine = me.drawLine();

        me.galaxyName = me.drawText('Galaxy', me.galaxy.x, me.galaxy.y);
        me.usName = me.drawText('Us', me.us.x, me.us.y);

        me.initialSeparationText = me.drawText('Initial Separation', CENTER_X, CENTER_Y + 87);
        me.initialSeparationValue = me.drawText(me.props.params.initialSeparationDistance, CENTER_X, CENTER_Y + 105);

        me.separationText = me.drawText('Final Separation', CENTER_X, CENTER_Y + 132);
        me.separationValue = me.drawText(me.props.params.initialSeparationDistance, CENTER_X, CENTER_Y + 148);

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
            fontFamily: 'Arial',
            fontSize: 14,
            fill: 0xe4d1a0, // butter
        });

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

    // General function that updates a given line
    updateLine(startX, endX, firstYShift, secondYShift) {
        this.directLine.lineStyle(2, 0xa64e4e);
        this.directLine.moveTo(startX, firstYShift);
        this.directLine.lineTo(endX, secondYShift);
    }

    updateLightLine() {
        let initialSeparation = scaleToPixel(this.props.params.initialSeparationDistance) / 2;
        // Prepares line for redrawing on canvas
        this.directLine.clear();
        this.directLine.lineStyle(2, 0xfcff4d);

        // Initializes the start point of the line
        // console.log(`init separaton: ${(initialSeparation)} `);
        let lineStart = CENTER_X - initialSeparation;
        this.directLine.moveTo(lineStart, CENTER_Y - 7);

        // If light has reached us, then don't let the line go any further
        // let distanceMoved = lineStart + scaleToPixel(this.props.distanceTravelledLight);
        // let distanceMoved = lineStart + (this.us.x - scaleToPixel(this.props.distanceTravelledLight));
        let distanceMoved = (this.us.x - scaleToPixel(this.props.distanceTravelledLight));
        if (!this.props.isPlaying) {
            distanceMoved = lineStart;
        }
        // let distanceMoved = lineStart + (this.us.x - scaleToPixel(this.props.distanceTravelledLight) - 460);
        // console.log(`dist bw bodies: ${scaleToPixel(this.props.distanceBetweenBodies)} and light travelled: ${scaleToPixel(this.props.distanceTravelledLight)}`);
        // console.log(`dist bw bodies: ${(this.props.distanceBetweenBodies)} and light travelled: ${scaleToPixel(this.props.distanceTravelledLight)}`);
        if (distanceMoved >= this.us.x) {
            distanceMoved = this.us.x;
            this.lightReached = true;
            this.props.changeSimState();
        } else {
            this.lightReached = false;
        }

        // Draws the other end of the light ray (line)
        this.directLine.lineTo(distanceMoved, CENTER_Y - 7);
        // console.log(`dist moved: ${distanceMoved} linestart: ${lineStart}`);
    }

    updateTopLineBody(body) {
        this.updateLine(
            body.x,
            body.x,
            body.y - 15,
            body.y - 35
        );
    }

    updateInitialSeparationLine(constant) {
        let initialSeparation = scaleToPixel(this.props.params.initialSeparationDistance / 2);
        // console.log(`ussss ${CENTER_X - this.us.x}`);
        this.updateLine(
            CENTER_X + constant * initialSeparation,
            CENTER_X + constant * 60,
            this.us.y + 35,
            this.us.y + 35
        );
    }

    updateFinalSeparationLine(body, constant) {
        this.updateLine(
            body.x,
            CENTER_X + constant * 60,
            this.us.y + 80,
            this.us.y + 80
        );
    }

    updateInitialVerticals(constant) {
        let initialSeparation = scaleToPixel(this.props.params.initialSeparationDistance / 2);
        this.updateLine(
            CENTER_X + constant * initialSeparation,
            CENTER_X + constant * initialSeparation,
            this.us.y + 15,
            this.us.y + 35
        );
    }

    updateFinalVerticals(body) {
        this.updateLine(
            body.x,
            body.x,
            this.us.y + 60,
            this.us.y + 80
        );
    }

    // Updates all the lines
    updateLines() {
        // Draws the vertical lines on top of galaxy and planet
        this.updateTopLineBody(this.us);
        this.updateTopLineBody(this.galaxy);

        // Draws initial separation distance lines on the bottom
        this.updateInitialSeparationLine(-1);
        this.updateInitialSeparationLine(1);

        // Draws final separation distance lines on the bottom (below initial separation distance lines)
        this.updateFinalSeparationLine(this.us, 1);
        this.updateFinalSeparationLine(this.galaxy, -1);

        // Draws vertical lines on the bottom of the galaxy and planet connecting to INITIAL separation distance lines
        this.updateInitialVerticals(1);
        this.updateInitialVerticals(-1);

        // Draws vertical lines on the bottom of the galaxy and planet connecting to FINAL separation distance lines
        this.updateFinalVerticals(this.us);
        this.updateFinalVerticals(this.galaxy);
    }

    updateBodiesAnimation() {
        if (!this.lightReached) {
            let halfOfScreen = CENTER_X - 10;
            let distanceFromCenter = scaleToPixel(this.props.distanceBetweenBodies / 2);

            if (distanceFromCenter > halfOfScreen - 20) {
                this.shrinkBackground(distanceFromCenter);
            } else {
                this.us.x = CENTER_X + distanceFromCenter;
                this.galaxy.x = CENTER_X - distanceFromCenter;
            }
        }
    }

    // Natural width of the image is 5150 px
    // Size of the strip is 920 px
    shrinkBackground(scaling) {
        if (!(this.bg.scale.x <= 0)) {
            this.bg.scale.x = 1 - (this.props.distanceBetweenBodies / 115.0);
            this.bg.position.x = -(this.bg.width / 2) + CENTER_X;
            console.log(`I shouldn't be printing scale: ${this.bg.scale.x} and evaluation: ${!(this.bg.scale.x <= 0)}`);
        } else {
            this.bg.scale.x = 0;
        }
    }

    updateTextValues() {
        let initialSeparation = this.props.params.initialSeparationDistance;
        let separationDist = this.props.distanceBetweenBodies;

        this.initialSeparationValue.text = `${(initialSeparation).toFixed(2).toString()} billion light years`;
        this.separationValue.text = `${(separationDist).toFixed(2).toString()} billion light years`;

        this.galaxyName.x = this.galaxy.x;
        this.galaxyName.y = this.galaxy.y - 45;

        this.usName.x = this.us.x;
        this.usName.y = this.us.y - 45;
    }

    animate() {
        this.updateBodiesAnimation();
        this.updateTextValues();
        this.updateLightLine();
        this.updateLines();

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
    distanceBetweenBodies: PropTypes.number.isRequired,
    isPlaying: PropTypes.bool.isRequired
};
