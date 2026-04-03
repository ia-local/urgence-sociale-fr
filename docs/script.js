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

    // === GESTION DE LA PLAYLIST AUDIO D'AMBIANCE ===
    const audioToggle = document.getElementById('audio-toggle');
    const bgAudio = document.getElementById('bg-audio');
    
    // Ta playlist générée par IA
    const playlist = [
        "media/Croissance Nécropole.mp3",
        "media/Le Code du Soulèvement.mp3",
        "media/Game Over (La Mise sous Tutelle).mp3",
        "media/Le Coût de l'Oubli.mp3",
        "media/Il parle de la guerre.mp3",
        "media/Le Prix de la Peur.mp3",
        "media/L'Addition (Le Sang et l'Impôt).mp3",
        "media/Le Prix de ton Armure.mp3",
        "media/Le Code de l'Espoir.mp3",
        "media/Ton Prix, Notre Mort.mp3"
    ];

    let currentTrackIndex = 0;
    let isPlaying = false;

    if (audioToggle && bgAudio) {
        // On s'assure de désactiver la boucle sur la balise pour pouvoir passer à la chanson suivante
        bgAudio.loop = false;
        
        // Initialisation de la première piste
        bgAudio.src = playlist[currentTrackIndex];

        // Gestion du bouton de lecture
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

        // Détection automatique de la fin d'une piste pour lire la suivante
        bgAudio.addEventListener('ended', () => {
            currentTrackIndex++;
            
            // Si on a joué toute la playlist, on boucle à la première chanson
            if (currentTrackIndex >= playlist.length) {
                currentTrackIndex = 0;
            }
            
            // Chargement de la piste suivante
            bgAudio.src = playlist[currentTrackIndex];
            
            // On lance la lecture uniquement si le lecteur était déjà activé par l'utilisateur
            if (isPlaying) {
                bgAudio.play();
            }
        });
    }
});