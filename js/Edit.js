CorduleJS.addModule('Edit', (function() {
    var canvas;
    var context;
    var regions;

    //states
    var mousePos = {};
    var mouseDownPos = null;
    var loaded = false;

    var link = function(appData) {
        if(!appData || !appData.regData || !appData.canvas)
            return false;

        regions = {};
        var temp_regions = appData.regData;

        for(key in temp_regions) {
            var uniqueID = genUniqueID();
            regions[uniqueID] = temp_regions[key];
            regions[uniqueID].tempID = uniqueID;
        }

        canvas = appData.canvas;
        context = canvas.getContext('2d');

        canvas.addEventListener('mousedown', startDrawnBox);
        canvas.addEventListener('mousemove', calculateDrawnBox);
        canvas.addEventListener('mouseup', createRegionFromDrawnBox);
        canvas.addEventListener('click', editIfInRegion);

        drawRegionBoxes();

        loaded = true;
    }

    var unlink = function() {
        console.log(regions);
        if(!loaded)
            return;

        regions = null;
        context.clearRect(0,0,canvas.width,canvas.height);
        canvas.removeEventListener('mousedown', startDrawnBox);
        canvas.removeEventListener('mousemove', calculateDrawnBox);
        canvas.removeEventListener('mouseup', createRegionFromDrawnBox);
        canvas.removeEventListener('click', editIfInRegion);

        mouseDownPos = null;
        loaded = false;
    }

    var editIfInRegion = function(evt) {
        updateMousePos(evt);
        var reg = getFirstOverlappingBox();
        if(!reg)
            return false;
        CorduleJS.pushRequest('displayModal', {
            label: reg.label,
            desc: reg.desc,
            tempID: reg.tempID,
            regEditMode: 'set',
            callback: setRegionData
        });
    }

    function getFirstOverlappingBox() {
        for(key in regions) {
            var reg = regions[key];
            var origin = {
                x: reg.x,
                y: reg.y
            };
            var endPoint = {
                x: reg.x + reg.width,
                y: reg.y + reg.height
            };
            if(reg.width < 0) {
                origin.x = reg.x + reg.width;
                endPoint.x = reg.x;
            }
            if(reg.height < 0) {
                origin.y = reg.y + reg.height;
                endPoint.y = reg.y;
            }

            if(mousePos.x > origin.x && mousePos.x < endPoint.x && mousePos.y > origin.y && mousePos.y < endPoint.y)
                return reg;
        }
        return false;
    }

    var startDrawnBox = function(evt) {
        updateMousePos(evt);
        if(!mouseDownPos) {
            mouseDownPos = {
                x: mousePos.x,
                y: mousePos.y
            };
        }
    }

    var calculateDrawnBox = function(evt) {
        if(!mouseDownPos)
            return;

        updateMousePos(evt);
        drawDraggableBox();
    }

    var createRegionFromDrawnBox = function() {
        var randID = genUniqueID();

        regions[randID] = {
            x: mouseDownPos.x,
            y: mouseDownPos.y,
            width: mousePos.x - mouseDownPos.x,
            height: mousePos.y - mouseDownPos.y,
            tempID: randID
        };

        mouseDownPos = null;

        CorduleJS.pushRequest('displayModal', {
            label: "",
            desc: "",
            tempID: randID,
            regEditMode: 'add',
            callback: setRegionData
        });
    }

    var setRegionData = function(regData) {
        if(!(regData && regData.tempID && regData.label && regData.regEditMode)) {
            if(regions[regData.tempID]) {
                delete regions[regData.tempID];
                drawRegionBoxes();
            }
            return false;
        }

        if(!regions[regData.tempID])
            return false;

        regions[regData.tempID].label = regData.label;
        regions[regData.tempID].desc = regData.desc || '';

        switch(regData.regEditMode) {
            case 'add':
                regions[regData.tempID] = CorduleJS.pushRequest('addRegion',regions[regData.tempID])[0];
                regions[regData.tempID].tempID = regData.tempID;
                break;
            case 'set':
                CorduleJS.pushRequest('setRegion',regions[regData.tempID]);
                break;
            case 'remove':
                CorduleJS.pushRequest('removeRegion',regions[regData.tempID]);
                delete regions[regData.tempID];
                break;
        }

        drawRegionBoxes();
    }

    function drawRegionBoxes() {
        context.clearRect(0,0,canvas.width,canvas.height);
        for(key in regions) {
            var reg = regions[key];
            context.beginPath();
            context.lineWidth = 1;
            context.strokeStyle = 'green';
            context.rect(reg.x,reg.y,reg.width,reg.height);
            context.stroke();
        }
    }

    function drawDraggableBox() {
        drawRegionBoxes();
        context.beginPath();
        context.rect(mouseDownPos.x,mouseDownPos.y,mousePos.x - mouseDownPos.x, mousePos.y - mouseDownPos.y);
        context.lineWidth = 1;
        context.strokeStyle = 'black';
        context.stroke();
    }

    function updateMousePos(evt) {
        var rect = canvas.getBoundingClientRect();
        mousePos.x = evt.clientX - rect.left;
        mousePos.y = evt.clientY - rect.top;
    }

    function genUniqueID() {
        var randID = Math.random();
        while(regions[randID])
            randID = Math.random();

        return randID;
    }

    return {
        init: function() {
            var self = this;
            CorduleJS.observe(self,'Edit_mode', link);
            CorduleJS.observe(self,'unlink', unlink);

            CorduleJS.pushRequest('registerMode', {name:'Edit'});
            CorduleJS.pushRequest('registerMode', {name:'Lol'});

            //for testing purposes
            CorduleJS.observe(self,'displayModal', function(tempRegData) {
                var submit = document.getElementById('sub');
                var del = document.getElementById('del');
                document.getElementById('label').value = tempRegData.label;
                document.getElementById('desc').value = tempRegData.desc;
                submit.onclick = function() {
                    tempRegData.label = document.getElementById('label').value;
                    tempRegData.desc = document.getElementById('desc').value;
                    tempRegData.callback(tempRegData);
                    submit.onclick = "";
                };
                if(del) 
                    del.onclick = function() {
                        tempRegData.regEditMode = 'remove';
                        tempRegData.label = document.getElementById('label').value;
                        tempRegData.desc = document.getElementById('desc').value;
                        tempRegData.callback(tempRegData);
                    }
            });

        },
        destroy: function() {}
    };
})());