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

  //Add to cart
  if(document.readyState == 'loading'){
    document.addEventListener('DOMContentLoaded', ready)
  }else{
    ready();
  }

  //Remove Item Fromt Cart
  function ready(){
    var removeMenu = document.getElementsByClassName('order-delete')
    console.log(removeMenu)
    for(let i = 0; i < removeMenu.length; i++){
      let button = removeMenu[i]
      button.addEventListener('click', removeMenuItem)
    }
  }

  //Remove Item Fromt Cart
  function removeMenuItem(event){
    let buttonClicked = event.target
    buttonClicked.parentElement.remove()
  }

  //Update Total
  function updateTotal(){
    let orderWrapper = document.getElementsByClassName("order-wrapper")[0]
    let orderCard = cartContent.getElementsByClassName("order-card")
    let total = 0;
    for(let i = 0; i < orderCard.length; i++){
      let orderCard = orderCard[i]
      let priceElement = orderCard.getElementsByClassName('order-price')[0]
      let quantityElement = orderCard.getElementsByClassName('order-quantity')[0]
      let price = parseFloat(priceElement.innerText.replace("$", ""))
      let quantity = quantityElement.value
      total = total + (price * quantity);

      document.getElementsByClassName('')
    }
  }



