var $ = jQuery = require('jquery');
function Marquee(opt){
    this.options = $.extend({
        width : 800,
        height : 30,
        dom : '#marquee',
        pauseOnHover : true,
        unit: 'li',               //滚动单位标签
        direction: "left",             //方向
        speed: 10             //滚动速度
    }, opt || {});
    this.init();
}
Marquee.prototype = {
    init : function(){
        this.createMarguee();
        this.bindEvent();
    },

    roll : function(){
        var opt = this.options;
        var dom = $(opt.dom)[0],
            unit = $(dom).find(opt.unit+':first')[0],
            wrap = $(unit).parent()[0]; 
        if(opt.direction == 'left'){
            var marquee = setInterval(function() {
                if (wrap.offsetWidth/2 - dom.scrollLeft <= 0)
                    dom.scrollLeft -= wrap.offsetWidth / 2
                else {
                    dom.scrollLeft++;
                };
            }, opt.speed);
        }else if(opt.direction == 'down'){
            var marquee = setInterval(function () {
                dom.scrollTop++;
                (dom.scrollTop == wrap.offsetHeight) && (dom.scrollTop = 0);
            }, opt.speed);
        }
        this.marquee = marquee;
    },

    setStyle : function(){
        var $dom = $(this.options.dom);
        var opt = this.options;
        $dom.css({
            'width' : opt.width,
            'height' : opt.height,
            'overflow' : 'hidden' 
        }); 
        if(opt.direction == 'left'){
            $dom.find(opt.unit).css('white-space','nowrap');
        }
    },

    createMarguee : function(){
        this.setStyle();
        var self = this,
            opt = this.options,
            $dom = $(opt.dom);
            $unit = $dom.find(opt.unit+':first');
        var $wrap = $unit.parent(); 
        if($dom.height() < $wrap.height() && opt.direction == 'down'){
            $dom.append($dom[0].innerHTML);
            self.roll();
        }else if($dom.width() < $unit.width() && opt.direction == 'left'){
            $wrap.append($wrap[0].innerHTML);
            self.roll();
        }
    },

    bindEvent : function(){
        var self = this ;
        if(self.options.pauseOnHover){
            $(self.options.dom).bind('mouseout',function(){
                self.roll();
            }).bind('mouseover',function(){
                self.stop();
            });
        }
    },

    stop : function(){
        clearTimeout(this.marquee);
    }
};
return Marquee;