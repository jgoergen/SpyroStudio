var Spyro = 
    function(settings) {

        var finish = 
            false;
            
        var joints = 
            [];

        var baseX, 
            baseY, 
            r, 
            g, 
            b, 
            stopX, 
            stopY,
            oldX,
            oldY,
            scaling,
            settingTransitionSpeed,
            jointAngleChangeRate,
            jointLengthChangeRate,
            maxWidth,
            maxHeight,
            maxJoints,
            startingThickness,
            rAdjust,
            gAdjust,
            bAdjust,
            jointCount,
            armLength,
            devisor,
            angleDevisorChange,
            newDrawRounds,
            newFadeAmount,
            lineAlpha,
            newLineAlpha,
            angleRateChange,
            angleRateChangeStart =
            undefined;

        var skipCalc,
            drawRounds,
            fadeAmount =
            1;

        function init(settings) {
            
            skipCalc = 
                settings
                .settingTransitionSpeed;

            scaling = 
                settings
                .scaling;

            settingTransitionSpeed = 
                settings
                .settingTransitionSpeed;

            jointAngleChangeRate = 
                settings
                .jointAngleChangeRate;

            jointLengthChangeRate = 
                settings
                .jointLengthChangeRate;

            maxWidth = 
                settings
                .maxWidth;

            maxHeight = 
                settings
                .maxHeight;

            maxJoints = 
                settings
                .maxJoints;

            startingThickness = 
                settings
                .startingThickness;

            rAdjust = 
                settings
                .rAdjust;

            gAdjust = 
                settings
                .gAdjust;

            bAdjust = 
                settings
                .bAdjust;

            jointCount = 
                settings
                .jointCount;

            armLength = 
                settings
                .armLength;

            devisor = 
                settings
                .devisor;

            angleDevisorChange = 
                settings
                .angleDevisorChange;

            drawRounds =
                newDrawRounds = 
                    settings
                    .newDrawRounds;

                    

            lineAlpha = 
                newLineAlpha = 
                    settings
                    .newLineAlpha;

            fadeAmount = 
                newFadeAmount = 
                    settings
                    .newFadeAmount;

            angleRateChange = 
                settings
                .angleRateChange;

            angleRateChangeStart = 
                settings
                .angleRateChangeStart;
        
            r = Math.floor(Math.random() * 255);
            g = Math.floor(Math.random() * 255);
            b = Math.floor(Math.random() * 255);
        
            baseX = maxWidth / 2;
            baseY = maxHeight / 2;
        
            for (var i = 0; i <= maxJoints; i++) {
        
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
            var newArmLength = armLength;
            var angleDevisor = angleRateChangeStart;
        
            for (var i = 0; i < maxJoints; i++) {
        
                joints[i]
                .newArmLength =
                    i < Math.ceil(jointCount) ?
                    newArmLength :
                        0;
        
                joints[i]
                .newAngleChangeRate =
                    i < Math.ceil(jointCount) ?
                        angleRateChange * angleDevisor :
                        0;
        
                newArmLength *= devisor;
                angleDevisor = maxJoints * angleDevisorChange;
            }
        }
        
        function draw() {
        
            // process each joint to get the final x/y
            var x = baseX;
            var y = baseY;
            var lastAngle = 0;
            var initialMatches = 0;
        
            for (var i = 0; i < joints.length; i++) {
        
                joints[i].angle += joints[i].angleChangeRate * scaling;
        
                if (joints[i].angle > 360)
                    joints[i].angle = 0;
        
                x += Math.cos((joints[i].angle + lastAngle) * (Math.PI / 180)) * joints[i].armLength;
                y += Math.sin((joints[i].angle + lastAngle) * (Math.PI / 180)) * joints[i].armLength;
        
                lastAngle = joints[i].angle;
            }
        
            drawPoint(x, y, ctx);
        
            if (stopX == undefined) {
        
                stopX = x;
                stopY = y;
            } else if (stopX == x && stopY == y) {
                finish = true;
            }
        }
        
        function drawPoint(_x, _y, _ctx) {
        
            if (!oldX) {
                oldX = _x;
                oldY = _y;
            }
        
            //ctx.fillRect(_x - 1, _y - 1, 2, 2);
            _ctx.moveTo(oldX, oldY);
            _ctx.lineTo(_x, _y);
        
            oldX = _x;
            oldY = _y;
        }
        
        function update(ctx) {
        
            if (finish == true)
                return;
        
            //ctx.clearRect(0, 0, 300, 300);
            var alpha = lineAlpha;
            ctx.lineWidth = startingThickness;
        
            ctx.fillStyle = "rgba(0,0,0," + fadeAmount + ")";
            ctx.fillRect(0, 0, maxWidth, maxHeight);
        
            ctx.fillStyle = "rgba(" + Math.floor(r) + "," + Math.floor(g) + "," + Math.floor(b) + "," + alpha + ")";
            ctx.strokeStyle = "rgba(" + Math.floor(r) + "," + Math.floor(g) + "," + Math.floor(b) + "," + alpha + ")";
        
            ctx.beginPath();
        
            for (var i = 0; i < drawRounds; i++) {
        
                runCalc();
                ctx.strokeStyle = "rgba(" + Math.floor(r) + "," + Math.floor(g) + "," + Math.floor(b) + "," + alpha + ")";
                draw();
            }
        
            ctx.stroke();
        }
        
        function runCalc() {
        
            skipCalc++;
        
            if (skipCalc > settingTransitionSpeed) {
        
                r += rAdjust;
                g += gAdjust;
                b += bAdjust;
        
                if (r < 0 || r > 255)
                    rAdjust *= -1;
        
                if (g < 0 || g > 255)
                    gAdjust *= -1;
        
                if (b < 0 || b > 255)
                    bAdjust *= -1;
        
                for (var i = 0; i < maxJoints; i++) {
        
                    if (joints[i].armLength < joints[i].newArmLength)
                        joints[i].armLength += jointLengthChangeRate;
                    else
                        joints[i].armLength -= jointLengthChangeRate;
        
                    if (joints[i].angleChangeRate < joints[i].newAngleChangeRate)
                        joints[i].angleChangeRate += jointAngleChangeRate;
                    else
                        joints[i].angleChangeRate -= jointAngleChangeRate;
        
                    if (drawRounds < newDrawRounds)
                        drawRounds += 0.5;
                    else
                        drawRounds -= 0.5;
        
                    if (fadeAmount < newFadeAmount)
                        fadeAmount += 0.005;
                    else
                        fadeAmount -= 0.005;

                    if (lineAlpha < newLineAlpha)
                        lineAlpha += 0.005;
                    else
                        lineAlpha -= 0.005;
                }
        
                skipCalc = 0;
            }
        }
        
        init(settings);

        return {
            update: update
        };
    }