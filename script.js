document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const rootElement = document.documentElement;

    // Vérifie si un thème était déjà sauvegardé dans le navigateur
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        rootElement.setAttribute('data-theme', 'dark');
        themeToggleBtn.textContent = '☀️';
    }

    // Changement de thème au clic
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = rootElement.getAttribute('data-theme');
        
        if (currentTheme === 'dark') {
            rootElement.removeAttribute('data-theme');
            themeToggleBtn.textContent = '🌙';
            localStorage.setItem('theme', 'light');
        } else {
            rootElement.setAttribute('data-theme', 'dark');
            themeToggleBtn.textContent = '☀️';
            localStorage.setItem('theme', 'dark');
        }
    });
});