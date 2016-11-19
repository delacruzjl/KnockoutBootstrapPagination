(function($) {
    "use strict";

    console.log("loading template started");
    //$("body")
    //    .load("/templates/ko-templates.html", function() {
    //        console.log("templates loaded completely");
    //    });

    $.get("/templates/ko-templates.html", function (response) {
        console.log("templates loaded");
        $("body").append(response);
    });

})(jQuery);