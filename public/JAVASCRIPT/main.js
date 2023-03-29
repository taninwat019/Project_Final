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

  //Function
  function ready(){
    var removeMenu = document.getElementsByClassName('order-delete')
    console.log(removeMenu)
    //Remove Item
    for(let i = 0; i < removeMenu.length; i++){
      let button = removeMenu[i]
      button.addEventListener('click', removeMenuItem)
    }

    //Quantity of Item
    var quantityInput = document.getElementsByClassName('order-quantity')
      for(let i = 0; i < quantityInput.length; i++){
        let input = quantityInput[i];
        input.addEventListener("change", quantityChanged);
     }

     //Add to cart
     let addCart = document.getElementsByClassName('add-cart')
      for(let i = 0; i < addCart.length; i++){
        let button = addCart[i]
        button.addEventListener('click', addCartClicked)
      }
  }

  //Remove Item Fromt Cart
  function removeMenuItem(event){
    let buttonClicked = event.target
    buttonClicked.parentElement.remove()
    updateTotal();
  }

  //Quantity Change
  function quantityChanged(event){
    let input = event.target
    if(isNaN(input.value) || input.value <= 0){
      input.value = 1
    }
    updateTotal();
  }

  // Add to Cart
  function addCartClicked(event){
    var button = event.target;
    var shopProducts = button.parentElement;
    var name = shopProducts.getElementsByClassName("product-name")[0].innerText;
    var price = shopProducts.getElementsByClassName("product-price")[0].innerText;
    var productImage = shopProducts.getElementsByClassName("product-image")[0].src;
    addProductToCart(name,price,productImage);
    updateTotal();
  }

  function addProductToCart(name, price, productImage){
    var cartShopBox = document.createElement("div");
    cartShopBox.classList.add('order-card');
    var cartItems = document.getElementsByClassName('order-wrapper')[0];
    var cartItemsName = cartItems.getElementsByClassName('order-title');
      for(let i = 0; i < cartItemsName.length; i++){
        if(cartItemsName[i].innerText == name){
          alert('You have already add this item to your cart')
          return;
        }
      } 
      
  var cartBoxContent = `
                        <img class="order-image" src=" ${productImage} ">
                        <div class="order-detail">
                          <div class="order-title">${name}</div>
                          <div class="order-price">${price}</div> 
                          <input type="number" value="1" class="order-quantity">
                        </div>
                          <i class="fa-solid fa-xmark order-delete"></i>`;

  cartShopBox.innerHTML = cartBoxContent;
  cartItems.append(cartShopBox)
  cartShopBox
  .getElementsByClassName("order-delete")[0]
  .addEventListener("click", removeMenuItem)
  cartShopBox
  .getElementsByClassName("order-quantity")[0]
  .addEventListener("change", quantityChanged)
    }

  //Update Total
  function updateTotal(){
    let orderWrapper = document.getElementsByClassName("order-wrapper")[0]
    let orderCard = orderWrapper.getElementsByClassName("order-card")
    let total = 0;
      for(let i = 0; i < orderCard.length; i++){
        let orderCard2 = orderCard[i]
        let priceElement = orderCard2.getElementsByClassName('order-price')[0]
        let quantityElement = orderCard2.getElementsByClassName('order-quantity')[0]
        let price = parseFloat(priceElement.innerText.replace("$", ""));
        let quantity = quantityElement.value
        total = total + (price * quantity);

        document.getElementsByClassName('order-total-price')[0].innerText = '$' + total;
     }
  }



