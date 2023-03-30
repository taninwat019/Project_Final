// Scrolltop Button
let calcScrollValue = () => {
  let scrollProgress = document.getElementById("progress")
  let progressValue = document.getElementById("progress-value")
  let pos = document.documentElement.scrollTop
  let calcHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
  let scrollValue = Math.round((pos * 100) / calcHeight)

  if (pos > 100) {
    scrollProgress.style.display = "grid"
  } else {
    scrollProgress.style.display = "none"
  }
  scrollProgress.addEventListener("click", () => {
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

document.querySelectorAll(".add-cart").forEach(function (image) {
  image.addEventListener("click", function () {
    const imageId = this.dataset.id;
    console.log("image ID", imageId);
    console.log("this", this);
    console.log("this .dataset" + this.dataset);

    // Send the image ID to the server using a POST request
    fetch("/image-clicked", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: imageId }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Image ID sent successfully:", data);
      })
      .catch((error) => {
        console.error("Error sending image ID:", error);
      });
  });
});

// //Add to cart
// if(document.readyState == 'loading'){
//   document.addEventListener('DOMContentLoaded', ready)
// }else{
//   ready();
// }

// //Function
// function ready(){
//   var removeMenu = document.getElementsByClassName('order-delete')
//   console.log(removeMenu)
//   //Remove Item
//   for(let i = 0; i < removeMenu.length; i++){
//     let button = removeMenu[i]
//     button.addEventListener('click', removeMenuItem)
//   }

//   //Quantity of Item
//   var quantityInput = document.getElementsByClassName('order-quantity')
//     for(let i = 0; i < quantityInput.length; i++){
//       let input = quantityInput[i];
//       input.addEventListener("change", quantityChanged);
//    }

//    //Add to cart
//    let addCart = document.getElementsByClassName('add-cart')
//     for(let i = 0; i < addCart.length; i++){
//       let button = addCart[i]
//       button.addEventListener('click', addCartClicked)
//     }
// }

// //Remove Item Fromt Cart
// function removeMenuItem(event){
//   let buttonClicked = event.target
//   buttonClicked.parentElement.remove()
//   updateTotal();
// }

// //Quantity Change
// function quantityChanged(event){
//   let input = event.target
//   if(isNaN(input.value) || input.value <= 0){
//     input.value = 1
//   }
//   updateTotal();
// }

// // Add to Cart
// function addCartClicked(event){
//   var button = event.target;
//   var shopProducts = button.parentElement;
//   var name = shopProducts.getElementsByClassName("product-name")[0].innerText;
//   var price = shopProducts.getElementsByClassName("product-price")[0].innerText;
//   var productImage = shopProducts.getElementsByClassName("product-image")[0].src;
//   addProductToCart(name,price,productImage);
//   updateTotal();
// }

// function addProductToCart(name, price, productImage){
//   var cartShopBox = document.createElement("div");
//   cartShopBox.classList.add('order-card');
//   var cartItems = document.getElementsByClassName('order-wrapper')[0];
//   var cartItemsName = cartItems.getElementsByClassName('order-title');
//     for(let i = 0; i < cartItemsName.length; i++){
//       if(cartItemsName[i].innerText == name){
//         alert('You have already add this item to your cart')
//         return;
//       }
//     } 

// var cartBoxContent = `
//                       <img class="order-image" src=" ${productImage} ">
//                       <div class="order-detail">
//                         <div class="order-title">${name}</div>
//                         <div class="order-price">${price}</div> 
//                         <input type="number" min="1" value="1" class="order-quantity">
//                       </div>
//                         <i class="fa-solid fa-xmark order-delete"></i>`;

// cartShopBox.innerHTML = cartBoxContent;
// cartItems.append(cartShopBox)
// cartShopBox
// .getElementsByClassName("order-delete")[0]
// .addEventListener("click", removeMenuItem)
// cartShopBox
// .getElementsByClassName("order-quantity")[0]
// .addEventListener("change", quantityChanged)
// }

// //Update Total
// function updateTotal(){
//   let orderWrapper = document.getElementsByClassName("order-wrapper")[0]
//   let orderCard = orderWrapper.getElementsByClassName("order-card")
//   let total = 0;
//   if(orderCard.length == 0){
//     document.getElementsByClassName('order-total-price')[0].innerText = '$' + 0;
//   }else{
//     for(let i = 0; i < orderCard.length; i++){
//       let orderCard2 = orderCard[i]
//       let priceElement = orderCard2.getElementsByClassName('order-price')[0]
//       let quantityElement = orderCard2.getElementsByClassName('order-quantity')[0]
//       let price = parseFloat(priceElement.innerText.replace("$", ""));
//       let quantity = quantityElement.value
//       total = total + (price * quantity);

//       document.getElementsByClassName('order-total-price')[0].innerText = '$' + total;
//    }
//   }
// }

// ChatGPT
async function addToCart(itemName, itemPrice, itemImage,quantity = 1) {
  try {
    const response = await fetch('/add-to-cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dataName: itemName,
        dataPrice: itemPrice,
        dataImage: itemImage,
        dataQuantity: quantity,
      }),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text);
    }
    const data = await response.json();
    console.log('Success:', data);
    itemImage = data.menuImage;
  } catch (error) {
    console.error('Error:', error);
    if (error.message === "Menu not found") {
      alert("Sorry, that menu item could not be found. Please try again.");
    }
  }

}




document.querySelectorAll('.add-cart').forEach((btn) => {
  btn.addEventListener('click', (event) => {
    const item = event.target.closest('.card');
    const itemName = item.querySelector('.product-name').textContent;
    const itemPrice = item.querySelector('.product-price').textContent.trim().slice(1); // Remove the $ sign
    const itemImage = item.querySelector('.product-image').src;
    addToCart(itemName, itemPrice, itemImage);
  });
});

document.querySelector('.button-cart').addEventListener('click', () => {
  updateCartModal();
});

async function updateQuantity(itemId, newQuantity) {
  try {
    console.log('Updating quantity:', { itemId, newQuantity }); // Add this line
    const response = await fetch('/update-quantity', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: itemId,
        quantity: newQuantity,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text);
    }

    const data = await response.json();
    console.log('Quantity updated successfully:', data.item);
    // Update the local cart data with the updated item data if needed
    // ...

  } catch (error) {
    console.error('Error updating quantity:', error);
  }
}




async function updateCartModal() {
  try {
    const response = await fetch('/cart-items');
    const data = await response.json();
    const cartItems = data.cartItems;
    console.log('Cart items:', cartItems); // Add this line
    let cartModalBody = document.querySelector('.modal-body');
    if (cartModalBody) {
      cartModalBody.innerHTML = '';
      if (cartItems.length > 0) {
        let total = 0;
        for (let i = 0; i < cartItems.length; i++) {
          let item = cartItems[i];
          let cartItem = document.createElement('div');
          cartItem.classList.add('cart-item');
          cartItem.innerHTML = `
          <img class="order-image" src=" ${item.image} ">
          <div class="order-detail">
          <div class="order-title">${item.name}</div>
          <div class="order-price">${item.price}</div>
          <input type="number" min="0" value="${item.quantity}" class="order-quantity" data-id="${item._id}">
          <button class="delete-item" data-id="${item._id}">Delete</button>
          </div>
                
          `;

          cartModalBody.appendChild(cartItem);
          total += item.price * item.quantity;

          cartItem.querySelector('.order-quantity').addEventListener('change', (event) => {
            updateTotalPrice();

            const itemId = event.target.dataset.id;
            

            const newQuantity = parseInt(event.target.value);
            updateQuantity(itemId, newQuantity);

          });
        }
        // Update the total in the cart modal
        document.querySelector('.order-total-price').innerHTML = `$${total.toFixed(2)}`;
          // Add event listeners to delete buttons
          document.querySelectorAll('.delete-item').forEach((btn) => {
            btn.addEventListener('click', async (event) => {
              const itemId = event.target.dataset.id;
              await deleteCartItem(itemId);
              event.target.closest('.cart-item').remove();
              updateTotalPrice();
            });
          });
      

      } else {
        let emptyCart = document.createElement('p');
        emptyCart.innerHTML = 'Your cart is empty';
        cartModalBody.appendChild(emptyCart);
          // Set the total to 0 when the cart is empty
        document.querySelector('.order-total-price').innerHTML = `$0.00`;
      }
    }
  } catch (error) {
    console.log('Error fetching cart items:', error);
  }
}

function updateTotalPrice() {
  const cartItems = document.querySelectorAll('.cart-item');
  let total = 0;

  cartItems.forEach((item) => {
    const price = parseFloat(item.querySelector('.order-price').textContent);
    const quantity = parseInt(item.querySelector('.order-quantity').value);
    total += price * quantity;
  });

  document.querySelector('.order-total-price').innerHTML = `$${total.toFixed(2)}`;
}






async function deleteCartItem(itemId) {
  try {
    const response = await fetch(`/delete-item/${itemId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text);
    }

    console.log('Item deleted successfully');
  } catch (error) {
    console.error('Error deleting item:', error);
  }
}