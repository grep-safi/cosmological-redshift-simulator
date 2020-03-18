import React from 'react';
import * as PIXI from 'pixi.js';
import PropTypes from 'prop-types';

const ORBIT_CENTER_X = 600;
const ORBIT_CENTER_Y = 212;

const getPlanetPos = function(radius, phase) {
    return new PIXI.Point(
        // these magic numbers come from this.orbitCenter
        radius * Math.cos(-phase) + 600,
        radius * Math.sin(-phase) + 460);
};

export default class ZodiacStrip extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            distVal: 0
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
            width: ORBIT_CENTER_X,
            height: ORBIT_CENTER_Y,
            backgroundColor: 0x241B23,
            antialias: true,
        });

        this.el.appendChild(this.app.view);

        const me = this;
        const stage = new PIXI.Container();
        this.app.stage.addChild(stage);

        me.targetPlanetZodiacContainer = me.drawTargetPlanetZodiac();
        me.sunZodiacContainer = me.drawSunZodiac();

        me.directLine = me.drawLine();

        me.angleText = me.drawAngleText();
        me.angleDirectionText = me.drawAngleDirectionText();
        me.sunName = me.drawPlanetText('Galaxy', me.sunZodiacContainer.x, me.sunZodiacContainer.y);
        me.targetName = me.drawPlanetText('Us', me.targetPlanetZodiacContainer.x, me.targetPlanetZodiacContainer.y);
        me.zodiacText = me.drawZodiac();

        me.start();
    }

    drawLine() {
        const g = new PIXI.Graphics();
        g.visible = false;

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

    drawAngleText() {
        const angleText = new PIXI.Text('The Cold, Desolate Emptiness of Space', {
            fontFamily: 'Garamond',
            fontSize: 24,
            fill: 0xe4d1a0,  // butter
            // fill: 0xFFD700, // gold
        });

        angleText.resolution = 2;
        angleText.anchor.set(0.5);
        angleText.position.x = 300;
        angleText.position.y = 175;
        this.app.stage.addChild(angleText);

        return angleText;
    }

    drawAngleDirectionText() {
        const angleDirectionText = new PIXI.Text('', {
            fontFamily: 'Garamond',
            fontSize: 42,
            fill: 0xe4d1a0,
        });

        angleDirectionText.resolution = 2;
        angleDirectionText.anchor.set(0.5);
        angleDirectionText.position.x = 375;
        angleDirectionText.position.y = 175;
        this.app.stage.addChild(angleDirectionText);

        return angleDirectionText;
    }

    drawZodiac() {
        const zodiacText = new PIXI.Text('', {
            fontFamily: 'Garamond',
            fontSize: 24,
            // fontWeight: 'bold',
            fill: 0xe4d1a0, // butter
            // fill: 0xFFD700, // gold
        });

        zodiacText.resolution = 2;
        zodiacText.anchor.set(0.5);
        zodiacText.position.x = 300;
        zodiacText.position.y = 15;
        this.app.stage.addChild(zodiacText);

        return zodiacText;
    }

    drawSunZodiac() {

        const sunZodiacContainer = new PIXI.Container();
        sunZodiacContainer.name = 'sunZodiac';
        sunZodiacContainer.position = new PIXI.Point(600 / 4, 48.5 + 50);

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
        targetPlanetContainer.position = new PIXI.Point(3 * 600 / 4, 48.5 + 50);

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

    updateLine() {
        this.directLine.clear();
        let distanceMoved = this.sunZodiacContainer.x + this.props.distanceTravelled;
        let downShift = -0;

        this.directLine.moveTo(this.sunZodiacContainer.x, this.sunZodiacContainer.y);
        this.directLine.visible = true;
        this.directLine.lineStyle(2, 0xa64e4e);

        if (distanceMoved >= this.targetPlanetZodiacContainer.x) {
            distanceMoved = this.targetPlanetZodiacContainer.x;
        }

        this.directLine.lineTo(distanceMoved, this.sunZodiacContainer.y - downShift);

        this.setState(prevState => ({
            distVal: prevState.distVal + 0.10 * 1.5,
        }));

        // // Does bottom vertical line for target planet
        // this.directLine.lineStyle(2, 0xa64e4e);
        // this.directLine.moveTo(this.targetPlanetZodiacContainer.x, this.targetPlanetZodiacContainer.y + 15);
        // this.directLine.lineTo(this.targetPlanetZodiacContainer.x, this.targetPlanetZodiacContainer.y + 57);
        //
        // // Does bottom vertical line for sun
        // this.directLine.lineStyle(2, 0xa64e4e);
        // this.directLine.moveTo(this.sunZodiacContainer.x, this.sunZodiacContainer.y + 15);
        // this.directLine.lineTo(this.sunZodiacContainer.x, this.sunZodiacContainer.y + 57);
        //
        // // Does top vertical line for target planet
        // this.directLine.lineStyle(2, 0xa64e4e);
        // this.directLine.moveTo(this.targetPlanetZodiacContainer.x, this.targetPlanetZodiacContainer.y - 15);
        // this.directLine.lineTo(this.targetPlanetZodiacContainer.x, this.targetPlanetZodiacContainer.y - 35);
        //
        // // Does top vertical line for sun
        // this.directLine.lineStyle(2, 0xa64e4e);
        // this.directLine.moveTo(this.sunZodiacContainer.x, this.sunZodiacContainer.y - 15);
        // this.directLine.lineTo(this.sunZodiacContainer.x, this.sunZodiacContainer.y - 50);
        //
        // this.sunName.x = this.sunZodiacContainer.x;
        // this.sunName.y = this.sunZodiacContainer.y - 60;
        //
        // this.targetName.x = this.targetPlanetZodiacContainer.x;
        // this.targetName.y = this.targetPlanetZodiacContainer.y - 45;
    }

    drawElongationArrow(line, xShift, yShift, size) {
        let actualXShift = xShift;
        let thicc = 2.0;
        let downShift = -40;
        if (size < 30){
            actualXShift = size / 30 * xShift;
            thicc = (size / 30) * 2.0;
        }
        line.lineStyle(thicc, 0xa64e4e);
        line.moveTo(this.targetPlanetZodiacContainer.x + actualXShift, this.targetPlanetZodiacContainer.y - downShift + (yShift * 7));
        line.lineTo(this.targetPlanetZodiacContainer.x, this.targetPlanetZodiacContainer.y - downShift+ (-1 * yShift));
    }

    updateText(newAngle) {
        this.angleText.text = newAngle;
    }

    updateDirection(direction) {
        this.angleDirectionText.text = direction;
    }

    animate() {

        this.updateLine();

        // this.updateText(textNum);
        // this.updateDirection(direction);

        this.frameId = requestAnimationFrame(this.animate);
    }
}

// These are all the parameters that MUST be passed
// Into ZodiacStrip by main.jsx
ZodiacStrip.propTypes = {
    // radiusObserverPlanet: PropTypes.number.isRequired,
    // observerPlanetAngle: PropTypes.number.isRequired,
    // radiusTargetPlanet: PropTypes.number.isRequired,
    // targetPlanetAngle: PropTypes.number.isRequired,
    //
    // updateAngles: PropTypes.func.isRequired
};
