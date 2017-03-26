/*["בוקר טוב עולם,"
    , "מה שלום כולם? "
    , "אני יורד מן החוטים"
    , "אני כבר ילד אמיתי"
    , "כמו כל הילדים"];*/
let txtLines = ["טוען את הברכה..."];
let currLine = 0;
let dots = [];
let nextYDots = [];
let intervals = [4736.865, 5127.85, 6137.405, 7935.89, 5976.585, 5832.075, 5671.865, 6113.595, 5419.285, 5569.515];
let currLineStartTime;
let currLIneStopTime;
let looping = false;
let first = true;
let txtBounds;
let fleeTarget;
let font;
let ZERO_VECTOR;
let bgColor;
let sampleFactor;
const LINE_SWITCH_INTERVAL = 5500;
const FLEE_TARGET_LIFETIME = 1000;
const DOT_FADE_IN_DUR = FLEE_TARGET_LIFETIME;
const DOT_FADE_OUT_DUR = 4000;
const HORIZ_PADDING = 5;
const MIN_FONT_SIZE = 35;
const MAX_FONT_SIZE = 150;
const MIN_POINT_SAMPLE_FACTOR = 0.12;
const MAX_POINT_SAMPLE_FACTOR = 0.3;
const MAX_DOT_SIZE = 5;
const MIN_DOT_SIZE = 2;
const APPROX_MIN_WIN_WIDTH = 800;

function preload() {
    font = loadFont('VarelaRound-Regular.ttf');
    txtLines = loadStrings('greeting.txt');
    ZERO_VECTOR = createVector();
}

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    updatePhysicsAndSizes();
    textFont(font);
    textSize(25);
    fill('white');
    dots = proccessText(txtLines[currLine]);
    //fleeTarget = new MovingFleeTarget(10, 25);
    //setInterval(nextLine, LINE_SWITCH_INTERVAL);
    setTimeout(nextLine, intervals[currLine]);
    bgColor = color(61);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    updatePhysicsAndSizes();
}

function updatePhysicsAndSizes() {
    fleeRange = width / 2;
    fleeWeight = fleeRange / 50;
    Dot.prototype.maxSpeed = fleeWeight * 1.33;
    Dot.prototype.maxForce = 0.7 / 600 * width;
    arriveRange = width * 0.083;
    // Map dot sample factor to window width
    // and map dot size to sample factor
}

function mouseClicked() {
    /*  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
      fleeTarget = new MovingFleeTarget(mouseX, mouseY);
      }*/
    /*if (looping) {
        looping = false;
        currLineStopTime = millis();
        intervals.push(currLineStopTime - currLineStartTime);
        noLoop();
        console.log(intervals);
        nextLine();
    }
    else {
        looping = true;
        loop();
        if (first) {
            first = false;
        }
        else {
            fleeTarget = new Particle(width / 2, height / 2);
            setTimeout(() => {
                fleeTarget = undefined
            }, FLEE_TARGET_LIFETIME);
        }
        currLineStartTime = millis();
    }*/
}

function draw() {
    background(bgColor);
    if (fleeTarget) {
        fleeTarget.update();
        //fleeTarget.show();
    }
    dots.map(function (dot, index) {
            if (dot.isDead) {
                dots.splice(index, 1);
            }
            else {
                dot.update();
                if (fleeTarget) {
                    dot.behaviors(fleeTarget.pos);
                }
                else {
                    dot.behaviors();
                }
                dot.show();
            }
        })
        //drawBounds(txtBounds);
        //txtBounds.map(drawBounds);
        /*nextYDots.map(function (dot) {
            fill(0, 200, 0);
            ellipse(dot.x, dot.y, 6);
        })*/
}

function nextLine() {
    currLine = (currLine + 1) % txtLines.length;
    let nextDots = proccessText(txtLines[currLine]);
    fleeTarget = new Particle(width / 2, height / 2);
    setTimeout(() => {
        fleeTarget = undefined
    }, FLEE_TARGET_LIFETIME);
    setTimeout(nextLine, intervals[currLine]);
    moveToNextLine(nextDots);
}

function moveToNextLine(nextDots) {
    if (dots.length == nextDots.length) {
        for (let i = 0; i < dots.length; i++) {
            dots[i].setTarget(nextDots[i].target);
        }
    }
    else if (nextDots.length > dots.length) {
        for (let i = 0; i < nextDots.length; i++) {
            if (i < dots.length) {
                dots[i].setTarget(nextDots[i].target);
                //RadiusChangeAnimateDecorator(dots[i], nextDots[i].r, DOT_FADE_IN_DUR);
                RadiusChangeDecoratorModul(dots[i], nextDots[i].r, DOT_FADE_IN_DUR);
            }
            else {
                //FadeInDecorator(nextDots[i], DOT_FADE_IN_DUR);
                FadeInDecoratorModul(nextDots[i], DOT_FADE_IN_DUR);
                dots.push(nextDots[i]);
            }
        }
    }
    else {
        let dotsToRemove = dots.length - nextDots.length;
        for (let i = 0; i < dotsToRemove; i++) {
            FadeOutDecorator(dots[i], DOT_FADE_OUT_DUR);
        }
        for (let i = dotsToRemove; i < dots.length; i++) {
            let newDot = nextDots[i - dotsToRemove];
            dots[i].setTarget(newDot.target);
            //RadiusChangeAnimateDecorator(dots[i], newDot.r, DOT_FADE_IN_DUR);
            RadiusChangeDecoratorModul(dots[i], newDot.r, DOT_FADE_IN_DUR);
        }
    }
}

function reverseString(str) {
    return str.split("").reverse().join("");
}
/*
    addTxtDot - A function that takes a dot from p5.Font.textToPoints function
                and stores it in the dots that will be displayed.
    x - The x poistion of the start of the line
    y - The y position of the start of the line
    midY - The center y of the bounding box of the 1st word
    words - An array of words in a single line
*/
function addWordDots(addTxtDot, x, y, fontSize, words) {
    if (words.length > 0) {
        font.textToPoints(words[0], x, y, fontSize, {
            sampleFactor: sampleFactor
        }).map(addTxtDot);
        let bounds = font.textBounds(words[0] + " ", x, y, fontSize);
        let nextX = bounds.x + bounds.w;
        words.splice(0, 1);
        addWordDots(addTxtDot, nextX, y, fontSize, words);
    }
}

function drawBounds(bounds) {
    let {
        x, y, w, h
    } = bounds;
    colorMode(RGB);
    stroke(200, 0, 0);
    line(x, y, x, y + h);
    line(x + w, y, x + w, y + h);
    line(x, y + h, x + w, y + h);
    line(x, y, x + w, y);
}

function proccessText(txt) {
    let lineDots = [];
    let words = txt.split(" ").reverse().map((word) => reverseString(word));
    let lineStr = words.join(" ");
    let fontSize = calcFontSize(lineStr);
    let currDotR = map(fontSize, MIN_FONT_SIZE, MAX_FONT_SIZE, MIN_DOT_SIZE, MAX_DOT_SIZE);
    sampleFactor = map(fontSize, MIN_FONT_SIZE, MAX_FONT_SIZE, MAX_POINT_SAMPLE_FACTOR, MIN_POINT_SAMPLE_FACTOR);
    let {
        x, y
    } = centerLinePos(font.textBounds(lineStr, 0, 0, fontSize));
    txtBounds.x = x;
    txtBounds.y = y - txtBounds.h;
    let addTxtDot = txtDot => {
        lineDots.push(new Dot(txtDot.x, txtDot.y, currDotR))
    };
    addWordDots(addTxtDot, x, y, fontSize, words);
    return lineDots;
}

function calcFontSize(lineStr, fontSize = MAX_FONT_SIZE) {
    txtBounds = font.textBounds(lineStr, 0, 0, fontSize);
    let nextFontSize = fontSize / 2 + fontSize / 4;
    if (txtBounds.w <= width - 2 * HORIZ_PADDING) {
        return fontSize;
    }
    else if (nextFontSize > MIN_FONT_SIZE) {
        return calcFontSize(lineStr, nextFontSize);
    }
    else {
        txtBounds = font.textBounds(lineStr, 0, 0, MIN_FONT_SIZE);
        return MIN_FONT_SIZE;
    }
}

function centerLinePos(lineBounds) {
    return {
        x: width / 2 - lineBounds.w / 2
        , y: height / 2 + lineBounds.h / 2
    };
}

function calcMidY(word, y, fontSize) {
    let bounds = font.textBounds(word, 0, y, fontSize);
    return bounds.y + bounds.h / 2;
}

function copyArr(arr) {
    let newArr = [];
    arr.map(item => {
        newArr.push(item)
    });
    return newArr;
}