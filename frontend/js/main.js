document.addEventListener('DOMContentLoaded', function() {
    const counterElement = document.getElementById('counter');
    const incrementBtn = document.getElementById('increment-btn');

    async function getCount() {
        try {
            const response = await fetch('/api/views');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            counterElement.textContent = data.views;
        } catch (error) {
            console.error('Error fetching counter:', error);
            counterElement.textContent = '!';
        }
    }

    async function increment() {
        try {
            const response = await fetch('/api/views', { method: 'POST' });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            counterElement.textContent = data.views;

            // Quick scale animation
            counterElement.classList.add('bump');
            setTimeout(() => counterElement.classList.remove('bump'), 150);
        } catch (error) {
            console.error('Error incrementing:', error);
        }
    }

    getCount();
    incrementBtn.addEventListener('click', increment);
});
