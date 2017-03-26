let arriveRange = 50;
let fleeRange;
const arriveWeight = 1.25;
let fleeWeight;

function Dot(x, y, r) {
    Particle.call(this, x, y);
    this.pos = createVector(random(width), random(height));
    this.target = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.color = getColor(diagGradient, this.pos);
    this.r = r;
}
Dot.prototype = Object.create(Particle.prototype);
Dot.prototype.constructor = Dot;
Dot.prototype.r = 2;
Dot.prototype.maxSpeed = 8;
Dot.prototype.maxForce = 0.7;
Dot.prototype.update = function () {
    Particle.prototype.update.call(this)
    this.acc.mult(0);
    this.color = getColor(diagGradient, this.pos);
}
Dot.prototype.setTarget = function (newTarget) {
    this.target = newTarget;
}
Dot.prototype.behaviors = function (fleeTarget) {
    //let seek = this.seek(this.target);
    let arrive = this.arrive(this.target);
    arrive.mult(arriveWeight);
    this.applyForce(arrive);
    if (fleeTarget) {
        let flee = this.flee(fleeTarget);
        flee.mult(fleeWeight);
        this.applyForce(flee);
    }
}
Dot.prototype.arrive = function (tgt) {
    let desired = p5.Vector.sub(tgt, this.pos)
    let distance = desired.mag();
    let speed = this.maxSpeed;
    if (distance < arriveRange) {
        speed = map(distance, 0, arriveRange, 0, this.maxSpeed);
    }
    desired.setMag(speed);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    return steer;
}
Dot.prototype.seek = function (tgt) {
    let desired = p5.Vector.sub(tgt, this.pos)
    desired.setMag(this.maxSpeed);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    return steer;
}
Dot.prototype.flee = function (tgt) {
    let desired = p5.Vector.sub(tgt, this.pos)
    let distance = desired.mag();
    if (distance < fleeRange) {
        desired.setMag(this.maxSpeed);
        desired.mult(-1);
        let steer = p5.Vector.sub(desired, this.vel);
        steer.limit(this.maxForce);
        return steer;
    }
    else {
        return ZERO_VECTOR;
    }
}

function FadeOutDecorator(prtcl, lifeTime) {
    prtcl.startingTime = millis();
    prtcl.lifeTime = lifeTime;
    prtcl.isDead = false;
    prtcl.target.x = random(width);
    prtcl.target.y = random(height);
    prtcl.alpha = 255;
    prtcl.update = function () {
        Object.getPrototypeOf(this).update.call(this);
        let timePassed = millis() - this.startingTime;
        if (timePassed > this.lifeTime) {
            this.isDead = true;
        }
        else {
            this.alpha = map(timePassed, 0, this.lifeTime, 255, 0);
        }
        colorMode(RGB);
        this.color = color(red(this.color), green(this.color), blue(this.color), this.alpha);
    }
}

function FadeInDecorator(prtcl, fadeInDuration) {
    prtcl.startingTime = millis();
    prtcl.fadeInDur = fadeInDuration;
    prtcl.update = function () {
        Object.getPrototypeOf(this).update.call(this);
        let timePassed = millis() - this.startingTime;
        if (timePassed >= this.fadeInDur) {
            delete prtcl.update;
        }
        else {
            let alpha = map(timePassed, 0, fadeInDuration, 0, 255);
            colorMode(RGB);
            this.color = color(red(this.color), green(this.color), blue(this.color), alpha);
        }
    }
}

function RadiusChangeAnimateDecorator(prtcl, newR, animDur) {
    prtcl.startingTime = millis();
    prtcl.animDur = animDur;
    prtcl.newR = newR;
    prtcl.oldR = prtcl.r;
    prtcl.update = function () {
        Object.getPrototypeOf(this).update.call(this);
        let timePassed = millis() - this.startingTime;
        if (timePassed >= this.animDur) {
            delete prtcl.update;
            delete prtcl.oldR;
            delete prtcl.newR;
            delete prtcl.animDur;
            delete prtcl.startingTime;
        }
        else {
            this.r = map(timePassed, 0, this.animDur, this.oldR, this.newR);
        }
    }
}

function animateDotProp(prtcl, opts) {
    prtcl.update = function () {
        Object.getPrototypeOf(this).update.call(this);
        let timePassed = millis() - opts.startingTime;
        if (timePassed >= opts.animDur) {
            opts.clearAnim(prtcl);
        }
        else {
            opts.animFunc(opts, timePassed, this);
        }
    }
}

function FadeOutAnimFunc(opts, timePassed, prtcl) {
    this.alpha = map(timePassed, 0, opts.animDur, 255, 0);
    colorMode(RGB);
    this.color = color(red(this.color), green(this.color), blue(this.color), this.alpha);
}

function FadeInAnimFunc(opts, timePassed, prtcl) {
    let alpha = map(timePassed, 0, opts.animDur, 0, 255);
    colorMode(RGB);
    prtcl.color = color(red(prtcl.color), green(prtcl.color), blue(prtcl.color), alpha);
}

function RadiusChangeAnimFunc(opts, timePassed, prtcl) {
    prtcl.r = map(timePassed, 0, opts.animDur, opts.oldR, opts.newR);
}

function FadeInDecoratorModul(prtcl, fadeInDuration) {
    opts = {};
    opts.startingTime = millis();
    opts.animDur = fadeInDuration;
    opts.animFunc = FadeInAnimFunc;
    opts.clearAnim = (prtcl) => {
        delete prtcl.update
    };
    animateDotProp(prtcl, opts);
}

function FadeOutDecoratorModul(prtcl, lifeTime) {
    opts = {};
    opts.startingTime = millis();
    opts.animDur = lifeTime;
    prtcl.isDead = false;
    prtcl.target.x = random(width);
    prtcl.target.y = random(height);
    opts.alpha = 255;
    opts.animFunc = FadeOutAnimFunc;
    opts.clearAnim = (prtcl) => {
        prtcl.isDead = true;
    };
    animateDotProp(prtcl, opts);
}

function RadiusChangeDecoratorModul(prtcl, newR, animDur) {
    opts = {};
    opts.startingTime = millis();
    opts.animDur = animDur;
    opts.newR = newR;
    opts.oldR = prtcl.r;
    opts.animFunc = (opts, timePassed, prtcl) => {
        prtcl.r = map(timePassed, 0, opts.animDur, opts.oldR, opts.newR);
    };
    opts.clearAnim = (prtcl) => {
        delete prtcl.update;
    };
    animateDotProp(prtcl, opts);
}