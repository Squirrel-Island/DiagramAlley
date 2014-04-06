CorduleJS.addModule('DiagramAlley', (function() {
    var regions = {};
    var regionCount = 0;
    var modes = {};
    var canvas = document.getElementById('diagram-canvas');
    var image = new Image();

    var addRegion = function(regData) {
        if(!(regData && regData.label && isSet(regData.x) && isSet(regData.y) && isSet(regData.width) && isSet(regData.height)))
            return false;

        regions[regionCount] = {
            id     : regionCount, 
            label  : regData.label,
            desc   : regData.desc || "",
            x      : regData.x,
            y      : regData.y,
            width  : regData.width,
            height : regData.height 
        };

        regionCount++;

        return {
            id     : regionCount-1, 
            label  : regData.label,
            desc   : regData.desc || "",
            x      : regData.x,
            y      : regData.y,
            width  : regData.width,
            height : regData.height 
        };
    }

    var setRegion = function(regData) {
        if(!(regData && isSet(regData.id) && regData.label && isSet(regData.x) && isSet(regData.y) && isSet(regData.width) && isSet(regData.height)))
            return false;

        if(!regions[regData.id])
            return false;

        regions[regData.id].label  = regData.label;
        regions[regData.id].desc   = regData.desc || "";
        regions[regData.id].x      = regData.x;
        regions[regData.id].y      = regData.y;
        regions[regData.id].width  = regData.width;
        regions[regData.id].height = regData.height;

        return true;
    }

    var removeRegion = function(regData) {
        if(!(regData && isSet(regData.id) && regions[regData.id]))
            return false;

        delete regions[regData.id];

        return true;
    }

    var registerMode = function(modeData) {
        if(!(modeData && modeData.name))
            return false;

        if(modes[modeData.name])
            return false;

        modes[modeData.name] = {
            name: modeData.name
        };

        CorduleJS.pushRequest('displayModeUI', {name: modeData.name});

        return true;
    }

    var removeMode = function(modeData) {
        if(!(modeData && modeData.name))
            return false;

        if(!modes[modeData.name])
            return false

        delete modes[modeData.name];

        CorduleJS.pushRequest('hideModeUI', {name: modeData.name});

        return true;
    }

    var switchMode = function(modeData) {
        if(!(modeData && modeData.name))
            return false;

        if(!modes[modeData.name])
            return false;

        //make duplicate so other modules cannot mess up the actual regions list
        var regData = {};
        for(key in regions) {
            if(Object.prototype.hasOwnProperty.call(regions,key)) {
                regData[key] = {
                    id: regions[key].id,
                    label: regions[key].label,
                    desc: regions[key].desc,
                    x: regions[key].x,   
                    y: regions[key].y,   
                    width: regions[key].width,   
                    height: regions[key].height   
                }
            }
        }

        CorduleJS.pushRequest('unlink');
        CorduleJS.pushRequest(modeData.name+'_mode', {regData: regData, canvas: canvas});
    }

    var loadImage = function(img) {
        var context = canvas.getContext('2d');
        image.onload = function() {
            var w = image.width;
            var h = image.height;
            var cw = canvas.width;
            var ch = canvas.height;

            if(w>h) {
                w = cw;
                h = cw * (image.height/image.width);
            }
            else {
                h = ch;
                w = ch * (image.width/image.height);
            }
            context.drawImage(image, 0,0,w,h);
        };

        image.src = img.src;
    }

    var drawImage = function() {
        var context = canvas.getContext('2d');
        var w = image.width;
        var h = image.height;
        var cw = canvas.width;
        var ch = canvas.height;

        if(w>h) {
            w = cw;
            h = cw * (image.height/image.width);
        }
        else {
            h = ch;
            w = ch * (image.width/image.height);
        }
        context.drawImage(image, 0,0,w,h);
    }

    function isSet(item) {
        return item !== null && item !== undefined;
    }

    return {
        init: function() {
            var self = this;
            CorduleJS.observe(self,'addRegion',addRegion);
            CorduleJS.observe(self,'setRegion',setRegion);
            CorduleJS.observe(self,'removeRegion',removeRegion);
            CorduleJS.observe(self,'registerMode',registerMode);
            CorduleJS.observe(self,'removeMode',removeMode);
            CorduleJS.observe(self,'switchMode',switchMode);
            CorduleJS.observe(self,'loadImage',loadImage);
            CorduleJS.observe(self,'drawImage',drawImage);
        },
        destroy: function() {}
    };
})());