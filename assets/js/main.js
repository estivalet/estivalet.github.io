
      // Mobile menu toggle
      const menuToggle = document.querySelector(".menu-toggle");
      const navLinks = document.querySelector(".nav-links");

      menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        const icon = menuToggle.querySelector("i");
        icon.classList.toggle("fa-bars");
        icon.classList.toggle("fa-times");
      });

      // Close mobile menu when clicking on a link
      document.querySelectorAll(".nav-links a").forEach((link) => {
        link.addEventListener("click", () => {
          navLinks.classList.remove("active");
          const icon = menuToggle.querySelector("i");
          icon.classList.remove("fa-times");
          icon.classList.add("fa-bars");
        });
      });

      // Active navigation highlighting
      window.addEventListener("scroll", () => {
        const sections = document.querySelectorAll("section[id]");
        const navLinks = document.querySelectorAll(".nav-links a");

        let current = "";
        sections.forEach((section) => {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.clientHeight;
          if (scrollY >= sectionTop - 200) {
            current = section.getAttribute("id");
          }
        });

        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === "#" + current) {
            link.classList.add("active");
          }
        });
      });

      // Smooth scrolling for navigation links
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute("href"));
          if (target) {
            target.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        });
      });

      // Fade in animation on scroll
      const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      }, observerOptions);

      // Observe all fade-in elements
      document.querySelectorAll(".fade-in").forEach((el) => {
        observer.observe(el);
      });

      // Navbar background change on scroll
      window.addEventListener("scroll", () => {
        const navbar = document.querySelector(".navbar");
        if (window.scrollY > 100) {
          navbar.style.background = "rgba(10, 10, 10, 0.98)";
        } else {
          navbar.style.background = "rgba(10, 10, 10, 0.95)";
        }
      });

      // Contact form handling
      const contactForm = document.querySelector(".contact-form form");
      if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
          e.preventDefault();

          // Get form data
          const formData = new FormData(this);
          const data = Object.fromEntries(formData);

          // Here you would typically send the data to your server
          console.log("Form submitted:", data);

          // Show success message (replace with your preferred notification system)
          alert("Thank you for your message! I'll get back to you soon.");

          // Reset form
          this.reset();
        });
      }

      // Add particles background effect (optional)
      function createParticle() {
        const particle = document.createElement("div");
        particle.style.cssText = `
                position: fixed;
                width: 2px;
                height: 2px;
                background: var(--accent-primary);
                border-radius: 50%;
                pointer-events: none;
                opacity: 0;
                z-index: -1;
            `;

        particle.style.left = Math.random() * window.innerWidth + "px";
        particle.style.top = window.innerHeight + "px";

        document.body.appendChild(particle);

        const animation = particle.animate(
          [
            { transform: "translateY(0)", opacity: 1 },
            { transform: `translateY(-${window.innerHeight + 100}px)`, opacity: 0 },
          ],
          {
            duration: Math.random() * 3000 + 2000,
            easing: "linear",
          },
        );

        animation.onfinish = () => particle.remove();
      }

      // Create particles periodically
      setInterval(createParticle, 300);
    // ── Path helper (works from root AND from pages/ subfolder) ──────────────
    const BASE = (() => {
      const path = window.location.pathname;
      if (path.includes('/pages/courses/')) return '../../';
      if (path.includes('/pages/')) return '../';
      return '';
    })();

    // ── Smart Data Loaders ────────────────────────────────────────────────────
    // Each loader checks for both the featured grid (index.html, shows top 6)
    // and the full-page grid (subpages, shows all items).

    function buildEducationCard(item) {
      const linkHtml = item.linkUrl
        ? `<div class="project-links">
            <a href="${item.linkUrl}" target="_blank" rel="noopener">
              <i class="fas fa-external-link-alt"></i> ${item.linkLabel}
            </a>
          </div>`
        : '';
      return `
        <i class="${item.icon}" style="font-size:2rem;color:var(--accent-primary);margin-bottom:1rem"></i>
        <h3>${item.title}</h3>
        <div class="institution">${item.institution}</div>
        <div class="year">${item.year}</div>
        <p class="edu-description">${item.description}</p>
        ${linkHtml}
      `;
    }

    // Prefix relative image paths with BASE so they resolve correctly from any subfolder
    function imgSrc(path) {
      return (path && !path.startsWith('http')) ? BASE + path : (path || '');
    }

    function buildProjectCard(item) {
      const techTags = item.technologies.map(t => `<span class="tech-tag">${t}</span>`).join('');
      const links = item.courseUrl
        ? (() => {
            const isLocal = !item.courseUrl.startsWith('http');
            const href = isLocal ? BASE + item.courseUrl : item.courseUrl;
            const target = isLocal ? '' : 'target="_blank" rel="noopener"';
            return `<a href="${href}" ${target}><i class="fas fa-${isLocal ? 'book-open' : 'external-link-alt'}"></i> View Course</a>`;
          })()
        : `<a href="${item.liveUrl || '#'}" target="_blank" rel="noopener"><i class="fas fa-external-link-alt"></i> Live Demo</a>
           <a href="${item.githubUrl || '#'}" target="_blank" rel="noopener"><i class="fab fa-github"></i> GitHub</a>`;
      return `
        <div class="project-image"><img src="${imgSrc(item.image)}" alt="${item.title}"></div>
        <div class="project-content">
          <h3>${item.title}</h3>
          <p>${item.description}</p>
          <div class="project-tech">${techTags}</div>
          <div class="project-links">${links}</div>
        </div>
      `;
    }

    function buildGameCard(item) {
      const techTags = item.technologies.map(t => `<span class="tech-tag">${t}</span>`).join('');
      return `
        <div class="project-image"><img src="${imgSrc(item.image)}" alt="${item.title}"></div>
        <div class="project-content">
          <h3>${item.title}</h3>
          <p>${item.description}</p>
          <div class="project-tech">${techTags}</div>
          <div class="project-links">
            <a href="${item.playUrl || '#'}" target="_blank" rel="noopener"><i class="fas fa-play"></i> Play Now</a>
            <a href="${item.githubUrl || '#'}" target="_blank" rel="noopener"><i class="fab fa-github"></i> GitHub</a>
          </div>
        </div>
      `;
    }

    async function loadSection({ jsonFile, featuredId, allId, limit, cardClass, buildFn }) {
      const featuredGrid = document.getElementById(featuredId);
      const allGrid = document.getElementById(allId);
      const grid = featuredGrid || allGrid;
      if (!grid) return;

      try {
        const response = await fetch(jsonFile);
        if (!response.ok) throw new Error('Failed to load ' + jsonFile);
        let items = await response.json();
        if (featuredGrid && limit) items = items.slice(0, limit);

        grid.innerHTML = '';
        items.forEach(item => {
          const card = document.createElement('div');
          card.className = cardClass + ' fade-in visible';
          card.innerHTML = buildFn(item);
          grid.appendChild(card);
          if (typeof observer !== 'undefined') observer.observe(card);
        });
      } catch (err) {
        console.error(err);
        grid.innerHTML = '<p style="text-align:center;color:var(--text-muted);">Failed to load data.</p>';
      }
    }

    function loadEducation() {
      return loadSection({ jsonFile: BASE + 'data/education.json', featuredId: 'education-grid', allId: 'all-education-grid', limit: 6, cardClass: 'education-card', buildFn: buildEducationCard });
    }
    function loadCourses() {
      return loadSection({ jsonFile: BASE + 'data/courses.json', featuredId: 'featured-courses-grid', allId: 'all-courses-grid', limit: 6, cardClass: 'project-card', buildFn: buildProjectCard });
    }
    function loadProjects() {
      return loadSection({ jsonFile: BASE + 'data/projects.json', featuredId: 'featured-projects-grid', allId: 'all-projects-grid', limit: 6, cardClass: 'project-card', buildFn: buildProjectCard });
    }
    function loadGames() {
      return loadSection({ jsonFile: BASE + 'data/games.json', featuredId: 'featured-games-grid', allId: 'all-games-grid', limit: 6, cardClass: 'project-card', buildFn: buildGameCard });
    }

    window.addEventListener('DOMContentLoaded', async () => {
      // Load all dynamic content, then scroll to the hash anchor (if any)
      await Promise.allSettled([
        loadEducation(),
        loadCourses(),
        loadProjects(),
        loadGames(),
      ]);

      // After content is injected the page height may have changed.
      // Re-scroll to the hash so Back-buttons from subpages land correctly.
      if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
          const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 80;
          const top = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
