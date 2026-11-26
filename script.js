const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navLinkItems = document.querySelectorAll(".nav-link");
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");

function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  navLinks.classList.remove("is-open");
}

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation menu" : "Close navigation menu");
  navLinks.classList.toggle("is-open", !isExpanded);
});

navLinkItems.forEach((link) => {
  link.addEventListener("click", () => {
    navLinkItems.forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
    closeMenu();
  });
});

const sections = document.querySelectorAll("main section[id]");
if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinkItems.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: "-35% 0px -55% 0px" });
  sections.forEach((section) => sectionObserver.observe(section));
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const fieldRules = [
  { name: "name", message: "Please enter your name." },
  { name: "email", message: "Please enter a valid email address.", validate: (value) => emailPattern.test(value) },
  { name: "message", message: "Please tell me a little about your project." },
];

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formStatus.textContent = "";
  formStatus.classList.remove("error");

  let firstInvalidField = null;
  fieldRules.forEach(({ name, message, validate }) => {
    const field = contactForm.elements[name];
    const error = document.querySelector(`#${name}-error`);
    const row = field.closest(".form-row");
    const value = field.value.trim();
    const isValid = value.length > 0 && (!validate || validate(value));

    error.textContent = isValid ? "" : message;
    row.classList.toggle("has-error", !isValid);
    field.setAttribute("aria-invalid", String(!isValid));
    if (!isValid && firstInvalidField === null) firstInvalidField = field;
  });

  if (firstInvalidField) {
    formStatus.textContent = "Please check the highlighted fields.";
    formStatus.classList.add("error");
    firstInvalidField.focus();
    return;
  }

  formStatus.textContent = "Thanks for reaching out! Your message is ready, but this demo form needs a connected email service to deliver it.";
  contactForm.reset();
  fieldRules.forEach(({ name }) => {
    contactForm.elements[name].removeAttribute("aria-invalid");
  });
});

document.querySelector("#current-year").textContent = String(new Date().getFullYear());
