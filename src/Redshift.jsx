import React from 'react';
import * as PIXI from 'pixi.js';
import PropTypes from 'prop-types';

const CENTER_X = 460;
const CENTER_Y = 300;
// const CENTER_Y = 106 * 4;

const SCALING_FACTOR = 50;

const scaleToPixel   = distance => distance * SCALING_FACTOR;

export default class Redshift extends React.Component {
    constructor(props) {
        super(props);

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
            width: CENTER_X * 2,
            height: CENTER_Y * 2,
            backgroundColor: 0xffffff,
            // backgroundColor: 0x001aff, // Super sick blue background
            antialias: true,
        });

        this.el.appendChild(this.app.view);

        const me = this;
        const stage = new PIXI.Container();
        this.app.stage.addChild(stage);

        const starryBackground = new PIXI.Sprite(
            PIXI.Texture.from('assets/starry-background.svg')
        );

        starryBackground.x = -5150 / 2 + CENTER_X;
        starryBackground.y = -3433 / 2 + CENTER_Y + 70;

        this.bg = starryBackground;
        stage.addChild(this.bg);


        me.us = me.drawBody('us', 'assets/earth.svg', 20);
        me.galaxy = me.drawBody('galaxy', 'assets/galaxy.png', 45);

        me.directLine = me.drawLine();

        me.galaxyName = me.drawText('Galaxy', me.galaxy.x, me.galaxy.y);
        me.usName = me.drawText('Earth', me.us.x, me.us.y);

        me.initialSeparationText = me.drawText('Initial Separation', CENTER_X, CENTER_Y + 145);
        me.initialSeparationValue = me.drawText(me.props.params.initialSeparationDistance, CENTER_X, CENTER_Y + 163);

        me.separationText = me.drawText('Final Separation', CENTER_X, CENTER_Y + 190);
        me.separationValue = me.drawText(me.props.params.initialSeparationDistance, CENTER_X, CENTER_Y + 206);

        me.warningMessage = me.drawText("The bodies have expanded beyond the observable universe!" +
            " (diameter: 93 billion light years)", CENTER_X, me.galaxy.y - 10);
        me.warningMessage.visible = false;

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

        // bodyText.resolution = 3;
        bodyText.anchor.set(0.5);
        bodyText.position.x = x;
        bodyText.position.y = y - 60;
        this.app.stage.addChild(bodyText);

        return bodyText;

    }

    drawBody(name, file, size) {
        const body = new PIXI.Container();
        body.name = name;
        body.position = new PIXI.Point(CENTER_X, CENTER_Y + 50);

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
        // let initialSeparation = scaleToPixel(this.props.params.initialSeparationDistance) / 2;
        let initialSeparation = this.getScaledInitialSeparation();
        // Prepares line for redrawing on canvas
        this.directLine.clear();
        this.directLine.lineStyle(2, 0xfcff4d);

        // Initializes the start point of the line
        let lineStart = CENTER_X - initialSeparation;
        this.directLine.moveTo(lineStart, CENTER_Y + 50);

        // If light has reached us, then don't let the line go any further
        let distanceMoved = (this.us.x - scaleToPixel(this.props.distanceTravelledLight));
        // let distanceMoved = (scaleToPixel(this.props.distanceTravelledLight));
        if (!this.props.simulationStarted) distanceMoved = lineStart;

        // Draws the other end of the light ray (line)
        distanceMoved = (lineStart - distanceMoved) >= 0 ? lineStart : distanceMoved;

        this.directLine.lineTo(distanceMoved, CENTER_Y + 50);
    }

    getScaledInitialSeparation() {
        let initialSeparation = this.props.params.initialSeparationDistance / 2;
        let currWidth = 17.228377773099474;
        let maxWidth = this.props.distanceBetweenBodies > currWidth ? this.props.distanceBetweenBodies : currWidth;
        initialSeparation = (initialSeparation / maxWidth) * 860;
        initialSeparation = initialSeparation > 65 ? initialSeparation : 65;
        return initialSeparation;
    }

    updateTopLineBody(body) {
        this.updateLine(
            body.x,
            body.x,
            body.y - 15,
            body.y - 35
        );
    }

    updateInitialSeparationLine(shift) {
        let initialSeparation = this.getScaledInitialSeparation();

        this.updateLine(
            CENTER_X + shift * initialSeparation,
            CENTER_X + shift * 60,
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
        let initialSeparation = this.getScaledInitialSeparation();

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
        let halfOfScreen = CENTER_X;
        let distanceFromCenter = scaleToPixel(this.props.distanceBetweenBodies / 2);

        if (distanceFromCenter > halfOfScreen - 30) {
            this.shrinkBackground();
        } else {
            this.us.x = CENTER_X + distanceFromCenter;
            this.galaxy.x = CENTER_X - distanceFromCenter;
            this.bg.scale.x = 1;
            this.bg.position.x = -(this.bg.width / 2) + CENTER_X;
        }

        this.warningMessage.visible = this.props.distanceBetweenBodies >= 93.0;
    }

    // Natural width of the image is 5150 px
    // Size of the strip is 920 px
    shrinkBackground() {
        if (!(this.bg.scale.x <= 0)) {
            let distAtContraction = 17.228377773099474;
            this.bg.scale.x = 1 - ((this.props.distanceBetweenBodies - distAtContraction) / 92.0);
            this.bg.position.x = -(this.bg.width / 2) + CENTER_X;
        } else {
            this.bg.scale.x = 0;
        }
    }

    updateTextValues() {
        let initialSeparation = this.props.params.initialSeparationDistance;
        let separationDist = this.props.distanceBetweenBodies;

        this.initialSeparationValue.text =
            `${(initialSeparation).toFixed(2).toString()} billion light years`;

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
