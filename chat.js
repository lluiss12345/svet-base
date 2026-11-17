const SERVER_URL = 'https://' + 'completely-determined-boatbill' + '.cloudpub.ru';

document.addEventListener('DOMContentLoaded', () => {
    const messagesContainer = document.getElementById('chatMessages');
    const input = document.getElementById('chatInput');
    const send = document.getElementById('chatSend');
    const clearBtn = document.getElementById('chatClear');

    function addMessage(text, sender) {
        const div = document.createElement('div');
        div.className = `msg ${sender}`;
        div.textContent = text;
        messagesContainer.appendChild(div);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Загрузка истории при старте
    async function loadHistory() {
        try {
            const res = await fetch(SERVER_URL + '/history');
            const data = await res.json();
            if (data.history && data.history.length > 0) {
                messagesContainer.innerHTML = ''; // Очищаем приветствие
                data.history.forEach(msg => {
                    addMessage(msg.text, msg.role === 'user' ? 'user' : 'bot');
                });
            }
        } catch (e) {
            console.error('Не удалось загрузить историю:', e);
        }
    }

    async function askAI() {
        const question = input.value.trim();
        if (!question) return;

        addMessage(question, 'user');
        input.value = '';

        const thinkingDiv = document.createElement('div');
        thinkingDiv.className = 'msg bot';
        thinkingDiv.innerHTML = '<i>Думаю...</i>';
        messagesContainer.appendChild(thinkingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        try {
            const res = await fetch(SERVER_URL + '/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question })
            });
            const data = await res.json();
            thinkingDiv.remove();
            addMessage(data.answer || data.error || 'Нет ответа', 'bot');
        } catch (e) {
            thinkingDiv.remove();
            addMessage('Ошибка: не удалось связаться с сервером.', 'bot');
        }
    }

    // Очистка чата
    if (clearBtn) {
        clearBtn.addEventListener('click', async () => {
            if (!confirm('Очистить всю историю чата?')) return;
            try {
                await fetch(SERVER_URL + '/clear-history', { method: 'POST' });
                messagesContainer.innerHTML = '';
                addMessage('Привет! Я ассистент отеля. Задайте вопрос.', 'bot');
            } catch (e) {
                alert('Не удалось очистить историю');
            }
        });
    }

    send.addEventListener('click', askAI);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') askAI();
    });

    loadHistory();
});
