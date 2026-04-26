// 1. Custom Cursor Engine
const cursor = document.getElementById('cursor');
const hoverTargets = document.querySelectorAll('.hover-target, a, button');
const projectCards = document.querySelectorAll('.project-hover-target');

document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.15, ease: "power2.out" });
});

hoverTargets.forEach(target => {
    target.addEventListener('mouseenter', () => cursor.classList.add('active'));
    target.addEventListener('mouseleave', () => cursor.classList.remove('active'));
});

projectCards.forEach(target => {
    target.addEventListener('mouseenter', () => cursor.classList.add('project-hover'));
    target.addEventListener('mouseleave', () => cursor.classList.remove('project-hover'));
});

// 2. Smooth Scroll Setup (Lenis)
const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

gsap.registerPlugin(ScrollTrigger);
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time)=>{ lenis.raf(time * 1000) });
gsap.ticker.lagSmoothing(0, 0);

// Header Navigation Links Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        lenis.scrollTo(this.getAttribute('href'), { offset: -80 });
    });
});

// 3. Preloader & Assembly Sequence
const tl = gsap.timeline();
let counter = { value: 0 };
const counterEl = document.getElementById('loader-counter');
const barEl = document.getElementById('loader-bar');

lenis.stop(); // Freeze scroll

tl.to(counter, {
    value: 100, duration: 2, ease: "power3.inOut",
    onUpdate: () => { 
        counterEl.innerText = Math.round(counter.value).toString().padStart(2, '0'); 
        barEl.style.width = counter.value + "%";
    }
})
.to("#preloader", { yPercent: -100, duration: 0.8, ease: "expo.inOut", delay: 0.2 })
.call(() => lenis.start())
// Assemble Hero SVG
.to(".svg-draw", { strokeDashoffset: 0, duration: 2.5, ease: "power2.inOut", stagger: 0.1 }, "-=0.4")
.to(".hero-core", { opacity: 0.8, duration: 1 }, "-=1")
// Animate Typography
.to(".hero-text", { y: 0, duration: 1.2, stagger: 0.15, ease: "power4.out" }, "-=2")
.to(".hero-fade", { opacity: 1, duration: 1, ease: "power2.out" }, "-=1.5");

// Subtle continuous rotation for Hero SVG Matrix
gsap.to("#matrix-group", {
    rotation: 360, transformOrigin: "center center", duration: 60, repeat: -1, ease: "none"
});

// 4. Global SVG Scroll Line Animation
gsap.to("#global-scroll-line", {
    strokeDashoffset: 0, ease: "none",
    scrollTrigger: {
        trigger: "body", start: "top top", end: "bottom bottom", scrub: true
    }
});

// Timeline Section Line Animation
gsap.to("#timeline-line", {
    strokeDashoffset: 0, ease: "none",
    scrollTrigger: {
        trigger: "#expertise", start: "top center", end: "bottom center", scrub: true
    }
});

// 5. Sticky Card Parallax & Stacking
const cards = gsap.utils.toArray('.project-card');
cards.forEach((card, i) => {
    if (i !== cards.length - 1) {
        gsap.to(card, {
            scale: 0.95, opacity: 0.4, transformOrigin: "top center", ease: "none",
            scrollTrigger: {
                trigger: card, start: "top 12vh", end: () => `+=${window.innerHeight}`,
                scrub: true, invalidateOnRefresh: true
            }
        });
    }
});

// 6. Element Reveals on Scroll
const reveals = document.querySelectorAll('.gs-reveal');
reveals.forEach(el => {
    gsap.fromTo(el, 
        { autoAlpha: 0, y: 30 },
        {
            autoAlpha: 1, y: 0, duration: 1, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" }
        }
    );
});