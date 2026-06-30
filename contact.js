// Contact Form Validation
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.nameInput = document.getElementById('name');
        this.emailInput = document.getElementById('email');
        this.phoneInput = document.getElementById('phone');
        this.messageInput = document.getElementById('message');
        this.charCount = document.getElementById('char-count');
        this.formStatus = document.getElementById('form-status');
        
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.messageInput.addEventListener('input', (e) => this.updateCharCount(e));
    }

    handleSubmit(e) {
        e.preventDefault();
        
        // Clear previous error messages
        this.clearErrors();
        
        // Get form values
        const name = this.nameInput.value.trim();
        const email = this.emailInput.value.trim();
        const phone = this.phoneInput.value.trim();
        const message = this.messageInput.value.trim();

        // Validate form
        let isValid = true;

        if (!this.validateName(name)) {
            isValid = false;
        }

        if (!this.validateEmail(email)) {
            isValid = false;
        }

        if (!this.validatePhone(phone)) {
            isValid = false;
        }

        if (!this.validateMessage(message)) {
            isValid = false;
        }

        // If all validations pass
        if (isValid) {
            this.submitForm(name, email, phone, message);
        }
    }

    validateName(name) {
        if (name === '') {
            this.showError('name-error', 'Full name is required');
            return false;
        }
        if (name.length < 2) {
            this.showError('name-error', 'Name must be at least 2 characters');
            return false;
        }
        return true;
    }

    validateEmail(email) {
        if (email === '') {
            this.showError('email-error', 'Email address is required');
            return false;
        }
        
        // Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showError('email-error', 'Please enter a valid email address');
            return false;
        }
        return true;
    }

    validatePhone(phone) {
        if (phone === '') {
            this.showError('phone-error', 'Phone number is required');
            return false;
        }

        // Phone validation - only digits
        const phoneRegex = /^\d{10,15}$/;
        if (!phoneRegex.test(phone)) {
            this.showError('phone-error', 'Phone number must contain only digits (10-15 digits)');
            return false;
        }
        return true;
    }

    validateMessage(message) {
        if (message === '') {
            this.showError('message-error', 'Message is required');
            return false;
        }
        if (message.length < 10) {
            this.showError('message-error', 'Message must be at least 10 characters');
            return false;
        }
        return true;
    }

    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    clearErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(el => {
            el.textContent = '';
            el.style.display = 'none';
        });
        this.formStatus.textContent = '';
        this.formStatus.className = 'form-status';
    }

    updateCharCount(e) {
        const count = e.target.value.length;
        this.charCount.textContent = `${count}/1000`;
    }

    submitForm(name, email, phone, message) {
        // Simulate form submission
        this.formStatus.textContent = 'Sending your message...';
        this.formStatus.className = 'form-status pending';

        // Simulate server request delay
        setTimeout(() => {
            // Success message
            this.formStatus.textContent = 'Thank you! Your message has been sent successfully. I will get back to you soon.';
            this.formStatus.className = 'form-status success';

            // Log the data (in a real app, this would be sent to a server)
            console.log('Form Data:', { name, email, phone, message });

            // Reset the form
            this.form.reset();
            this.charCount.textContent = '0/1000';

            // Clear success message after 5 seconds
            setTimeout(() => {
                this.formStatus.textContent = '';
                this.formStatus.className = 'form-status';
            }, 5000);
        }, 1500);
    }
}

// Initialize the contact form when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ContactForm();
});