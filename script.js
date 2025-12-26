document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('theme-toggle');
    const body = document.body;
    
    const currentTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (currentTheme === 'dark' || (!currentTheme && systemPrefersDark)) {
        body.setAttribute('data-theme', 'dark');
        toggleButton.textContent = 'Light Mode';
    } else {
        body.setAttribute('data-theme', 'light');
        toggleButton.textContent = 'Dark Mode';
    }

    toggleButton.addEventListener('click', () => {
        if (body.getAttribute('data-theme') === 'dark') {
            body.setAttribute('data-theme', 'light');
            toggleButton.textContent = 'Dark Mode';
            localStorage.setItem('theme', 'light');
        } else {
            body.setAttribute('data-theme', 'dark');
            toggleButton.textContent = 'Light Mode';
            localStorage.setItem('theme', 'dark');
        }
    });
});
