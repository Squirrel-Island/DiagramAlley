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
        CorduleJS.pushRequest('drawImage');
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
        context.fillStyle = 'white';

        var labelMetric = context.measureText(reg.label);
        var descMetric = context.measureText(reg.desc);

        var metric = labelMetric.width > descMetric.width ? labelMetric:descMetric;

        var bgX = origin.x + ((endPoint.x - origin.x) - metric.width) / 2 - 20;

        context.beginPath();
        context.rect(bgX,textY-40, metric.width+40, 100);
        context.fillStyle = 'black';
        context.globalAlpha = 0.5;
        context.fill();

        context.globalAlpha = 1;
        context.font = '20pt Calibri';
        context.textAlign = 'center';
        context.fillStyle = 'white';
        context.fillText(reg.label,textX,textY);

        context.font = '14pt Calibri';
        context.textAlign = 'center';
        context.fillStyle = '#ddd';
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