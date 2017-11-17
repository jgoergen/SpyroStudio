var TouchSettings = 
    function(settings) {

        var startX,
            startY,
            wheelPosition,
            originalWheelPosition,
            settingOffset,
            originalSettingOffset,
            totalWheelHeight,
            totalSettingCount,
            lastSettingIndex,
            dragThreshold,
            settingWheelPadding,
            arrayValuePadding = 
            0;
        
        var settingData =
            undefined;

        var dragLockDirection = 
            "";

        function init(settings) {

            settingData = 
                settings
                .settings;

            dragThreshold =
                settings
                .dragThreshold;

            settingWheelPadding =
                settings
                .settingWheelPadding;

            arrayValuePadding =
                settings
                .arrayValuePadding;

            totalSettingCount = settingData.length;
            totalWheelHeight = totalSettingCount * settingWheelPadding;
        }

        function mouseDown(x, y) {
            
            startX = x;
            startY = y;
            originalWheelPosition = wheelPosition;
            originalSettingOffset = settingOffset;
        }
        
        function mouseUp() {
        
            dragLockDirection = "";
            startX = startY = 0;
        }
        
        function mouseMove(x, y) { 
        
            var xDist = x - startX;
            var yDist = y - startY;
        
            if (dragLockDirection == "LR") {
        
                settingOffset = originalSettingOffset + xDist;
                updateDisplay(wheelPosition, settingOffset)
            } else if (dragLockDirection == "UD") {
        
                wheelPosition = originalWheelPosition + yDist;
                updateDisplay(wheelPosition, settingOffset)
            } else {
        
                if (Math.abs(xDist) > Math.abs(yDist)) {
                    if (Math.abs(xDist) > dragThreshold) {
                        dragLockDirection = "LR";
                        startX = x;
                        startY = y;
                    }
                } else {
                    if (Math.abs(yDist) > dragThreshold) {
                        dragLockDirection = "UD";
                        startX = x;
                        startY = y;
                    }
                }
            }
        }
        
        function secondaryMouseDown(x, y) { 
        
        }
        
        function secondaryMouseUp() {
        
        }
        
        function secondaryMouseMove(x, y) {
        
        }

        function updateSetting(settingIndex, settingOffset) {
            
            switch (settingData[settingIndex].type) {
        
                case "number":
        
                    var actualNumber = settingOffset;
                    if (settingData[settingIndex].steps != null && settingData[settingIndex].steps != undefined)
                        actualNumber = settingOffset / settingData[settingIndex].steps;
        
                    // does this number have any limits? if so, clamp
                    if (settingData[settingIndex].lower != null && settingData[settingIndex].lower != undefined)
                        actualNumber = Math.max(settingData[settingIndex].lower, actualNumber);
        
                    if (settingData[settingIndex].upper != null && settingData[settingIndex].upper != undefined)
                        actualNumber = Math.min(settingData[settingIndex].upper, actualNumber);
        
                    settingData[settingIndex].value = actualNumber;
                    break;
        
                case "array":
        
                    // value wrapping
                    var actualSettingVal = settingOffset;
                    while (actualSettingVal >= settingData[settingIndex].values.length * arrayValuePadding)
                        actualSettingVal -= settingData[settingIndex].values.length * arrayValuePadding;
                    while (actualSettingVal < 0)
                        actualSettingVal += settingData[settingIndex].values.length * arrayValuePadding;
        
                    settingData[settingIndex].value = Math.floor(actualSettingVal / arrayValuePadding);
                    break;
            }
        
            if (settingData[settingIndex].callback != null && settingData[settingIndex].callback != undefined)
                settingData[settingIndex].callback(settingData[settingIndex].value);
        }
        
        function updateDisplay() {
        
            // wheel wrapping
            var actualWheelVal = wheelPosition;
            while (actualWheelVal >= totalWheelHeight)
                actualWheelVal -= totalWheelHeight;
            while (actualWheelVal < 0)
                actualWheelVal += totalWheelHeight;
        
            // figure out targetSetting
            var targetIndex = Math.floor(actualWheelVal / settingWheelPadding);
            var distToNext = (actualWheelVal / totalSettingCount) / settingWheelPadding;
        
            // did the setting change? then the offset has to go back to whatever it was.
            if (lastSettingIndex != targetIndex) {
        
                if (settingData[targetIndex].type == "array") {
        
                    settingOffset = originalSettingOffset = settingData[targetIndex].value * arrayValuePadding;
                } else if (settingData[targetIndex].steps != null && settingData[targetIndex].steps != undefined) {
        
                    settingOffset = originalSettingOffset = settingData[targetIndex].value * settingData[targetIndex].steps;
                } else {
        
                    settingOffset = originalSettingOffset = settingData[targetIndex].value;
                }
            }
        
            updateSetting(targetIndex, settingOffset);
            lastSettingIndex = targetIndex;
        }
        
        init(settings);

        return {
            mouseDown: mouseDown,
            mouseUp: mouseUp,
            mouseMove: mouseMove,
            secondaryMouseDown: secondaryMouseDown,
            secondaryMouseUp: secondaryMouseUp,
            secondaryMouseMove: secondaryMouseMove
        };
    }