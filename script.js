document.addEventListener('DOMContentLoaded', () => {
    // --- Fun Fact Button ---
    const funFactButton = document.getElementById('more-info-btn');
    const funFactParagraph = document.getElementById('fun-fact');

    if (funFactButton && funFactParagraph) {
        funFactButton.addEventListener('click', () => {
            const isHidden = funFactParagraph.classList.contains('hidden');
            // Use 'd-none' or a similar class if you have complex transitions,
            // otherwise toggling 'hidden' is fine for basic show/hide.
            funFactParagraph.classList.toggle('hidden');
            // Add a class to trigger potential opacity transition
            if (!funFactParagraph.classList.contains('hidden')) {
                 funFactParagraph.classList.remove('display-none'); // hypothetical class
                 // Force reflow to ensure transition plays
                 void funFactParagraph.offsetWidth;
                 funFactParagraph.style.opacity = '1'; // Or add an 'active' class
                 funFactButton.textContent = 'Hide Fun Fact';
            } else {
                 funFactParagraph.style.opacity = '0';
                 // Optional: Add back display:none after transition
                //  funFactParagraph.addEventListener('transitionend', () => {
                //      funFactParagraph.classList.add('display-none');
                //  }, { once: true });
                 funFactButton.textContent = 'Tell Me a Fun Fact!';
            }
        });
    }

    // --- Smooth Scrolling for Navigation Links ---
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Calculate offset if you have a fixed header
                const headerOffset = document.querySelector('header')?.offsetHeight || 0;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 10; // Extra 10px padding

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Update Footer Year ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- Optional: Contact Form Handling Placeholder ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            // If NOT using Formspree or similar that handles submission directly:
            // e.preventDefault(); // Prevent default page reload
            // console.log('Form submitted!');
            // Add your form submission logic here (e.g., using fetch to send data to your backend)
            // Example: Show a success/thank you message
        });
    }

});
