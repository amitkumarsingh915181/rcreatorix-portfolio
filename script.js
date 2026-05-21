'use strict';

// ============================================================
// CONFIG — Instagram Basic Display API
// ============================================================
const CONFIG = {
    ACCESS_TOKEN: 'IGAAaG5UFyUBlBZAGFzdk56YWdpVkNMMGYwa0l0bm5yQnpENWprUldLNUhjMkFvamVHZAE4tcERvQ1hwdWxaYzdCaTBxbjNSZA21DWTA2NzFVeF9GUFFFYkxSdjJjRUJyX2NWWHNHVW5xVEVKM2pJUGt4YV9PR0VtWFpNLXkzMnppcwZDZD',
    USERNAME: 'rcreatorix',
    REELS_LIMIT: 50,
    POSTS_LIMIT: 50,
    GALLERY_LIMIT: 60,
};

// ============================================================
// CORE PORTFOLIO LOGIC (Three.js, GSAP, Preloader)
// ============================================================

(function preload() {
    const bar = document.getElementById('pre-bar');
    const pct = document.getElementById('pre-pct');
    const status = document.getElementById('pre-status');
    const loader = document.getElementById('preloader');
    const statuses = ['Initializing', 'Loading assets', 'Building worlds', 'Almost ready'];
    let p = 0, si = 0;

    setTimeout(() => { document.getElementById('pre-s1').classList.add('reveal'); }, 100);
    setTimeout(() => { document.getElementById('pre-s2').classList.add('reveal'); }, 200);
    setTimeout(() => { document.getElementById('pre-s3').classList.add('reveal'); }, 320);

    const iv = setInterval(() => {
        p += Math.random() * 3.5 + 1.5;
        if (p >= 100) { p = 100; clearInterval(iv); }
        bar.style.width = p + '%';
        pct.textContent = String(Math.floor(p)).padStart(3, '0');
        const newSi = Math.floor((p / 100) * statuses.length);
        if (newSi !== si && newSi < statuses.length) { si = newSi; status.textContent = statuses[si]; }
        if (p >= 100) {
            setTimeout(() => {
                gsap.to(loader, {
                    opacity: 0, duration: 0.9, ease: 'power2.inOut',
                    onComplete: () => { loader.style.display = 'none'; initSite(); }
                });
            }, 400);
        }
    }, 45);
})();

function initWebGL() {
    const canvas = document.getElementById('webgl-bg');
    if (!canvas) return;
    const W = window.innerWidth, H = window.innerHeight;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 200);
    camera.position.z = 6;

    function makeParticles(count, spread, sizeMin, sizeMax, colors) {
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(count * 3);
        const col = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - .5) * spread;
            pos[i * 3 + 1] = (Math.random() - .5) * spread * .7;
            pos[i * 3 + 2] = (Math.random() - .5) * spread * .5;
            const c = colors[Math.floor(Math.random() * colors.length)];
            col[i * 3] = c[0]; col[i * 3 + 1] = c[1]; col[i * 3 + 2] = c[2];
        }
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
        const mat = new THREE.PointsMaterial({
            size: sizeMin + (Math.random() * (sizeMax - sizeMin)),
            vertexColors: true, transparent: true, opacity: 0.75,
            sizeAttenuation: true
        });
        return new THREE.Points(geo, mat);
    }

    const fire_c = [[1, .19, .07], [1, .55, .16], [1, .75, .3]];
    const ice_c = [[.78, .94, 1], [.55, .8, 1], [.88, .96, 1]];

    const pFire = makeParticles(600, 22, 0.025, 0.045, fire_c);
    const pIce = makeParticles(400, 18, 0.015, 0.03, ice_c);
    const pMix = makeParticles(800, 30, 0.008, 0.02, [...fire_c, ...ice_c]);
    scene.add(pFire, pIce, pMix);

    const addWire = (geo, col, pos, opacity = 0.07) => {
        const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: col, wireframe: true, transparent: true, opacity }));
        m.position.set(...pos); scene.add(m); return m;
    };
    const t1 = addWire(new THREE.TorusGeometry(2.4, .5, 7, 48), 0xff4d1c, [3.5, -1, -4], 0.07);
    const t2 = addWire(new THREE.TorusGeometry(1.5, .35, 6, 32), 0xc8f0ff, [-3.8, 1.5, -5], 0.06);
    const t3 = addWire(new THREE.TorusKnotGeometry(1, .35, 80, 8), 0xff8c42, [4.5, 2, -6], 0.05);
    const ico = addWire(new THREE.IcosahedronGeometry(1.2), 0xc8f0ff, [-4.5, -1.5, -4], 0.06);

    let pmx = 0, pmy = 0;
    document.addEventListener('mousemove', e => {
        pmx = (e.clientX / window.innerWidth - .5) * 0.4;
        pmy = (e.clientY / window.innerHeight - .5) * 0.3;
    });

    const clock = new THREE.Clock();
    (function animate() {
        requestAnimationFrame(animate);
        const t = clock.getElapsedTime();
        pFire.rotation.y = t * .06 + pmx;
        pFire.rotation.x = t * .03 + pmy;
        pIce.rotation.y = -t * .04 - pmx * .5;
        pIce.rotation.z = t * .025;
        pMix.rotation.y = t * .02;
        pMix.rotation.x = -t * .015;
        t1.rotation.x = t * .28; t1.rotation.z = t * .18;
        t2.rotation.y = t * .22; t2.rotation.x = t * .15;
        t3.rotation.x = t * .12; t3.rotation.y = t * .08;
        ico.rotation.y = t * .18; ico.rotation.x = t * .1;
        camera.position.x += (pmx * .6 - camera.position.x) * .04;
        camera.position.y += (-pmy * .4 - camera.position.y) * .04;
        renderer.render(scene, camera);
    })();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

function initSite() {
    gsap.registerPlugin(ScrollTrigger);
    initWebGL();
    initHeroAnims();
    initScrollAnims();
    initProcessSlider();  // Initialize premium process slider
    initNav();
    initCounters();
    fetchInstagram();    // Mobile Nav Toggle
    const navToggle = document.getElementById('nav-toggle');
    const navCenter = document.querySelector('.nav-center');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navCenter.classList.toggle('open');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navCenter.classList.remove('open');
        });
    });

    // Cursor dual-ring logic
}

function initHeroAnims() {
    gsap.to('.h1-word', { y: 0, duration: 1.4, ease: 'power4.out', stagger: 0.1, delay: 0.1 });
    gsap.to('.hero-eyebrow', { opacity: 1, x: 0, duration: 1, delay: 0.6, ease: 'power3.out' });
    gsap.to('.hero-desc', { opacity: 1, y: 0, duration: 1, delay: 1, ease: 'power3.out' });
    gsap.to('.hero-actions', { opacity: 1, y: 0, duration: 1, delay: 1.2, ease: 'power3.out' });
    gsap.to('.hero-stats', { opacity: 1, duration: 1, delay: 1.5, ease: 'power3.out' });
    gsap.to('.scroll-ind', { opacity: 1, duration: 1, delay: 1.8 });
}

function initScrollAnims() {
    const reveal = (sel, from = {}, opts = {}) => {
        gsap.utils.toArray(sel).forEach(el => {
            gsap.from(el, {
                ...{ opacity: 0, y: 40, duration: 1, ease: 'power3.out' }, ...from,
                scrollTrigger: { trigger: el, start: 'top 85%', ...opts }
            });
        });
    };
    reveal('.s-label', { x: -20, y: 0, duration: .7 });
    reveal('.s-title', { y: 50, duration: 1.1 });
    reveal('.about-para', { y: 30, duration: .9, stagger: .15 }, { start: 'top 88%' });
    reveal('.tool-tag', { y: 15, duration: .5, stagger: .04 });
    reveal('.wcard', { y: 60, duration: .9, stagger: .08 });
    reveal('.gi', { scale: .92, y: 30, duration: .7, stagger: .06 });
    reveal('.c-detail', { x: -20, y: 0, duration: .7, stagger: .1 });
    reveal('.sc', { y: 40, duration: .8, stagger: .12 });

    gsap.to('.portrait-fill', {
        y: -40, ease: 'none',
        scrollTrigger: { trigger: '#about', start: 'top bottom', end: 'bottom top', scrub: 1.5 }
    });
    gsap.to('.footer-hero-text', {
        y: -80, ease: 'none',
        scrollTrigger: { trigger: 'footer', start: 'top bottom', end: 'bottom top', scrub: 2 }
    });
}

function initProcessSlider() {
    const processCurve = document.getElementById('process-curve');
    const cards = gsap.utils.toArray('.process-card');
    const dots = gsap.utils.toArray('.indicator-dot');
    
    if (!processCurve || !cards.length) return;

    // Database of the 12 process steps for charcoal/painting master process
    const stepsData = [
        {
            num: "01",
            title: "Inspiration",
            desc: "Exploring the core vision, gathering references, and defining the emotional and thematic direction of the artwork."
        },
        {
            num: "02",
            title: "Consultation",
            desc: "Aligning on select mediums (charcoal or oil painting), dimensions, framing options, and milestone timelines."
        },
        {
            num: "03",
            title: "Concept Sketch",
            desc: "Drafting composition thumbnails and digital sketches to experiment with scale, focal points, and lighting dynamics."
        },
        {
            num: "04",
            title: "Material Choice",
            desc: "Curating archival-grade cotton papers and selecting specific charcoal weights to match the requested texture."
        },
        {
            num: "05",
            title: "Base Block-in",
            desc: "Mapping out exact proportions and structural gestures. This layer ensures visual balance across the canvas."
        },
        {
            num: "06",
            title: "Value Mapping",
            desc: "Applying initial gradients to define the light source and laying down primary shadows to set the high-contrast mood."
        },
        {
            num: "07",
            title: "Blending & Depth",
            desc: "Using blending stumps and chamois to smooth out gradients, creating soft atmospheric mist and deep transitions."
        },
        {
            num: "08",
            title: "Detail Rendering",
            desc: "Obsessively rendering intricate details like skin pores, hair strands, fabric folds, and fine reflections."
        },
        {
            num: "09",
            title: "Highlight Lifting",
            desc: "Using specialized erasers to lift charcoal particles, pulling brilliant highlights back out of the deep dark values."
        },
        {
            num: "10",
            title: "Tone Refinement",
            desc: "Stepping back to review under varied ambient lighting, adjusting micro-contrasts and overall visual balance."
        },
        {
            num: "11",
            title: "Fixative Sealing",
            desc: "Applying museum-grade fixative spray to seal the delicate charcoal particles and prevent smudging permanently."
        },
        {
            num: "12",
            title: "Framing & Handoff",
            desc: "Mounting behind UV-protective glass, handcrafting a custom frame, and packing securely for global courier delivery."
        }
    ];

    let lastActiveIndex = 0;

    // Position updates function
    function updateSlider(progress) {
        const svgElement = processCurve.ownerSVGElement;
        const svgRect = svgElement.getBoundingClientRect();
        const pathLength = processCurve.getTotalLength();
        
        const activeIndex = progress * 11;
        const isMobile = window.innerWidth < 768;
        const step = isMobile ? 0.125 : 0.08; 
        
        cards.forEach((card, i) => {
            const diff = i - activeIndex;
            // Cards are placed relative to the center (0.5) of the path
            const t = 0.5 + diff * step;
            
            // Clamp t within path bounds [0, 1]
            const clampedT = Math.max(0, Math.min(1, t));
            const point = processCurve.getPointAtLength(clampedT * pathLength);
            
            // Map coordinates from SVG space (1920x800) to screen pixel space
            const screenX = point.x * (svgRect.width / 1920);
            const screenY = point.y * (svgRect.height / 800);
            
            const cardW = isMobile ? 100 : 160;
            const cardH = isMobile ? 135 : 215;
            const x = screenX - cardW / 2;
            const y = screenY - cardH / 2;
            
            const dist = Math.abs(diff);
            
            // Active card scales up, inactive ones scale down
            const scale = dist === 0 ? 1.25 : Math.max(0.75, 1.25 - dist * 0.22);
            
            // Fading out inactive items softly
            const opacity = Math.max(0.15, 1 - dist * 0.45);
            
            // Parallax shift for images inside the mask circle
            const img = card.querySelector('img');
            const imgShift = diff * 25; // opposite direction shift
            
            gsap.set(card, {
                x: x,
                y: y,
                scale: scale,
                opacity: opacity,
                zIndex: Math.round(100 - dist * 10)
            });
            
            if (img) {
                gsap.set(img, { x: imgShift });
            }
            
            // Toggle active classes
            if (dist < 0.5) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
        
        // Update details text panel when active step integer changes
        const activeInt = Math.round(activeIndex);
        if (activeInt !== lastActiveIndex && activeInt >= 0 && activeInt < 12) {
            lastActiveIndex = activeInt;
            
            // Synchronize active indicator dot
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === activeInt);
            });
            
            // Fade detail text panel transition
            gsap.to('.process-detail-content', {
                opacity: 0,
                y: 15,
                duration: 0.3,
                onComplete: () => {
                    // Update content
                    document.querySelector('.process-detail-num').textContent = stepsData[activeInt].num;
                    document.querySelector('.process-detail-title').textContent = stepsData[activeInt].title;
                    document.querySelector('.process-detail-desc').textContent = stepsData[activeInt].desc;
                    
                    // Fade back in
                    gsap.to('.process-detail-content', {
                        opacity: 1,
                        y: 0,
                        duration: 0.4,
                        ease: 'power2.out'
                    });
                }
            });
        }
    }

    // Make scroll length shorter on mobile for better UX
    const scrollEnd = window.innerWidth <= 768 ? '+=2500' : '+=4500';

    // Main ScrollTrigger pinned instance
    const processTrigger = ScrollTrigger.create({
        trigger: '#process',
        pin: true,
        scrub: 1.1,
        start: 'top top',
        end: scrollEnd, // Responsive scroll length
        id: 'processTrigger',
        snap: {
            snapTo: 1 / 11,
            duration: { min: 0.25, max: 0.6 },
            ease: 'power2.out'
        },
        onUpdate: (self) => {
            updateSlider(self.progress);
        }
    });

    // Handle dot clicks to scroll to target step
    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            const st = ScrollTrigger.getById('processTrigger');
            if (st) {
                const targetScroll = st.start + (st.end - st.start) * (idx / 11);
                window.scrollTo({
                    top: targetScroll,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Entrance Animation when the section becomes visible
    gsap.from('#process .process-header', {
        opacity: 0,
        y: -30,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '#process',
            start: 'top 80%',
        }
    });

    gsap.from('#process .process-svg', {
        opacity: 0,
        duration: 1.8,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '#process',
            start: 'top 80%',
        }
    });

    // Initial render
    setTimeout(() => {
        updateSlider(0);
    }, 150);

    // Update positions on resize
    window.addEventListener('resize', () => {
        const st = ScrollTrigger.getById('processTrigger');
        if (st) {
            updateSlider(st.progress);
        }
    });
}

function initNav() {
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => { nav.classList.toggle('scrolled', window.scrollY > 60); });
    const sections = document.querySelectorAll('section[id]');
    const links = document.querySelectorAll('.nav-link');
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                links.forEach(l => l.classList.remove('active'));
                const active = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
                if (active) active.classList.add('active');
            }
        });
    }, { threshold: .4 });
    sections.forEach(s => obs.observe(s));
}

function initCounters() {
    const counters = [
        { el: document.getElementById('st1'), target: 200, suffix: '+' },
        { el: document.getElementById('st2'), target: 60, suffix: '+' },
        { el: document.getElementById('st3'), target: 8, suffix: 'Y' },
    ];
    counters.forEach(({ el, target, suffix }) => {
        if (!el) return;
        ScrollTrigger.create({
            trigger: el, start: 'top 85%', once: true,
            onEnter: () => {
                gsap.to({ v: 0 }, {
                    v: target, duration: 2.5, ease: 'power2.out',
                    onUpdate: function () { el.textContent = Math.floor(this.targets()[0].v) + suffix; }
                });
            }
        });
    });
}

// ============================================================
// INSTAGRAM API LOGIC (User Provided)
// ============================================================
const BASE = 'https://graph.instagram.com';
const FIELDS = 'id,caption,media_type,media_url,thumbnail_url,timestamp,like_count,permalink';

let allMedia = [];
let albumChildren = {};
let currentAlbumItems = [];
let currentSlideIndex = 0;
let galleryFilter = 'all';

// Initialize Plyr
const player = new Plyr('#lightbox-video', {
    controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
    clickToPlay: true,
    hideControls: true,
    resetOnEnd: true,
    loop: { active: true }
});

async function fetchInstagram() {
    const token = CONFIG.ACCESS_TOKEN;
    if (!token || token === 'YOUR_INSTAGRAM_ACCESS_TOKEN') {
        showTokenSetup();
        return;
    }
    try {
        const res = await fetch(`${BASE}/me/media?fields=${FIELDS}&limit=100&access_token=${token}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error.message);
        allMedia = data.data || [];

        const albumPromises = allMedia
            .filter(m => m.media_type === 'CAROUSEL_ALBUM')
            .map(async (album) => {
                try {
                    const cRes = await fetch(`${BASE}/${album.id}/children?fields=id,media_url,media_type,timestamp,thumbnail_url&access_token=${token}`);
                    const cData = await cRes.json();
                    albumChildren[album.id] = cData.data || [];
                } catch (e) {
                    console.error(`Failed to fetch children for album ${album.id}`, e);
                    albumChildren[album.id] = [];
                }
            });

        await Promise.all(albumPromises);
        fetchProfile(token);
        renderReels();
        renderPosts();
        renderGallery();
    } catch (err) {
        showError(err.message);
    }
}

async function fetchProfile(token) {
    try {
        const res = await fetch(`${BASE}/me?fields=followers_count,media_count&access_token=${token}`);
        const data = await res.json();
        const statPosts = document.getElementById('stat-posts');
        const statFollowers = document.getElementById('stat-followers');
        if (data.media_count && statPosts) statPosts.textContent = data.media_count + '+';
        if (data.followers_count && statFollowers) {
            const n = data.followers_count;
            const s = n >= 1000 ? (n / 1000).toFixed(1) + 'K' : n;
            statFollowers.textContent = s;
        }
    } catch (e) { }
}

function formatDate(ts) {
    return new Date(ts).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
}

function truncate(str, len = 120) {
    if (!str) return '';
    return str.length > len ? str.slice(0, len).trimEnd() + '…' : str;
}

function renderReels() {
    const reels = allMedia.filter(m => m.media_type === 'VIDEO');
    const wrapper = document.getElementById('reels-wrapper');
    const countEl = document.getElementById('reels-count');
    if (countEl) countEl.textContent = reels.length + ' videos';

    if (!wrapper) return;
    if (!reels.length) {
        wrapper.innerHTML = '<div class="swiper-slide"><p style="color:rgba(255,255,255,0.3);font-size:0.78rem;">No reels found.</p></div>';
        return;
    }

    wrapper.innerHTML = reels.map(r => `
      <div class="swiper-slide">
        <div class="reel-card" onclick="openLightbox('${r.media_url}','${escCap(r.caption)}', 'VIDEO')">
            <img src="${r.thumbnail_url || r.media_url}" alt="Reel" loading="lazy">
            <div class="reel-play"></div>
            <div class="reel-overlay">
                <div class="reel-type">Reel · ${formatDate(r.timestamp)}</div>
                <p class="reel-caption">${truncate(r.caption, 80)}</p>
            </div>
        </div>
      </div>
    `).join('');

    new Swiper('#reels-container', {
        slidesPerView: 2.2, spaceBetween: 12,
        navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
        breakpoints: { 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 }, 1400: { slidesPerView: 5 } },
        grabCursor: true
    });
}

function renderPosts() {
    const posts = allMedia.filter(m => m.media_type === 'IMAGE' || m.media_type === 'CAROUSEL_ALBUM');
    const wrapper = document.getElementById('posts-wrapper');
    const countEl = document.getElementById('posts-count');
    if (countEl) countEl.textContent = posts.length + ' posts';

    if (!wrapper) return;
    if (!posts.length) {
        wrapper.innerHTML = '<div class="swiper-slide"><p style="color:var(--dust);font-size:0.78rem;">No posts found.</p></div>';
        return;
    }

    wrapper.innerHTML = posts.map(p => {
        const isAlbum = p.media_type === 'CAROUSEL_ALBUM';
        const children = isAlbum ? albumChildren[p.id] : [];
        const albumData = isAlbum ? b64Encode(JSON.stringify(children)) : '';

        return `
      <div class="swiper-slide">
        <div class="post-card">
            <div class="post-img-wrap" onclick="openLightbox('${p.media_url}', '${escCap(p.caption)}', '${p.media_type}', '${albumData}')">
                ${isAlbum ? `<div class="album-badge">1 / ${children.length}</div><div class="album-icon-overlay">⧉</div>` : ''}
                <img src="${p.media_url}" alt="Post" id="post-cover-${p.id}" loading="lazy">
            </div>
            <div class="post-body">
                <div class="post-meta">
                    <span class="post-date">${formatDate(p.timestamp)}</span>
                    ${p.like_count ? `<span class="post-likes">♥ ${p.like_count}</span>` : ''}
                </div>
                <p class="post-caption">${truncate(p.caption)}</p>
                ${isAlbum ? `
                    <div class="thumb-strip">
                    ${children.map((child, idx) => `
                        <div class="thumb-item ${idx === 0 ? 'active' : ''}" 
                            onclick="updatePostPreview('${p.id}', '${child.media_url}', ${idx}, '${escCap(p.caption)}', '${albumData}')">
                        <img src="${child.media_type === 'VIDEO' ? (child.thumbnail_url || child.media_url) : child.media_url}" loading="lazy">
                        </div>
                    `).join('')}
                    </div>
                ` : ''}
            </div>
        </div>
      </div>
    `}).join('');

    new Swiper('#posts-container', {
        slidesPerView: 1.6, spaceBetween: 12,
        navigation: { nextEl: '.posts-next', prevEl: '.posts-prev' },
        breakpoints: { 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 }, 1400: { slidesPerView: 4 } },
        grabCursor: true
    });
}

function updatePostPreview(postId, url, idx, caption, albumDataB64) {
    const img = document.getElementById(`post-cover-${postId}`);
    if (img) img.src = url;
    const card = img.closest('.post-card');
    card.querySelectorAll('.thumb-item').forEach((t, i) => { t.classList.toggle('active', i === idx); });
    const badge = card.querySelector('.album-badge');
    const children = JSON.parse(b64Decode(albumDataB64));
    if (badge) badge.textContent = `${idx + 1} / ${children.length}`;
    const wrap = card.querySelector('.post-img-wrap');
    wrap.onclick = () => openLightbox(url, caption, children[idx].media_type, albumDataB64, idx);
}

function renderGallery(filter) {
    if (filter) galleryFilter = filter;
    let container = document.getElementById('gallery-container');
    if (!container) return;

    let items = [];
    allMedia.forEach(m => {
        if (m.media_type === 'CAROUSEL_ALBUM') {
            const children = albumChildren[m.id] || [];
            children.forEach((child, idx) => {
                items.push({ ...child, caption: m.caption, isAlbumChild: true, parentAlbum: children, childIdx: idx });
            });
        } else {
            items.push(m);
        }
    });

    let displayItems = items.slice(0, CONFIG.GALLERY_LIMIT * 2);
    if (galleryFilter !== 'all') {
        displayItems = displayItems.filter(m => {
            if (galleryFilter === 'CAROUSEL_ALBUM') return m.isAlbumChild;
            return m.media_type === galleryFilter;
        });
    }

    const countEl = document.getElementById('gallery-count');
    if (countEl) countEl.textContent = displayItems.length + ' items';

    if (!displayItems.length) {
        container.innerHTML = '<p style="color:var(--dust);font-size:0.78rem;column-span:all;">No items found.</p>';
        return;
    }

    container.innerHTML = displayItems.map(m => {
        const albumData = m.parentAlbum ? b64Encode(JSON.stringify(m.parentAlbum)) : '';
        return `
    <div class="gallery-item" onclick="openLightbox('${m.media_url}','${escCap(m.caption)}', '${m.media_type}', '${albumData}', ${m.childIdx || 0})">
      <img src="${m.media_type === 'VIDEO' ? (m.thumbnail_url || m.media_url) : m.media_url}" alt="Gallery" loading="lazy">
      ${m.isAlbumChild ? '<div class="gallery-pos-dot"></div>' : ''}
      <div class="gallery-item-overlay">
        <div class="gallery-view-icon">${m.media_type === 'VIDEO' ? '▶' : (m.isAlbumChild ? '⧉' : '+')}</div>
      </div>
    </div>
  `}).join('');
}

function escCap(str) {
    if (!str) return '';
    return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '&quot;').replace(/\n/g, ' ').slice(0, 200);
}

function b64Encode(str) { return btoa(unescape(encodeURIComponent(str))); }
function b64Decode(str) { return decodeURIComponent(escape(atob(str))); }

function showTokenSetup() {
    const banner = document.getElementById('setupBanner');
    if (banner) banner.style.display = 'block';
}

function applyToken() {
    const t = document.getElementById('tokenInput')?.value?.trim();
    if (!t) return;
    CONFIG.ACCESS_TOKEN = t;
    const banner = document.getElementById('setupBanner');
    if (banner) banner.style.display = 'none';
    fetchInstagram();
}

function showError(msg) {
    console.error('Instagram Error:', msg);
    const gallery = document.getElementById('gallery-container');
    if (gallery) gallery.innerHTML = `<p style="color:var(--fire); text-align:center; padding: 2rem; width: 100%;">Failed to load Instagram feed.</p>`;
    const posts = document.getElementById('posts-wrapper');
    if (posts) posts.innerHTML = `<div class="swiper-slide"><p style="color:var(--fire); font-size:0.8rem;">Failed to load posts.</p></div>`;
    const reels = document.getElementById('reels-wrapper');
    if (reels) reels.innerHTML = `<div class="swiper-slide"><p style="color:var(--fire); font-size:0.8rem;">Failed to load reels.</p></div>`;
}

// ============================================================
// LIGHTBOX & SLIDER
// ============================================================
let baseCaption = '';

function openLightbox(src, caption, type = 'IMAGE', albumData = '', index = 0) {
    const lb = document.getElementById('lightbox');
    if (!lb) return;
    baseCaption = caption;
    if (albumData) { currentAlbumItems = JSON.parse(b64Decode(albumData)); } 
    else { currentAlbumItems = [{ media_url: src, media_type: type }]; }
    currentSlideIndex = index;
    renderSlide();
    lb.classList.remove('hidden');
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
    const prev = document.getElementById('slider-prev');
    const next = document.getElementById('slider-next');
    if (prev) prev.style.display = currentAlbumItems.length > 1 ? 'block' : 'none';
    if (next) next.style.display = currentAlbumItems.length > 1 ? 'block' : 'none';
}

function renderSlide() {
    const item = currentAlbumItems[currentSlideIndex];
    const img = document.getElementById('lightbox-img');
    const videoWrap = document.getElementById('video-wrapper');
    const cap = document.getElementById('lightbox-caption');

    if (img) img.style.display = 'none';
    if (videoWrap) videoWrap.style.display = 'none';
    player.pause();

    if (item.media_type === 'VIDEO') {
        player.source = { type: 'video', sources: [{ src: item.media_url, type: 'video/mp4' }] };
        if (videoWrap) videoWrap.style.display = 'block';
        player.once('ready', () => player.play());
    } else {
        if (img) { img.src = item.media_url; img.style.display = 'block'; }
    }

    let capText = baseCaption;
    if (currentAlbumItems.length > 1) { capText += ` · Photo ${currentSlideIndex + 1} of ${currentAlbumItems.length}`; }
    if (cap) cap.textContent = capText;
}

function prevSlide() {
    if (currentAlbumItems.length <= 1) return;
    currentSlideIndex = (currentSlideIndex - 1 + currentAlbumItems.length) % currentAlbumItems.length;
    renderSlide();
}

function nextSlide() {
    if (currentAlbumItems.length <= 1) return;
    currentSlideIndex = (currentSlideIndex + 1) % currentAlbumItems.length;
    renderSlide();
}

function closeLightbox() {
    const lb = document.getElementById('lightbox');
    if (!lb) return;
    player.pause();
    lb.classList.remove('active');
    lb.classList.add('hidden');
    document.body.style.overflow = '';
    currentAlbumItems = [];
    currentSlideIndex = 0;
}

// Global expose
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.prevSlide = prevSlide;
window.nextSlide = nextSlide;
window.updatePostPreview = updatePostPreview;
window.applyToken = applyToken;

// ============================================================
// CUSTOM CURSOR & FILTERS
// ============================================================
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let curX = 0, curY = 0;

document.addEventListener('mousemove', e => {
    curX = e.clientX; curY = e.clientY;
    if (cursor) { cursor.style.left = curX + 'px'; cursor.style.top = curY + 'px'; }
    if (ring) { ring.style.left = curX + 'px'; ring.style.top = curY + 'px'; }
});

document.addEventListener('mouseover', e => {
    if (e.target.closest('a, button, .reel-card, .post-card, .gallery-item')) {
        if (ring) { ring.style.width = '52px'; ring.style.height = '52px'; ring.style.opacity = '0.5'; }
    }
});

document.addEventListener('mouseout', e => {
    if (e.target.closest('a, button, .reel-card, .post-card, .gallery-item')) {
        if (ring) { ring.style.width = '32px'; ring.style.height = '32px'; ring.style.opacity = '1'; }
    }
});

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        renderGallery(this.dataset.filter);
    });
});

document.addEventListener('keydown', e => {
    if (document.getElementById('lightbox')?.classList.contains('active')) {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'Escape') closeLightbox();
    }
});

const observer = new IntersectionObserver(entries => {
    entries.forEach((e, i) => { if (e.isIntersecting) { setTimeout(() => e.target.classList.add('visible'), i * 80); } });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// Initialize on page load is handled by the preloader callback calling initSite()
