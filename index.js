window.onload = function(){
    $(".navElement:has(a)").on('click', function(e){
        $(".navElement").removeClass("active");
        $(this).addClass("active");
    });
}
