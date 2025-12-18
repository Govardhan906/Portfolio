document.addEventListener("DOMContentLoaded", () => {
  // Initialize all modules
  Preloader.init();
  CustomCursor.init();
  Navigation.init();
  ParticleSystem.init();
  TypingAnimation.init();
  ScrollReveal.init();
  StatsCounter.init();
  SkillBars.init();
  ContactForm.init();
  BackToTop.init();
});

/* PRELOADER*/
const Preloader = {
  init() {
    const preloader = document.getElementById("preloader");

    window.addEventListener("load", () => {
      setTimeout(() => {
        preloader.classList.add("fade-out");
        document.body.style.overflow = "visible";
      }, 1500);
    });
  },
};

/* CUSTOM CURSOR*/
const CustomCursor = {
  init() {
    const cursor = document.querySelector(".cursor");
    const follower = document.querySelector(".cursor-follower");

    if (!cursor || !follower || this.isTouchDevice()) return;

    let mouseX = 0,
      mouseY = 0;
    let cursorX = 0,
      cursorY = 0;
    let followerX = 0,
      followerY = 0;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Animate cursor
    const animate = () => {
      cursorX += (mouseX - cursorX) * 0.2;
      cursorY += (mouseY - cursorY) * 0.2;
      cursor.style.left = `${cursorX - 6}px`;
      cursor.style.top = `${cursorY - 6}px`;

      followerX += (mouseX - followerX) * 0.1;
      followerY += (mouseY - followerY) * 0.1;
      follower.style.left = `${followerX - 20}px`;
      follower.style.top = `${followerY - 20}px`;

      requestAnimationFrame(animate);
    };
    animate();

    const interactiveElements = document.querySelectorAll(
      "a, button, input, textarea, .project-card, .stat-card, .skill-category"
    );

    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        follower.classList.add("hover");
      });
      el.addEventListener("mouseleave", () => {
        follower.classList.remove("hover");
      });
    });
  },

  isTouchDevice() {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  },
};

/* NAVIGATION*/
const Navigation = {
  init() {
    this.navbar = document.getElementById("navbar");
    this.hamburger = document.getElementById("hamburger");
    this.mobileMenu = document.getElementById("mobileMenu");
    this.navLinks = document.querySelectorAll(".nav-link");
    this.mobileNavLinks = document.querySelectorAll(".mobile-nav-link");
    this.sections = document.querySelectorAll("section[id]");

    this.bindEvents();
    this.handleScroll();
  },

  bindEvents() {
    window.addEventListener("scroll", () => this.handleScroll());

    this.hamburger?.addEventListener("click", () => this.toggleMobileMenu());

    this.mobileNavLinks.forEach((link) => {
      link.addEventListener("click", () => this.closeMobileMenu());
    });

    [...this.navLinks, ...this.mobileNavLinks].forEach((link) => {
      link.addEventListener("click", (e) => this.smoothScroll(e));
    });
  },

  handleScroll() {
    const scrollY = window.scrollY;

    if (scrollY > 100) {
      this.navbar.classList.add("scrolled");
    } else {
      this.navbar.classList.remove("scrolled");
    }

    this.sections.forEach((section) => {
      const sectionTop = section.offsetTop - 150;
      const sectionBottom = sectionTop + section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (scrollY >= sectionTop && scrollY < sectionBottom) {
        this.navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  },

  toggleMobileMenu() {
    this.hamburger.classList.toggle("active");
    this.mobileMenu.classList.toggle("active");
    document.body.style.overflow = this.mobileMenu.classList.contains("active")
      ? "hidden"
      : "visible";
  },

  closeMobileMenu() {
    this.hamburger.classList.remove("active");
    this.mobileMenu.classList.remove("active");
    document.body.style.overflow = "visible";
  },

  smoothScroll(e) {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute("href");
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      const offsetTop = targetSection.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  },
};

/* PARTICLE SYSTEM */
const ParticleSystem = {
  init() {
    this.canvas = document.getElementById("particles");
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext("2d");
    this.particles = [];
    this.particleCount = this.getParticleCount();
    this.mouse = { x: null, y: null, radius: 150 };

    this.resize();
    this.createParticles();
    this.bindEvents();
    this.animate();
  },

  getParticleCount() {
    const width = window.innerWidth;
    if (width < 768) return 30;
    if (width < 1024) return 50;
    return 80;
  },

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  },

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: Math.random() > 0.5 ? "#00D4FF" : "#7B2FFF",
      });
    }
  },

  bindEvents() {
    window.addEventListener("resize", () => {
      this.resize();
      this.particleCount = this.getParticleCount();
      this.createParticles();
    });

    this.canvas.addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    this.canvas.addEventListener("mouseleave", () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  },

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach((particle, index) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      if (particle.x < 0 || particle.x > this.canvas.width)
        particle.speedX *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height)
        particle.speedY *= -1;

      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = particle.x - this.mouse.x;
        const dy = particle.y - this.mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.mouse.radius) {
          const force = (this.mouse.radius - distance) / this.mouse.radius;
          particle.x += dx * force * 0.02;
          particle.y += dy * force * 0.02;
        }
      }

      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = particle.color;
      this.ctx.globalAlpha = 0.6;
      this.ctx.fill();

      this.particles.slice(index + 1).forEach((otherParticle) => {
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          this.ctx.beginPath();
          this.ctx.moveTo(particle.x, particle.y);
          this.ctx.lineTo(otherParticle.x, otherParticle.y);
          this.ctx.strokeStyle = particle.color;
          this.ctx.globalAlpha = 0.15 * (1 - distance / 120);
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      });
    });

    this.ctx.globalAlpha = 1;
    requestAnimationFrame(() => this.animate());
  },
};

/* TYPING ANIMATION */
const TypingAnimation = {
  init() {
    this.element = document.getElementById("typingText");
    if (!this.element) return;

    this.texts = [
      "Full Stack Developer",
      "Java Expert",
      "Problem Solver",
      "Tech Enthusiast",
      "Clean Code Advocate",
    ];
    this.textIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this.typingSpeed = 100;

    this.type();
  },

  type() {
    const currentText = this.texts[this.textIndex];

    if (this.isDeleting) {
      this.element.textContent = currentText.substring(0, this.charIndex - 1);
      this.charIndex--;
      this.typingSpeed = 50;
    } else {
      this.element.textContent = currentText.substring(0, this.charIndex + 1);
      this.charIndex++;
      this.typingSpeed = 100;
    }

    if (!this.isDeleting && this.charIndex === currentText.length) {
      this.isDeleting = true;
      this.typingSpeed = 2000;
    }

    if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.textIndex = (this.textIndex + 1) % this.texts.length;
      this.typingSpeed = 500;
    }

    setTimeout(() => this.type(), this.typingSpeed);
  },
};

/* SCROLL REVEAL ANIMATIONS */
const ScrollReveal = {
  init() {
    this.elements = document.querySelectorAll(
      ".section-header, .about-text, .stat-card, .skill-category, .timeline-item, .project-card, .education-card, .cert-card, .contact-item, .contact-form"
    );

    this.elements.forEach((el) => el.classList.add("reveal"));

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    this.elements.forEach((el) => this.observer.observe(el));
  },
};

/*  STATS COUNTER ANIMATION */
const StatsCounter = {
  init() {
    this.statNumbers = document.querySelectorAll(".stat-number[data-target]");

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animateCount(entry.target);
            this.observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    this.statNumbers.forEach((stat) => this.observer.observe(stat));
  },

  animateCount(element) {
    const target = parseInt(element.getAttribute("data-target"));
    const duration = 2000;
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(easeOutQuart * target);

      element.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        element.textContent = target;
      }
    };

    requestAnimationFrame(updateCount);
  },
};

/* SKILL BARS ANIMATION */
const SkillBars = {
  init() {
    this.skillBars = document.querySelectorAll(".skill-progress");

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const progress = entry.target.getAttribute("data-progress");
            entry.target.style.width = `${progress}%`;
            this.observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    this.skillBars.forEach((bar) => this.observer.observe(bar));
  },
};

/*  CONTACT FORM */
const ContactForm = {
  init() {
    this.form = document.getElementById("contactForm");
    if (!this.form) return;

    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
  },

  handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(this.form);
    const name = formData.get("name");
    const email = formData.get("email");
    const subject = formData.get("subject");
    const message = formData.get("message");

    const mailtoLink = `mailto:govardhanpalakolanu2003@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    )}`;

    window.location.href = mailtoLink;

    this.showNotification("Opening your email client...");

    this.form.reset();
  },

  showNotification(message) {
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <span>${message}</span>
        `;

    Object.assign(notification.style, {
      position: "fixed",
      bottom: "30px",
      left: "50%",
      transform: "translateX(-50%)",
      background: "linear-gradient(135deg, #00D4FF, #7B2FFF)",
      color: "#0a0a0a",
      padding: "15px 30px",
      borderRadius: "50px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      fontWeight: "600",
      boxShadow: "0 10px 40px rgba(0, 212, 255, 0.3)",
      zIndex: "9999",
      animation: "slideUp 0.5s ease",
    });

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "slideDown 0.5s ease";
      setTimeout(() => notification.remove(), 500);
    }, 3000);
  },
};

const BackToTop = {
  init() {
    this.button = document.getElementById("backToTop");
    if (!this.button) return;

    window.addEventListener("scroll", () => this.toggleVisibility());
    this.button.addEventListener("click", () => this.scrollToTop());
  },

  toggleVisibility() {
    if (window.scrollY > 500) {
      this.button.classList.add("visible");
    } else {
      this.button.classList.remove("visible");
    }
  },

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  },
};

const additionalStyles = document.createElement("style");
additionalStyles.textContent = `
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes slideDown {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(30px);
        }
    }
`;
document.head.appendChild(additionalStyles);

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    if (targetId === "#") return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      e.preventDefault();
      const offsetTop = targetElement.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  });
});

/* TILT EFFECT FOR PROJECT CARDS */
const TiltEffect = {
  init() {
    if (this.isTouchDevice()) return;

    const cards = document.querySelectorAll(".project-card, .stat-card");

    cards.forEach((card) => {
      card.addEventListener("mousemove", (e) => this.handleTilt(e, card));
      card.addEventListener("mouseleave", () => this.resetTilt(card));
    });
  },

  handleTilt(e, card) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Even more subtle tilt for featured cards
    const divisor = card.classList.contains("featured") ? 80 : 40;
    const rotateX = (y - centerY) / divisor;
    const rotateY = (centerX - x) / divisor;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
  },

  resetTilt(card) {
    card.style.transform =
      "perspective(1000px) rotateX(0) rotateY(0) translateY(0)";
  },

  isTouchDevice() {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  },
};

document.addEventListener("DOMContentLoaded", () => {
  TiltEffect.init();
});
