# MyPage - Vojtěch Novák's Personal Portfolio

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Status: Active](https://img.shields.io/badge/Status-Active-success.svg)](https://github.com/Vojtik1112/MyPage/)
[![Built With: HTML/CSS/JS](https://img.shields.io/badge/Built%20With-HTML%2FCSS%2FJS-orange.svg)](#-technologies)

Welcome to the repository for **MyPage**, my personal portfolio website! This project showcases my journey as an IT
student, highlighting my skills, projects, education, and passion for technology.

**🚀 Live Demo: [vojtik1112.github.io/MyPage/](https://vojtik1112.github.io/MyPage/)
** <!-- Replace if you deploy elsewhere -->

---

## ✨ Core Features

* **📄 Structured Content:** Sections for Home, About, Projects, Skills, and Education.
* 🎨 **Elegant Design:** Clean, modern UI with a focus on readability.
* 📱 **Responsive Layout:** Adapts seamlessly to various screen sizes (desktop, tablet, mobile).
* 🎨 **Dual Theme:** Smooth light/dark mode toggle with `localStorage` persistence.
* 💎 **Interactive Tesseract:** Engaging 4D Tesseract animation on the homepage using Three.js.
* 🖱️ **Dynamic Interactions:** Smooth navigation, slide-out contact panel, project detail modals.
* ✨ **Subtle Animations:** Fade-in animations on scroll for section content using Intersection Observer.
* 🎵 **Background Audio:** Optional background music player with user controls.
* 📁 **Project Showcase:** Clickable cards opening modals with project details, tech stack, challenges, and links (Live
  Demo/Repo).
* 🛠️ **Detailed Skills:** Categorized skills presented clearly using tags/pills.
* 🎓 **Education & Experience:** Outlines academic background and relevant experience.
* 📜 **Resume Access:** Direct download link for my PDF resume.
* 📬 **Contact Integration:** Slide-out panel with contact links and a Formspree-ready contact form.

---

## 📸 Screenshots

<!-- Add 1-3 screenshots showcasing the site (e.g., Home Light, Home Dark, Projects) -->
<!-- Replace the placeholder links below -->
<!-- Example: -->
<!-- ![MyPage Screenshot Light](assets/screenshots/mypage_light.png) -->
<!-- ![MyPage Screenshot Dark](assets/screenshots/mypage_dark.png) -->

*Add screenshots here to give viewers a quick visual overview!*

---

## 🛠️ Getting Started

To run a local copy of this website:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Vojtik1112/MyPage.git
   ```
2. **Navigate to the directory:**
   ```bash
   cd MyPage
   ```
3. **Open `index.html`:** Simply open the `index.html` file in your preferred web browser.

---

## ⚙️ Configuration

### Contact Form (Formspree)

The contact form in the "Get in Touch" panel relies on [Formspree](https://formspree.io/) for email submission without
needing a custom backend.

1. **Create a Formspree Account:** Sign up for a free account at [formspree.io](https://formspree.io/).
2. **Create a New Form:** Follow their instructions to create a new form endpoint.
3. **Update `index.html`:**

* Open the `index.html` file.
* Find the `<form>` element with the `id="contact-form"`.
* Replace the `action` attribute's placeholder URL (`https://formspree.io/f/YOUR_FORMSPREE_ID`) with **your unique
  Formspree form endpoint URL**.

    ```html
     <form id="contact-form" action="https://formspree.io/f/YOUR_ACTUAL_ID" method="POST">
         <!-- ... form inputs ... -->
     </form>
    ```

* **Alternative:** If you prefer a different backend or service, update the `action` attribute and potentially the form
  structure/JavaScript accordingly.

---

## 📁 Project Structure

MyPage/
├── assets/
│ ├── favicon.png # Favicon image
│ ├── resume.pdf # Your resume file
│ ├── song.mp3 # Background audio file
│ ├── projects/
│ │ ├── projects.json # Data for project modals
│ │ └── *.png # Screenshots for project modals
│ └── screenshots/ # Optional: For README screenshots
├── projects/ # Optional: Demos for project live links
│ ├── project1/
│ │ └── index.html # Example project demo
│ └── ...
├── index.html # Main page structure
├── style.css # All styles for the website
├── script.js # Main JS (Navigation, Theme, Modals, etc.)
├── tesseract.js # JS for the Three.js animation
├── README.md # This file
└── LICENSE # MIT License file (Optional but good practice)

---

## 💻 Technologies Used

* **Frontend:**
* ![HTML5](https://img.shields.io/badge/-HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
* ![CSS3](https://img.shields.io/badge/-CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
* ![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
* **Libraries:**
* **Three.js:** For the 3D Tesseract animation.
* **Services:**
* **Formspree:** For the contact form backend (optional).
* **GitHub Pages:** For hosting the live demo (optional).

---

## 💡 Purpose & Motivation

This project serves as my personal digital space to:

* Showcase my skills and projects to potential employers or collaborators.
* Practice and improve my web development abilities (HTML, CSS, JS, Design).
* Maintain an up-to-date online presence reflecting my academic and technical journey.

---

## 🤝 Contributing

As this is my personal portfolio, direct contributions are generally not expected. However, if you spot any bugs, have
suggestions for improvement, or want to discuss the code:

1. Please **open an issue** on GitHub.
2. Feel free to **fork the repository** and experiment.

---

## 📫 Contact

* **Website:** Use the "Get in Touch" panel on the live site (requires Formspree setup).
* **GitHub:** Visit my profile [Vojtik1112](https://github.com/Vojtik1112).

---

## 📜 License

This project is licensed under the **MIT License**. You are free to use, modify, and distribute the code as long as you
adhere to the license terms. See the [LICENSE](LICENSE) file for full details (if included) or
visit [opensource.org/licenses/MIT](https://opensource.org/licenses/MIT).