const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");

const syncHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

const filterButtons = document.querySelectorAll("[data-filter]");
const projectCards = document.querySelectorAll("[data-categories]");

const filterProjects = (filter) => {
  projectCards.forEach((card) => {
    const categories = card.dataset.categories.split(" ");
    card.classList.toggle("is-hidden", !categories.includes(filter));
  });
};

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    filterProjects(button.dataset.filter);
  });
});

filterProjects("comercial");

const galleryCounts = {
  capela: 7,
  "loja-moveis": 8,
  mercadinho: 4,
  otica: 6,
  quiosque: 5,
  "residencial-cozinha-petroleo": 6,
  "residencial-cozinha-terralma": 5,
  "residencial-projeto-oliva": 8,
  "residencial-quarto-eva": 4,
  "residencial-sala-estar-bb": 4,
  "residencial-sala-janta-jr": 5,
  "salao-di-paollo": 4,
  "salao-rosa": 8,
  sniper: 5,
  sorveteria: 6,
  "wc-interlagos": 3,
  "wc-uniao": 3,
};

const galleryModal = document.querySelector("[data-gallery-modal]");
const galleryImage = document.querySelector("[data-gallery-image]");
const galleryTitle = document.querySelector("[data-gallery-title]");
const galleryCount = document.querySelector("[data-gallery-count]");
const galleryPrev = document.querySelector("[data-gallery-prev]");
const galleryNext = document.querySelector("[data-gallery-next]");
let activeGallery = [];
let activeGalleryIndex = 0;

const buildGallery = (card) => {
  const slug = card.dataset.project;
  const count = galleryCounts[slug] || 0;

  if (!slug || count === 0) {
    const img = card.querySelector("img");
    return img ? [img.getAttribute("src")] : [];
  }

  return Array.from(
    { length: count },
    (_, index) => `assets/galleries/${slug}/${String(index + 1).padStart(2, "0")}.jpg`
  );
};

const renderGallery = () => {
  const src = activeGallery[activeGalleryIndex];
  galleryImage.src = src;
  galleryImage.alt = galleryTitle.textContent;
  galleryCount.textContent = `${activeGalleryIndex + 1} / ${activeGallery.length}`;
  galleryPrev.disabled = activeGallery.length <= 1;
  galleryNext.disabled = activeGallery.length <= 1;
};

// Permite abrir a imagem atual em nova aba ao clicar sobre ela
galleryImage.addEventListener("click", () => {
  if (!galleryImage.src) return;
  window.open(galleryImage.src, "_blank", "noopener");
});

// Força abertura do cliente de email padrão ao clicar em links mailto
document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = link.getAttribute('href');
  });
});

const openGallery = (card) => {
  activeGallery = buildGallery(card);
  if (!activeGallery.length) return;

  activeGalleryIndex = 0;
  galleryTitle.textContent = card.dataset.title || card.querySelector("h3")?.textContent || "Projeto";
  galleryModal.classList.add("is-open");
  galleryModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  renderGallery();
};

const closeGallery = () => {
  galleryModal.classList.remove("is-open");
  galleryModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  galleryImage.removeAttribute("src");
};

const moveGallery = (direction) => {
  activeGalleryIndex = (activeGalleryIndex + direction + activeGallery.length) % activeGallery.length;
  renderGallery();
};

document.querySelectorAll(".commercial-card").forEach((card) => {
  card.addEventListener("click", () => openGallery(card));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openGallery(card);
    }
  });
});

document.querySelectorAll("[data-gallery-close]").forEach((button) => {
  button.addEventListener("click", closeGallery);
});

galleryPrev.addEventListener("click", () => moveGallery(-1));
galleryNext.addEventListener("click", () => moveGallery(1));

document.addEventListener("keydown", (event) => {
  if (!galleryModal.classList.contains("is-open")) return;
  if (event.key === "Escape") closeGallery();
  if (event.key === "ArrowLeft") moveGallery(-1);
  if (event.key === "ArrowRight") moveGallery(1);
});

document.querySelector(".contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const button = event.currentTarget.querySelector("button");
  button.textContent = "Mensagem pronta para envio";
  setTimeout(() => {
    button.textContent = "Enviar mensagem";
  }, 2600);
});
