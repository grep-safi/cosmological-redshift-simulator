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
