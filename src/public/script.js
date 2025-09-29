// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', currentTheme);
    
    // Update theme toggle icon
    updateThemeIcon(currentTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
    
    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }
});

// Password Toggle Functionality
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.querySelector('.toggle-password i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.className = 'fas fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        toggleIcon.className = 'fas fa-eye';
    }
}

// Username Input Handling (replacing RUT functionality)
document.getElementById('username').addEventListener('input', function(e) {
    // Simple username validation - allow letters, numbers, and basic characters
    let value = e.target.value.replace(/[^a-zA-Z0-9._-]/g, '');
    e.target.value = value;
});

// Login Form Submission
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        showMessage('Por favor complete todos los campos', 'error');
        return;
    }
    
    // Clear any existing URL parameters
    if (window.location.search) {
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showMessage('Acceso autorizado. Redirigiendo...', 'success');
            // Clear form on success
            document.getElementById('loginForm').reset();
            setTimeout(() => {
                // Use the redirect URL from server response, fallback to dashboard
                const redirectUrl = result.redirect || '/dashboard';
                window.location.href = redirectUrl;
            }, 1500);
        } else {
            showMessage(result.message || 'Credenciales inválidas', 'error');
            // Clear password field on error
            document.getElementById('password').value = '';
            // Focus back to username field
            document.getElementById('username').focus();
            
            // Redirect to home page after showing error message
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error de conexión. Intente nuevamente.', 'error');
        // Clear password field on error
        document.getElementById('password').value = '';
        // Focus back to username field
        document.getElementById('username').focus();
    }
});

// Flash Message System
class FlashMessage {
    static show(message, type = 'success', duration = 5000) {
        const container = this.getContainer();
        const flashElement = this.createElement(message, type);
        
        container.appendChild(flashElement);
        
        // Auto remove after duration
        setTimeout(() => {
            this.remove(flashElement);
        }, duration);
        
        return flashElement;
    }
    
    static getContainer() {
        let container = document.querySelector('.flash-messages');
        if (!container) {
            container = document.createElement('div');
            container.className = 'flash-messages';
            document.body.appendChild(container);
        }
        return container;
    }
    
    static createElement(message, type) {
        const flashElement = document.createElement('div');
        flashElement.className = `flash-message ${type}`;
        
        const icon = this.getIcon(type);
        
        flashElement.innerHTML = `
            <i class="${icon}"></i>
            <span>${message}</span>
            <button class="flash-close" onclick="FlashMessage.remove(this.parentElement)">×</button>
        `;
        
        return flashElement;
    }
    
    static getIcon(type) {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        return icons[type] || icons.info;
    }
    
    static remove(element) {
        element.classList.add('removing');
        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }, 300);
    }
    
    static success(message, duration) {
        return this.show(message, 'success', duration);
    }
    
    static error(message, duration) {
        return this.show(message, 'error', duration);
    }
    
    static warning(message, duration) {
        return this.show(message, 'warning', duration);
    }
}

// Show Message Function (Legacy support)
function showMessage(text, type) {
    FlashMessage.show(text, type);
}

// Accessibility Features
document.addEventListener('keydown', function(e) {
    // Enter key on form elements
    if (e.key === 'Enter') {
        const activeElement = document.activeElement;
        if (activeElement.tagName === 'INPUT') {
            const form = activeElement.closest('form');
            if (form) {
                form.dispatchEvent(new Event('submit'));
            }
        }
    }
});

// Font Size Toggle (Accessibility)
document.querySelector('.font-size-btn').addEventListener('click', function() {
    const currentSize = localStorage.getItem('fontSize') || 'normal';
    const newSize = currentSize === 'normal' ? 'large' : 'normal';
    
    document.documentElement.style.fontSize = newSize === 'large' ? '18px' : '16px';
    localStorage.setItem('fontSize', newSize);
    
    this.querySelector('span').textContent = newSize === 'large' ? 'A-' : 'A+';
});

// Load saved font size
document.addEventListener('DOMContentLoaded', function() {
    const savedFontSize = localStorage.getItem('fontSize') || 'normal';
    if (savedFontSize === 'large') {
        document.documentElement.style.fontSize = '18px';
        document.querySelector('.font-size-btn span').textContent = 'A-';
    }
});