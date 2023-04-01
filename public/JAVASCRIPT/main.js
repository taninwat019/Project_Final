// Scrolltop Button
let calcScrollValue = () => {
  let scrollProgress = document.getElementById("progress")
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
// Scrolltop Button


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
// Category

// Select Menu
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

// Add to Cart
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

//Buy Botton
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

// Update Quantity
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

// Update Cart
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

// Total Price
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


// Delete
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







async function submitOrder() {
  try {
    const response = await fetch('/submit-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cartItems: collectCartItems(),
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text);
    }

    console.log('Order submitted successfully');
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('cartItems');
    }

    // Delete cart items after submitting the order
    await deleteCartItems();

    window.location.href = '/address';
  } catch (error) {
    console.error('Error submitting order:', error);
  }
}


async function deleteCartItems() {
  const cartItems = collectCartItems();

  for (const item of cartItems) {
    try {
      const response = await fetch(`/delete-item/${item._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
      }

      console.log(`Item with ID ${item._id} deleted successfully`);
    } catch (error) {
      console.error(`Error deleting item with ID ${item._id}:`, error);
    }
  }
}




function collectCartItems() {
  const cartItems = document.querySelectorAll('.cart-item');
  const items = [];

  cartItems.forEach((item) => {
    const id = item.querySelector('.order-quantity').dataset.id;
    const name = item.querySelector('.order-title').textContent;
    const price = parseFloat(item.querySelector('.order-price').textContent);
    const quantity = parseInt(item.querySelector('.order-quantity').value);
    const image = item.querySelector('.order-image').src;

    items.push({ _id: id, name, price, quantity, image });
  });

  return items;
}


async function fetchOrders() {
  try {
    const response = await fetch('/orders');
    const data = await response.json();
    const orders = data.orders;

    // Update the table in the admin page with the fetched orders
    const tbody = document.querySelector('#orders-tbody');
    tbody.innerHTML = '';

    orders.forEach((order) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <tbody id="orders-tbody">
        <td>
          <img src="${order.userImage}" alt="User Image">
          <p>${order.userName}</p>
        </td>
        <td>${order.orderDate}</td>
        <td><span class="status ${order.status.toLowerCase()}">${order.status}</span></td>
        <td>
          <button type="button" class="btn" data-bs-toggle="modal" data-bs-target="#statusModal-1" data-order-id="order-1" style="background: #F0A04B; width:50px;">
            <i class="fa-solid fa-bars"></i>
          </button>
        </td>
        </tbody>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.log('Error fetching orders:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  fetchOrders();
});


document.addEventListener('DOMContentLoaded', () => {
  fetchOrders();
});


document.querySelector('.checkout-button').addEventListener('click', () => {
  submitOrder();
});
