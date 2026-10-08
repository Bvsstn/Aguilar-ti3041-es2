(() => {
  const cards = Array.from(document.querySelectorAll("[data-product-card]"));
  const searchInputs = Array.from(document.querySelectorAll("#product-search, #catalog-search"));
  const count = document.querySelector("#results-count");
  const resultLabel = document.querySelector("#results-label");
  const noResults = document.querySelector("#no-results");
  const status = document.querySelector("#search-status");
  const categoryLinks = Array.from(document.querySelectorAll("[data-category-link]"));
  const allLink = document.querySelector(".category-nav__link--active");
  const cartCount = document.querySelector(".cart-button__count");
  const cartButton = document.querySelector(".cart-button");
  const toast = document.querySelector("#cart-toast");
  const imageBase = document.querySelector("#product-grid")?.dataset.imageBase || "";
  let activeCategory = "";
  let cartItems = 0;
  let toastTimeout;

  const normalize = (value) => value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es-CL")
    .trim();

  const productPhoto = (card) => {
    const name = normalize(card.dataset.productName || "");
    const category = normalize(card.dataset.productCategory || "");

    if (category.includes("jardin")) return "jardin.jpg";
    if (category.includes("pinturas")) return "pinturas.jpg";
    if (category.includes("seguridad")) return "electricidad-seguridad.jpg";
    if (category.includes("gasfiteria")) return "electricidad-seguridad.jpg";
    if (category.includes("fijaciones")) return "fijaciones.jpg";
    if (category.includes("electricas")) {
      return /sierra|esmeril|lijadora/.test(name) ? "carpinteria.jpg" : "taladro.jpg";
    }
    return "herramientas-manuales.jpg";
  };

  document.querySelectorAll("[data-product-image]").forEach((image) => {
    const card = image.closest("[data-product-card]");
    if (card) image.src = `${imageBase}${productPhoto(card)}?v=2`;
  });

  const filterProducts = () => {
    const query = normalize(searchInputs[0]?.value || "");
    let visible = 0;

    cards.forEach((card) => {
      const matchesSearch = normalize(card.dataset.search || "").includes(query);
      const matchesCategory = !activeCategory || normalize(card.dataset.search || "").includes(normalize(activeCategory));
      const show = matchesSearch && matchesCategory;
      card.hidden = !show;
      if (show) visible += 1;
    });

    if (count) count.textContent = String(visible);
    if (resultLabel) resultLabel.textContent = visible === 1 ? "producto disponible" : "productos disponibles";
    if (noResults) noResults.hidden = visible !== 0 || cards.length === 0;
    if (status) {
      status.textContent = query || activeCategory
        ? `${visible} ${visible === 1 ? "producto encontrado" : "productos encontrados"}`
        : "";
    }
  };

  searchInputs.forEach((input) => {
    input.addEventListener("input", () => {
      searchInputs.forEach((other) => {
        if (other !== input) other.value = input.value;
      });
      filterProducts();
    });
  });

  document.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      searchInputs[0]?.focus();
    }
  });

  categoryLinks.forEach((link) => {
    link.addEventListener("click", () => {
      activeCategory = link.dataset.categoryLink || "";
      categoryLinks.forEach((other) => other.classList.toggle("category-nav__link--active", other === link));
      allLink?.classList.remove("category-nav__link--active");
      filterProducts();
    });
  });

  allLink?.addEventListener("click", () => {
    activeCategory = "";
    categoryLinks.forEach((link) => link.classList.remove("category-nav__link--active"));
    allLink.classList.add("category-nav__link--active");
    filterProducts();
  });

  document.querySelectorAll("[data-add-to-cart]").forEach((button) => {
    button.addEventListener("click", () => {
      cartItems += 1;
      if (cartCount) cartCount.textContent = String(cartItems);
      cartButton?.setAttribute("aria-label", `Carro de compras, ${cartItems} ${cartItems === 1 ? "producto" : "productos"}`);
      if (toast) {
        toast.textContent = "Producto agregado a tu carro";
        toast.classList.add("toast--visible");
        window.clearTimeout(toastTimeout);
        toastTimeout = window.setTimeout(() => toast.classList.remove("toast--visible"), 2200);
      }
    });
  });
})();
