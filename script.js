const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const navLinks = document.querySelector("[data-nav-links]");
const contactForm = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");
const contactEmailLink = document.querySelector("[data-contact-email-link]");
const whatsappLink = document.querySelector("[data-whatsapp-link]");

const businessConfig = {
  contactEmail: "shekinahleope24@gmail.com",
  whatsappNumber: "27680771654",
  whatsappDisplay: "+27 68 077 1654",
};

function updateHeaderState() {
  header.classList.toggle("is-scrolled", window.scrollY > 8);
}

function closeMobileMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  navLinks.classList.remove("is-open");
  document.body.classList.remove("nav-open");
}

window.addEventListener("scroll", updateHeaderState);
updateHeaderState();

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  navLinks.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("nav-open", !isOpen);
});

navLinks.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    closeMobileMenu();
  }
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const name = formData.get("name").trim();
  const email = formData.get("email").trim();
  const business = formData.get("business").trim();
  const preferredDate = formData.get("preferredDate");
  const preferredTime = formData.get("preferredTime");
  const contactMethod = formData.get("contactMethod");
  const goal = formData.get("goal").trim();

  const subject = encodeURIComponent(`Free AI Review Appointment Request from ${name}`);
  const body = encodeURIComponent(
    [
      `Name: ${name}`,
      `Email: ${email}`,
      `Business type: ${business}`,
      `Preferred appointment date: ${preferredDate}`,
      `Preferred appointment time: ${preferredTime}`,
      `Best contact method: ${contactMethod}`,
      "",
      "What they want AI to help with:",
      goal,
    ].join("\n")
  );

  formStatus.textContent = "Opening your email app with the appointment request...";
  window.location.href = `mailto:${businessConfig.contactEmail}?subject=${subject}&body=${body}`;
});

if (contactEmailLink) {
  contactEmailLink.href = `mailto:${businessConfig.contactEmail}`;
  contactEmailLink.textContent = `Email ${businessConfig.contactEmail}`;
}

if (whatsappLink) {
  whatsappLink.href = `https://wa.me/${businessConfig.whatsappNumber}`;
  whatsappLink.textContent = `WhatsApp ${businessConfig.whatsappDisplay}`;
}
