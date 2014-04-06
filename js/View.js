CorduleJS.addModule('View', (function() {
    var regions;
    var canvas;
    var context;

    var load = function(appData) {
        if(!appData || !appData.regData || !appData.canvas)
            return false;

        regions = appData.regData;
        canvas = appData.canvas;
        context = canvas.getContext('2d');

        context.clearRect(0,0,canvas.width,canvas.height);
        for(key in regions) {
            drawLabel(regions[key]);
        }
    } 

    function drawLabel(reg) {
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

        var textX = origin.x + (endPoint.x - origin.x) / 2;
        var textY = origin.y + (endPoint.y - origin.y) / 2;

        context.font = '20pt Calibri';
        context.textAlign = 'center';
        context.fillStyle = 'green';
        context.fillText(reg.label,textX,textY);

        context.font = '14pt Calibri';
        context.textAlign = 'center';
        context.fillStyle = '#555';
        context.fillText(reg.desc, textX, textY+40);

    }

    return {
        init: function() {
            var self = this;
            CorduleJS.observe(self,'View_mode', load);
            // CorduleJS.observe(self,'unlink', unlink);

            CorduleJS.pushRequest('registerMode', {name:'View'});
        },
        destroy: function() {}
    };
})());