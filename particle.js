function Particle(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();
    this.color = color(0, 0, 175);
}
Particle.prototype.r = 2;
Particle.prototype.show = function () {
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.r);
}
Particle.prototype.update = function () {
    this.pos.add(this.vel);
    this.vel.add(this.acc);
}
Particle.prototype.applyForce = function (f) {
    this.acc.add(f)
}

function MovingFleeTarget(x, y) {
    Particle.call(this, x, y);
    this.r = 6;
    this.speed = 0.75
    this.vel.x = this.speed;
    this.bounds = {
        right: 400
        , left: 10
    };
}
MovingFleeTarget.prototype = Object.create(Particle.prototype);
MovingFleeTarget.prototype.update = function () {
    let nextPos = p5.Vector.add(this.pos, this.vel);
    if (nextPos.x > this.bounds.right || nextPos.x < this.bounds.left) {
        this.vel.mult(-1);
    }
    Particle.prototype.update.call(this);
}