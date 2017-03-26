function getColor(colorMapFunc, payload) {
    return colorMapFunc(payload);
}

function diagGradient(pos) {
    colorMode(HSB);
    let posHue = map(pos.x + pos.y, 0, height + width, 0, 360);
    let clr = color(posHue, 100, 90);
    colorMode(RGB);
    return clr;
}

function indexGradient({
    index, totalDots
}) {
    colorMode(HSB);
    let indexHue = map(index, 0, totalDots, 0, 360);
    let clr = color(indexHue, 100, 90);
    colorMode(RGB);
    return clr;
}