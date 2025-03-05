document.addEventListener("DOMContentLoaded", function () {
    // Step 1: Get DOM elements
    let nextDom = document.getElementById('next');
    let prevDom = document.getElementById('prev');

    let carouselDom = document.querySelector('.carousel'); 
    if (carouselDom) {
        let sliderDom = carouselDom.querySelector('.list');
        let thumbnailBorderDom = carouselDom.querySelector('.thumbnail');
        let thumbnailItemsDom = thumbnailBorderDom.querySelectorAll('.item');
        let timeDom = carouselDom.querySelector('.time');

        if (thumbnailItemsDom.length > 0) {
            thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);
        }

        let timeRunning = 3000;
        let timeAutoNext = 7000;

        nextDom.onclick = function () {
            showSlider('next');    
        };

        prevDom.onclick = function () {
            showSlider('prev');    
        };

        let runTimeOut;
        let runNextAuto = setTimeout(() => {
            nextDom.click();
        }, timeAutoNext);

        function showSlider(type) {
            let sliderItemsDom = sliderDom.querySelectorAll('.item');
            let thumbnailItemsDom = thumbnailBorderDom.querySelectorAll('.item');

            if (type === 'next') {
                sliderDom.appendChild(sliderItemsDom[0]);
                thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);
                carouselDom.classList.add('next');
            } else {
                sliderDom.prepend(sliderItemsDom[sliderItemsDom.length - 1]);
                thumbnailBorderDom.prepend(thumbnailItemsDom[thumbnailItemsDom.length - 1]);
                carouselDom.classList.add('prev');
            }

            clearTimeout(runTimeOut);
            runTimeOut = setTimeout(() => {
                carouselDom.classList.remove('next');
                carouselDom.classList.remove('prev');
            }, timeRunning);

            clearTimeout(runNextAuto);
            runNextAuto = setTimeout(() => {
                nextDom.click();
            }, timeAutoNext);
        }
    } else {
        console.error("Element with class 'carousel' not found.");
    }

    // ========== Wishlist & Cart Functionality ==========
    updateCartCount();
    updateWishlistCount();
    showCartItems();
    showWishlistItems();

    // ** Function to Add Item to Cart **
    window.addCart = function (event) {
        event.preventDefault();
        let card = event.target.closest(".card");
        let imgSrc = card.querySelector("img").getAttribute("src");
        let priceText = card.querySelector(".card-title").innerText.replace("₹", "").trim();
        let price = parseFloat(priceText) || 0; // Ensure valid price

        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.push({ imgSrc, price });
        localStorage.setItem("cart", JSON.stringify(cart));

        updateCartCount();
        alertBox("Added to Cart! View Cart or Continue Shopping?", "addtocart.html");
    };

    // ** Function to Add Item to Wishlist **
    window.wishlist = function (event) {
        event.preventDefault();
        let card = event.target.closest(".card");
        let imgSrc = card.querySelector("img").getAttribute("src");
        let priceText = card.querySelector(".card-title").innerText.replace("₹", "").trim();
        let price = parseFloat(priceText) || 0; // Ensure valid price

        let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        wishlist.push({ imgSrc, price });
        localStorage.setItem("wishlist", JSON.stringify(wishlist));

        updateWishlistCount();
        alertBox("Added to Wishlist! View Wishlist or Continue Shopping?", "wishlist.html");
    };

    // ** Update Cart Item Count **
    function updateCartCount() {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let cartCountEl = document.getElementById("cartCount");
        if (cartCountEl) {
            cartCountEl.innerText = cart.length;
        }
    }

    // ** Update Wishlist Item Count **
    function updateWishlistCount() {
        let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        let wishlistCountEl = document.getElementById("wishlistCount");
        if (wishlistCountEl) {
            wishlistCountEl.innerText = wishlist.length;
        }
    }

    // ** Display Cart Items **
    function showCartItems() {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let cartContainer = document.getElementById("cartItems");
        if (!cartContainer) return;
        cartContainer.innerHTML = "";

        cart.forEach((item, index) => {
            cartContainer.innerHTML += `
                <div class="cart-item">
                    <img src="${item.imgSrc}" width="50">
                    <p>₹${item.price.toFixed(2)}</p>
                    <button onclick="removeFromCart(${index})">Remove</button>
                </div>`;
        });

        updateTotal();
    }

    // ** Display Wishlist Items **
    function showWishlistItems() {
        let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        let wishlistContainer = document.getElementById("wishlistItems");
        if (!wishlistContainer) return;
        wishlistContainer.innerHTML = "";

        wishlist.forEach((item, index) => {
            wishlistContainer.innerHTML += `
                <div class="wishlist-item">
                    <img src="${item.imgSrc}" width="150">
                    <p>₹${item.price.toFixed(2)}</p>
                    <button onclick="moveToCart(${index})">Move to Cart</button>
                    <button class="remove-btn" onclick="removeFromWishlist(${index})">Remove</button>
                </div>`;
        });
    }

    // ** Remove Item from Cart **
    window.removeFromCart = function (index) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        showCartItems();
        updateCartCount();
    };

    // ** Remove Item from Wishlist **
    window.removeFromWishlist = function (index) {
        let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        wishlist.splice(index, 1);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        showWishlistItems();
        updateWishlistCount();
    };

    // ** Move Item from Wishlist to Cart **
    window.moveToCart = function (index) {
        let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        let item = wishlist[index];
        cart.push(item);
        wishlist.splice(index, 1);

        localStorage.setItem("cart", JSON.stringify(cart));
        localStorage.setItem("wishlist", JSON.stringify(wishlist));

        showWishlistItems();
        showCartItems();
        updateCartCount();
        updateWishlistCount();
        alert("Item moved to Cart!");
    };

    // ** Custom Alert Box Instead of Default Alert **
    function alertBox(message, redirectUrl) {
        let box = document.createElement("div");
        box.innerHTML = `
            <div style="position:fixed; top:50%; left:50%; transform:translate(-50%, -50%);
                        background:#05391d; padding:20px; box-shadow:0px 0px 10px rgba(255, 255, 255, 0.98);
                        text-align:center; z-index:1000; font-size:1.5rem; border-radius: 10px; color: white;">
                <p>${message}</p>
                <button onclick="window.location.href='${redirectUrl}'" 
                    style="background:white; color:black; font-size:1.5rem; padding:10px 20px; border:none; cursor:pointer; margin:5px; border-radius: 5px;">
                    View
                </button>
                <button onclick="this.parentElement.remove()" 
                    style="background:white; color:black; font-size:1.5rem; padding:10px 20px; border:none; cursor:pointer; margin:5px; border-radius: 5px;">
                    Continue Shopping
                </button>
            </div>`;
        document.body.appendChild(box);
    }

    function updateTotal() {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
        let totalPriceEl = document.getElementById("totalPrice");
        if (totalPriceEl) totalPriceEl.innerText = `₹${totalPrice.toFixed(2)}`;
    }
});
