class AccessibleSlider {
    constructor(sliderElement) {
        this.slider = sliderElement;
        this.track = this.slider.querySelector('.c-slider__track');
        this.slides = Array.from(this.slider.querySelectorAll('.c-slider__slide'));
        this.btnNext = this.slider.querySelector('.btn-next');
        this.btnPrev = this.slider.querySelector('.btn-prev');
        
        this.currentIndex = 0;
        this.init();
    }

    init() {
        this.btnNext.addEventListener('click', () => this.move(1));
        this.btnPrev.addEventListener('click', () => this.move(-1));

        this.slider.setAttribute('tabindex', '0'); 
        this.slider.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') this.move(1);
            if (e.key === 'ArrowLeft') this.move(-1);
        });

        this.updateARIA();
    }

    move(direction) {
        this.currentIndex += direction;
        
        if (this.currentIndex < 0) this.currentIndex = 0;
        if (this.currentIndex >= this.slides.length) this.currentIndex = this.slides.length - 1;

        this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
        this.updateARIA();
    }

    updateARIA() {
        this.slides.forEach((slide, index) => {
            if (index === this.currentIndex) {
                slide.setAttribute('aria-hidden', 'false');
            } else {
                slide.setAttribute('aria-hidden', 'true');
            }
        });
    }
}

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser les sliders
    document.querySelectorAll('.c-slider').forEach(slider => {
        new AccessibleSlider(slider);
    });

    // Gestion de l'audio d'ambiance
    const audioToggle = document.getElementById('audio-toggle');
    const bgAudio = document.getElementById('bg-audio');
    let isPlaying = false;

    if (audioToggle && bgAudio) {
        audioToggle.addEventListener('click', () => {
            if (isPlaying) {
                bgAudio.pause();
                audioToggle.innerHTML = "🔇 Activer l'expérience sonore";
            } else {
                bgAudio.play();
                audioToggle.innerHTML = "🔊 Désactiver le son";
            }
            isPlaying = !isPlaying;
        });
    }
});