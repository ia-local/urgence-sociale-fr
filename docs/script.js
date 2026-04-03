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
    // 1. Initialiser les sliders
    document.querySelectorAll('.c-slider').forEach(slider => {
        new AccessibleSlider(slider);
    });

    // 2. Gestion de la Playlist Audio Dynamique (GitHub API)
    const audioToggle = document.getElementById('audio-toggle');
    const bgAudio = document.getElementById('bg-audio');
    
    let isPlaying = false;
    let playlist = [];
    let currentTrackIndex = 0;

    // Fonction pour charger la liste des musiques depuis GitHub
    async function fetchPlaylist() {
        try {
            // Requête vers l'API GitHub pour lister le contenu du dossier 'media'
            const response = await fetch('https://api.github.com/repos/ia-local/urgence-sociale-fr/contents/media');
            
            if (response.ok) {
                const files = await response.json();
                
                // On filtre pour ne garder que les fichiers .mp3 et on crée les chemins locaux
                playlist = files
                    .filter(file => file.name.endsWith('.mp3'))
                    .map(file => `./media/${file.name}`);

                console.log("🎵 Playlist chargée :", playlist);

                // On charge le premier morceau dans le lecteur s'il y a des fichiers
                if (playlist.length > 0) {
                    bgAudio.src = playlist[0];
                }
            }
        } catch (error) {
            console.error("Impossible de récupérer la playlist dynamiquement :", error);
        }
    }

    // On lance la récupération dès le chargement de la page
    fetchPlaylist();

    // 3. Gestion du bouton Play/Pause
    if (audioToggle && bgAudio) {
        audioToggle.addEventListener('click', () => {
            if (playlist.length === 0) {
                audioToggle.innerHTML = "⚠️ Chargement des pistes...";
                return;
            }

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

    // 4. Passage automatique au morceau suivant (Boucle de lecture)
    if (bgAudio) {
        bgAudio.addEventListener('ended', () => {
            currentTrackIndex++;
            
            // Si on arrive à la fin de la playlist, on recommence au début
            if (currentTrackIndex >= playlist.length) {
                currentTrackIndex = 0;
            }
            
            // Charge la nouvelle source et lance la lecture
            bgAudio.src = playlist[currentTrackIndex];
            bgAudio.play();
        });
    }
});