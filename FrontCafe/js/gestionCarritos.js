document.querySelectorAll('.quantity-btn').forEach(button => {
    button.addEventListener('click', function() {
        const input = button.parentElement.querySelector('.quantity');
        const currentValue = parseInt(input.value);

        if (button.classList.contains('minus-btn')) {
            input.value = currentValue > 1 ? currentValue - 1 : 1;
        } else if (button.classList.contains('plus-btn')) {
            input.value = currentValue + 1;
        }
    });
}); 

let cart = [];

document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', function() {
        console.log("CLICKEAMOS AGREGANDO AL CARRITO")
        const productCard = button.closest('.card-product');
        const productName = productCard.querySelector('h3').innerText;
        const productQuantity = parseInt(productCard.querySelector('.quantity').value);
        const productPrice = parseFloat(productCard.querySelector('.price').innerText.replace('$', ''));
        const productTotal = productQuantity * productPrice;

        const product = {
            name: productName,
            quantity: productQuantity,
            price: productPrice,
            total: productTotal
        };

  
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        productCard.querySelector('.quantity').value = 1;
        alert( productQuantity + " "+ productName + ' agregado al carrito');
        console.log(cart);
    });
});



