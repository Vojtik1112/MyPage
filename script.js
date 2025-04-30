document.addEventListener('DOMContentLoaded', () => {

    // --- Initialize AOS (Animate On Scroll) ---
    AOS.init({
        duration: 700, // Animation duration
        easing: 'ease-in-out', // Animation timing function
        once: true, // Whether animation should happen only once - while scrolling down
        mirror: false, // Whether elements should animate out while scrolling past them
        offset: 100 // Offset (in px) from the original trigger point
    });

    // --- Initialize GLightbox (Portfolio Lightbox) ---
    const lightbox = GLightbox({
        selector: '.glightbox', // Selector for links that trigger lightbox
        touchNavigation: true, // Enable swipe navigation on touch devices
        loop: false, // Loop through slides
        autoplayVideos: true,
        // You can add more options here: https://github.com/biati-digital/glightbox
    });


    // --- Fun Fact Button ---
    const funFactButton = document.getElementById('more-info-btn');
    const funFactParagraph = document.getElementById('fun-fact');
    // ... (Fun fact logic remains the same) ...
    if (funFactButton && funFactParagraph) {
        funFactButton.addEventListener('click', () => {
            const isHidden = funFactParagraph.classList.toggle('hidden');
            funFactButton.textContent = isHidden ? 'Tell Me a Fun Fact!' : 'Hide Fun Fact';
        });
    }

    // --- Smooth Scrolling ---
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    // ... (Smooth scroll logic remains the same, ensure header offset calculation is correct for your header height) ...
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = document.querySelector('header')?.offsetHeight || 70; // Estimate header height
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 20; // Extra padding
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });
    });

    // --- Update Footer Year ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- Contact Form Handling (using Fetch API for Formspree) ---
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const submitButton = document.getElementById('submit-button');

    if (contactForm && formMessage && submitButton) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent default form submission

            // Clear previous messages and disable button
            formMessage.textContent = '';
            formMessage.className = ''; // Reset classes
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            const formData = new FormData(contactForm);
            const formAction = contactForm.action; // Get URL from form's action attribute

            try {
                const response = await fetch(formAction, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json' // Important for Formspree to send JSON response
                    }
                });

                if (response.ok) {
                    // Success!
                    formMessage.textContent = "Thank you! Your message has been sent successfully.";
                    formMessage.classList.add('success');
                    contactForm.reset(); // Clear the form fields
                } else {
                    // Handle server errors (e.g., Formspree validation error)
                    const data = await response.json(); // Try to get error details
                    if (data.errors && data.errors.length > 0) {
                       formMessage.textContent = `Error: ${data.errors.map(err => err.message).join(', ')}`;
                    } else {
                       formMessage.textContent = 'Oops! There was a problem submitting your form. Please try again.';
                    }
                    formMessage.classList.add('error');
                }

            } catch (error) {
                // Handle network errors
                console.error('Form submission error:', error);
                formMessage.textContent = 'An error occurred. Please check your connection and try again.';
                formMessage.classList.add('error');

            } finally {
                // Re-enable button regardless of outcome
                submitButton.disabled = false;
                submitButton.textContent = 'Send Message';
            }
        });
    } else {
        console.warn("Contact form elements not found.");
    }

}); // End DOMContentLoaded
