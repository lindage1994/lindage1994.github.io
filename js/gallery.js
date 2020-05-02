$(document).ready(function($) {
    "use strict";
    
    $('#container').pinto({
        itemWidth:300,
        gapX:15,
        gapY:15,
        onItemLayout: function($item, column, position) {
        }
    });
    
    $("#pintoInit").click(function(){
        $('#container').pinto();
    });
    
    $("#pintoDestroy").click(function(){
        $('#container').pinto("destroy");
    });
});