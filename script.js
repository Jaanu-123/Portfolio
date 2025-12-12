document.addEventListener('DOMContentLoaded', () => {

    // --- Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.gallery-item, .hero-content, .section-title, .about-content');
    animatedElements.forEach(el => observer.observe(el));


    // --- Lightbox Functionality ---
    const galleryItems = document.querySelectorAll('.gallery-item');

    // Create Lightbox DOM elements dynamically
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.className = 'lightbox';

    // Container for content (Image or Video)
    const lightboxContent = document.createElement('div');
    lightboxContent.className = 'lightbox-content';
    lightbox.appendChild(lightboxContent);

    const closeBtn = document.createElement('span');
    closeBtn.className = 'close-btn';
    closeBtn.innerHTML = '&times;';
    lightbox.appendChild(closeBtn);

    document.body.appendChild(lightbox);

    const style = document.createElement('style');
    style.textContent = `
        .lightbox {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.95);
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .lightbox.active {
            display: flex;
            opacity: 1;
        }
        .lightbox-content {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 90%;
            height: 90%;
        }
        .lightbox img, .lightbox video {
            max-width: 100%;
            max-height: 100%;
            box-shadow: 0 0 50px rgba(0,0,0,0.5);
            border: 2px solid #333;
            animation: zoomIn 0.3s ease;
        }
        @keyframes zoomIn {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        .close-btn {
            position: absolute;
            top: 20px;
            right: 40px;
            font-size: 50px;
            color: white;
            cursor: pointer;
            transition: color 0.3s;
            z-index: 1001;
        }
        .close-btn:hover {
            color: var(--accent-color, #ff007f);
        }
    `;
    document.head.appendChild(style);


    // Event Listeners
    galleryItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            lightboxContent.innerHTML = ''; // Clear previous content

            const videoSrc = item.getAttribute('data-video-src');

            if (videoSrc) {
                // It's a video
                const video = document.createElement('video');
                video.src = videoSrc;
                video.controls = true;
                video.autoplay = true;
                lightboxContent.appendChild(video);
            } else {
                // It's an image
                const img = document.createElement('img');
                img.src = item.querySelector('img').src;
                lightboxContent.appendChild(img);
            }

            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Disable scroll
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Enable scroll
        lightboxContent.innerHTML = ''; // Stop video playback
    };

    closeBtn.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target === lightboxContent) {
            closeLightbox();
        }
    });

    // --- Smooth Scroll for Anchors ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
