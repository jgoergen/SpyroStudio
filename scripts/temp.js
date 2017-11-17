
var skipCalc = SETTING_TRANSITION_SPEED;
var baseX, baseY, r, g, b, stopX, stopY;
var oldX = undefined, oldY = undefined;
var finish = false;
var joints = new Array();
var drawRounds = 1;
var newDrawRounds = 1;
var fadeAmount = 1;
var newFadeAmount = 1;

function init() {

    ctx.lineStyle = "#fff";
    ctx.fillRect(0, 0, MAX_WIDTH, MAX_HEIGHT);

    r = Math.floor(Math.random() * 255);
    g = Math.floor(Math.random() * 255);
    b = Math.floor(Math.random() * 255);

    baseX = MAX_WIDTH / 2;
    baseY = MAX_HEIGHT / 2;

    for (var i = 0; i <= MAX_JOINTS; i++) {

        joints
          .push({
              armLength: 0,
              angleChangeRate: 0,
              angle: 0,
              newArmLength: 0,
              newAngleChangeRate: 0,
          });
    }

    updateJoints();
}

function updateJoints() {

    // build up joints
    var armLength = ARM_LENGTH;
    var angleDevisor = ANGLE_RATE_CHANGE_START;
    var jointCount = Math.ceil(JOINT_COUNT);

    for (var i = 0; i < MAX_JOINTS; i++) {

        joints[i]
        .newArmLength =
            i < jointCount ?
            armLength :
                0;

        joints[i]
        .newAngleChangeRate =
            i < jointCount ?
                ANGLE_RATE_CHANGE * angleDevisor :
                0;

        armLength *= DEVISOR;
        angleDevisor = MAX_JOINTS * ANGLE_DEVISOR_CHANGE;
    }
}

function draw() {

    // process each joint to get the final x/y
    var x = baseX;
    var y = baseY;
    var lastAngle = 0;
    var initialMatches = 0;

    for (var i = 0; i < joints.length; i++) {

        joints[i].angle += joints[i].angleChangeRate * SCALING;

        if (joints[i].angle > 360)
            joints[i].angle = 0;

        x += Math.cos((joints[i].angle + lastAngle) * (Math.PI / 180)) * joints[i].armLength;
        y += Math.sin((joints[i].angle + lastAngle) * (Math.PI / 180)) * joints[i].armLength;

        lastAngle = joints[i].angle;
    }

    drawPoint(x, y);

    if (stopX == undefined) {

        stopX = x;
        stopY = y;
    } else if (stopX == x && stopY == y) {
        finish = true;
    }
}

function drawPoint(_x, _y) {

    if (!oldX) {
        oldX = _x;
        oldY = _y;
    }

    //ctx.fillRect(_x - 1, _y - 1, 2, 2);
    ctx.moveTo(oldX, oldY);
    ctx.lineTo(_x, _y);

    oldX = _x;
    oldY = _y;
}

var canvas = null,
    ctx = null;

function update() {

    if (finish == true)
        return;

    //ctx.clearRect(0, 0, 300, 300);
    var alpha = 1;
    ctx.lineWidth = STARTING_THICKNESS;

    ctx.fillStyle = "rgba(0,0,0," + fadeAmount + ")";
    ctx.fillRect(0, 0, MAX_WIDTH, MAX_HEIGHT);

    ctx.fillStyle = "rgba(" + Math.floor(r) + "," + Math.floor(g) + "," + Math.floor(b) + "," + alpha + ")";
    ctx.strokeStyle = "rgba(" + Math.floor(r) + "," + Math.floor(g) + "," + Math.floor(b) + "," + alpha + ")";

    ctx.beginPath();

    for (var i = 0; i < drawRounds; i++) {

        runCalc();
        ctx.strokeStyle = "rgba(" + Math.floor(r) + "," + Math.floor(g) + "," + Math.floor(b) + "," + alpha + ")";
        draw();
    }

    ctx.stroke();
    requestAnimationFrame(update);
}

function runCalc() {

    skipCalc++;

    if (skipCalc > SETTING_TRANSITION_SPEED) {

        r += R_ADJUST;
        g += G_ADJUST;
        b += B_ADJUST;

        if (r < 0 || r > 255)
            R_ADJUST *= -1;

        if (g < 0 || g > 255)
            G_ADJUST *= -1;

        if (b < 0 || b > 255)
            B_ADJUST *= -1;

        for (var i = 0; i < MAX_JOINTS; i++) {

            if (joints[i].armLength < joints[i].newArmLength)
                joints[i].armLength += JOINT_LENGTH_CHANGE_RATE;
            else
                joints[i].armLength -= JOINT_LENGTH_CHANGE_RATE;

            if (joints[i].angleChangeRate < joints[i].newAngleChangeRate)
                joints[i].angleChangeRate += JOINT_ANGLE_CHANGE_RATE;
            else
                joints[i].angleChangeRate -= JOINT_ANGLE_CHANGE_RATE;

            if (drawRounds < NEW_DRAW_ROUNDS)
                drawRounds += 0.5;
            else
                drawRounds -= 0.5;

            if (fadeAmount < NEW_FADE_AMOUNT)
                fadeAmount += 0.005;
            else
                fadeAmount -= 0.005;
        }

        skipCalc = 0;
    }
}



