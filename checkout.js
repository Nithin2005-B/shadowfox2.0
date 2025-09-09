const checkoutForm = document.getElementById("checkoutForm");

if (checkoutForm) {
  checkoutForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const address = document.getElementById("address").value.trim();
    const payment = document.getElementById("payment").value;

    if (!name || !address || !payment) {
      alert("Fill all details!");
      return;
    }

    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }

    const newOrder = {
      name,
      address,
      payment,
      items: cart,
      total: cart.reduce((sum, i) => sum + i.price * i.quantity, 0)
    };

    try {
      const res = await fetch("http://localhost:5000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder)
      });
      const data = await res.json();
      alert(data.message);

      // Clear cart after order
      cart = [];
      saveCart();
      updateCartBadge();

      checkoutForm.reset();
      document.getElementById("confirmationMessage").textContent = "✅ Order placed successfully!";
    } catch (err) {
      console.error(err);
      alert("Error placing order. Try again!");
    }
  });
}
