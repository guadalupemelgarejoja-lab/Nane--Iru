let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// =========================
// GUARDAR EN STORAGE
// =========================
function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// =========================
// ACTUALIZAR MODAL + CONTADOR
// =========================
function actualizarCarrito() {
  const tbody = document.getElementById("cart-items");
  const totalText = document.getElementById("cart-total");
  const cartCount = document.getElementById("cart-count");

  if (!tbody || !totalText) return;

  tbody.innerHTML = "";
  let total = 0;
  let cantidadTotal = 0;

  carrito.forEach((item, index) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    cantidadTotal += item.cantidad;

    const fila = `
      <tr>
        <td>${item.nombre}</td>

        <td>
          <button class="btn btn-sm btn-outline-secondary" onclick="cambiarCantidad(${index}, -1)">−</button>
          <span class="mx-2">${item.cantidad}</span>
          <button class="btn btn-sm btn-outline-secondary" onclick="cambiarCantidad(${index}, 1)">+</button>
        </td>

        <td>Gs. ${item.precio.toLocaleString()}</td>
        <td>Gs. ${subtotal.toLocaleString()}</td>

        <td>
          <button class="btn btn-danger btn-sm" onclick="eliminarItem(${index})">X</button>
        </td>
      </tr>
    `;
    tbody.innerHTML += fila;
  });

  totalText.textContent = total.toLocaleString();
  if (cartCount) cartCount.textContent = cantidadTotal;

  guardarCarrito();
}

// =========================
// SUMAR / RESTAR
// =========================
function cambiarCantidad(index, delta) {
  carrito[index].cantidad += delta;
  if (carrito[index].cantidad <= 0) carrito.splice(index, 1);
  actualizarCarrito();
}

// =========================
// ELIMINAR ITEM
// =========================
function eliminarItem(index) {
  carrito.splice(index, 1);
  actualizarCarrito();
}

// =========================
// INICIO
// =========================
document.addEventListener("DOMContentLoaded", () => {
  actualizarCarrito();

  // BOTONES "AÑADIR"
  document.querySelectorAll(".product-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const nombre = btn.dataset.product;
      const precio = parseInt(btn.dataset.price);

      if (!nombre || isNaN(precio)) {
        alert("⚠ Error: faltan datos del producto (data-product o data-price)");
        return;
      }

      const existe = carrito.find(p => p.nombre === nombre);
      if (existe) existe.cantidad++;
      else carrito.push({ nombre, precio, cantidad: 1 });

      actualizarCarrito();
    });
  });

  // ABRIR MODAL CON ÍCONO
  const openCartBtn = document.getElementById("open-cart");
  const cartModalEl = document.getElementById("cartModal");

  if (openCartBtn && cartModalEl) {
    const cartModal = new bootstrap.Modal(cartModalEl);
    openCartBtn.addEventListener("click", (e) => {
      e.preventDefault();
      actualizarCarrito();
      cartModal.show();
    });
  }

  // VACIAR CARRITO
  const vaciarBtn = document.getElementById("vaciar-carrito");
  if (vaciarBtn) {
    vaciarBtn.addEventListener("click", () => {
      carrito = [];
      actualizarCarrito();
    });
  }

  // FINALIZAR COMPRA → WHATSAPP
  // IMPORTANTE: poné id="finalizar-compra" a tu botón
  const finalizarBtn = document.getElementById("finalizar-compra");
  if (finalizarBtn) {
    finalizarBtn.addEventListener("click", () => {
      if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
        return;
      }

      let mensaje = "🛒 *Buenas tares quiero solicitar estos productos:*%0A%0A";
      carrito.forEach(item => {
        mensaje += `• ${item.nombre} x${item.cantidad} - Gs. ${(item.precio * item.cantidad).toLocaleString()}%0A`;
      });

      let total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
      mensaje += `%0A*Total:* Gs. ${total.toLocaleString()}%0A%0A`;

      const numero = "+595991601915"; // <-- CAMBIÁ a tu WhatsApp real
      window.open(`https://wa.me/${numero}?text=${mensaje}`, "_blank");
    });
  }
});
