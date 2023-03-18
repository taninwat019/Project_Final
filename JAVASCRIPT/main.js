// Scrolltop Button
let calcScrollValue = () =>{
    let scrollProgress = document.getElementById("progress")
    let progressValue = document.getElementById("progress-value")
    let pos = document.documentElement.scrollTop
    let calcHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
    let scrollValue = Math.round((pos * 100) / calcHeight)
   
    if (pos > 100){
        scrollProgress.style.display ="grid"
    }else{
        scrollProgress.style.display = "none"
    }
    scrollProgress.addEventListener("click", ()=>{
        document.documentElement.scrollTop = 0
    })
    scrollProgress.style.background = `conic-gradient(#F0A04B ${scrollValue}%, #d7d7d7 ${scrollValue}%)`
}

window.onscroll = calcScrollValue;
window.onload = calcScrollValue;


// Category
$(document).ready(function () {
    var $list = $(".card-product-box .card").hide(),
      $curr;
  
    $(".button")
      .on("click", function () {
        var $this = $(this);
        $this.addClass("active").siblings().removeClass("active");
        $curr = $list.filter("." + this.id).hide();
        $curr.slice(0, 10).show(400);
        $list.not($curr).hide(300);
      })
      .filter(".active")
      .click();
  
    $("#LoadMore").on("click", function () {
      $curr.filter(":hidden").slice(0, 4).slideDown("slow");
    });
  });



