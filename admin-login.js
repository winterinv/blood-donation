document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const btn = document.querySelector('.submit-btn');

        // MVP Admin Bypass to show the dashboard immediately
        if (email === 'admin@bloodbuddy.com' && password === 'admin123') {
            btn.textContent = 'Authenticating...';
            btn.style.opacity = '0.7';

            // Simulate network request
            setTimeout(() => {
                // Set local flag
                localStorage.setItem('bb_admin_auth', 'true');
                window.location.href = 'admin.html';
            }, 800);
        } else {
            alert('Invalid Administrator Credentials. For demo, use: admin@bloodbuddy.com / admin123');
        }
    });
});
