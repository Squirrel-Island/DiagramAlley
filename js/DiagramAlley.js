CorduleJS.addModule('DiagramAlley', (function() {
    var regions = {};
    var regionCount = 0;
    var modes = {};
    var canvas = document.getElementById('diagram-canvas');

    var addRegion = function(regData) {
        if(!(regData && regData.label && regData.x && regData.y && regData.width && regData.height))
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

        return true;
    }

    var setRegion = function(regData) {
        if(!(regData && regData.id && regData.label && regData.x && regData.y && regData.width && regData.height))
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
        if(!(regData && regData.id && regions[regData.id]))
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
            return false

        CorduleJS.pushRequest('unlink');
        CorduleJS.pushRequest(modeData.name+'_mode', {regData: regions, canvas: canvas});
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
        },
        destroy: function() {}
    };
})());