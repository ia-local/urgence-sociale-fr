document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('chat-modal');
    const btnOpen = document.getElementById('btn-open-chat');
    const btnClose = document.getElementById('btn-close-chat');
    const backdrop = document.getElementById('modal-backdrop');
    
    const input = document.getElementById('chat-input');
    const btnSend = document.getElementById('btn-send-chat');
    const history = document.getElementById('chat-history');

    // FONCTIONS MODAL
    function showModal() {
        modal.classList.remove('c-modal--hidden');
        input.focus();
    }

    function hideModal() {
        modal.classList.add('c-modal--hidden');
    }

    // ÉCOUTEURS D'ÉVÉNEMENTS MODAL
    btnOpen.addEventListener('click', showModal);
    btnClose.addEventListener('click', hideModal);
    backdrop.addEventListener('click', hideModal);

    // Écouteur d'échappement (ESCAPE)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('c-modal--hidden')) {
            hideModal();
        }
    });

    // LOGIQUE CHATBOT (Fetch API)
    async function sendMessage() {
        const text = input.value.trim();
        if (!text) return;

        // Affichage User
        history.innerHTML += `<p class="chat-msg chat-msg--user">${text}</p>`;
        input.value = '';
        history.scrollTop = history.scrollHeight;

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });
            const data = await response.json();
            
            // Affichage IA
            history.innerHTML += `<p class="chat-msg chat-msg--sys">${data.response}</p>`;
            history.scrollTop = history.scrollHeight;
        } catch (error) {
            history.innerHTML += `<p class="chat-msg chat-msg--sys" style="color: red;">Erreur: Le serveur local doit être allumé pour générer les réponses.</p>`;
        }
    }

    btnSend.addEventListener('click', sendMessage);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
});