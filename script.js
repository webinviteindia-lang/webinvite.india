document.addEventListener('DOMContentLoaded', () => {

    // --- Custom Cursor & Cinematic Glow (GSAP) ---
    const cursor = document.querySelector('.custom-cursor');
    const cursorGlow = document.getElementById('cursor-glow');
    
    // We use GSAP matchMedia to only enable heavy mouse effects on desktop
    let mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
        // Quicksetters for performance
        const xTo = gsap.quickTo(cursor, "x", {duration: 0.2, ease: "power3"});
        const yTo = gsap.quickTo(cursor, "y", {duration: 0.2, ease: "power3"});
        
        const glowXTo = gsap.quickTo(cursorGlow, "x", {duration: 0.6, ease: "power2"});
        const glowYTo = gsap.quickTo(cursorGlow, "y", {duration: 0.6, ease: "power2"});

        window.addEventListener("mousemove", e => {
            xTo(e.clientX);
            yTo(e.clientY);
            glowXTo(e.clientX);
            glowYTo(e.clientY);
        });

        // Interactive hover states for cursor
        const interactiveElements = document.querySelectorAll('a, button, .gallery-card, .demo-close, .slider-handle');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
                gsap.to(cursorGlow, { scale: 1.3, opacity: 0.8, duration: 0.3 });
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
                gsap.to(cursorGlow, { scale: 1, opacity: 1, duration: 0.3 });
            });
        });
    });


    // --- Smooth Scrolling for Navigation ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            const target = document.querySelector(targetId);
            if(target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });


    // --- Futuristic 3D Parallax & Magnetic Interactions (GSAP) ---
    mm.add("(min-width: 768px)", () => {
        const floatItems = document.querySelectorAll('.float-item');
        const heroText = document.querySelector('.cinematic-text');
        
        window.addEventListener('mousemove', (e) => {
            const xOffset = (e.clientX / window.innerWidth - 0.5) * 2;
            const yOffset = (e.clientY / window.innerHeight - 0.5) * 2;
            
            // 1. Move glass elements, lines, and cards in 3D perspective
            floatItems.forEach(item => {
                const speed = parseFloat(item.getAttribute('data-speed')) || 0.05;
                gsap.to(item, {
                    x: xOffset * window.innerWidth * speed,
                    y: yOffset * window.innerHeight * speed,
                    rotationX: -yOffset * 15,
                    rotationY: xOffset * 15,
                    duration: 1.5,
                    ease: "power2.out"
                });
            });
            
            // 2. Subtle text pulling
            if(heroText) {
                 gsap.to(heroText, {
                     x: xOffset * 15,
                     y: yOffset * 15,
                     rotationY: xOffset * 4,
                     duration: 1.5,
                     ease: "power2.out"
                 });
            }
        });
    });

    // --- Gallery Demo Modal Logic ---
    const galleryCards = document.querySelectorAll('.gallery-card');
    const modal = document.getElementById('demoModal');
    const closeBtn = document.querySelector('.demo-close');
    const demoImage = document.getElementById('demoImage');

    galleryCards.forEach(card => {
        card.addEventListener('click', () => {
            const imageSrc = card.getAttribute('data-preview');
            if(imageSrc) {
                demoImage.src = imageSrc;
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // prevent background scroll
            }
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = ''; 
    });

    // Close on clicking outside container
    modal.addEventListener('click', (e) => {
        if(e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // --- Before/After Slider Logic ---
    const comparisonSlider = document.querySelector('.comparison-slider');
    const afterImage = document.querySelector('.comparison-image.after');

    if(comparisonSlider && afterImage) {
        let isDown = false;

        comparisonSlider.addEventListener('mousedown', () => isDown = true);
        comparisonSlider.addEventListener('mouseup', () => isDown = false);
        comparisonSlider.addEventListener('mouseleave', () => isDown = false);

        comparisonSlider.addEventListener('mousemove', (e) => {
            if(!isDown) return;
            e.preventDefault();
            const rect = comparisonSlider.getBoundingClientRect();
            let x = e.clientX - rect.left; // x position within the element
            
            // Constrain 
            if(x < 0) x = 0;
            if(x > rect.width) x = rect.width;

            const percentage = (x / rect.width) * 100;
            afterImage.style.width = percentage + '%';
        });

        // Touch support
        comparisonSlider.addEventListener('touchstart', () => isDown = true);
        comparisonSlider.addEventListener('touchend', () => isDown = false);
        comparisonSlider.addEventListener('touchmove', (e) => {
            if(!isDown) return;
            const rect = comparisonSlider.getBoundingClientRect();
            let x = e.touches[0].clientX - rect.left;
            
            if(x < 0) x = 0;
            if(x > rect.width) x = rect.width;

            const percentage = (x / rect.width) * 100;
            afterImage.style.width = percentage + '%';
        }, {passive: true});
    }

    // --- Scroll Animations (Intersection Observer) ---
    const revealElements = document.querySelectorAll('.reveal-scroll, .gallery-card, .step-card, .testimonial-card, .device');

    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if(!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        // Initial state before reveal
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        revealOnScroll.observe(el);
    });

    // --- Global Magnetic Interaction (Buttons & Cards) ---
    mm.add("(min-width: 768px)", () => {
        const magneticElements = document.querySelectorAll('.btn-primary, .nav-links a, .gallery-card, .magnetic-btn');
        
        magneticElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
                const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
                gsap.to(el, { x: x, y: y, duration: 0.4, ease: "power2.out" });
            });
            
            el.addEventListener('mouseleave', () => {
                gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
            });
        });
    });

    // --- Instagram Pre-Fill Helper ---
    const igBtn = document.getElementById('igContactBtn');
    if (igBtn) {
        igBtn.addEventListener('click', () => {
            const message = "Hi, I’m interested in getting a website.";
            navigator.clipboard.writeText(message).catch(err => console.log('Clipboard failed: ', err));
        });
    }

    // --- Mobile Navigation Menu ---
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

});
