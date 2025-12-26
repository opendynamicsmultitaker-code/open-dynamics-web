/* 
   OPEN DYNAMICS LOGIC ENGINE
   Handles Theme, Modals, Email, and Payments
*/

// --- CONFIGURATION (REPLACE THESE WITH YOUR EMAILJS DATA) ---
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";  // From Account > API Keys
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";  // From Email Services
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID"; // From Email Templates

// --- LINKS ---
const LINK_FREE = "https://drive.google.com/file/d/145V3IW2AkO25dQHicwWkh9ffPjomh13E/view?usp=sharing";
const LINK_PRO = "https://buy.stripe.com/aFadRb83Fgrq16l7t56EU01";
const LINK_STUDIO = "https://buy.stripe.com/3cIbJ3cjV5MMdT76p16EU00";

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }

    // 2. Theme Toggle Logic
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

    // 3. Purchase Logic
    const modal = document.getElementById('email-modal');
    const modalTitle = document.getElementById('modal-title');
    const emailInput = document.getElementById('user-email');
    const confirmBtn = document.getElementById('confirm-purchase');
    const closeBtn = document.querySelector('.close-modal');
    
    let selectedProduct = null;

    // Open Modal Function
    window.openPurchaseModal = (product) => {
        if (product === 'FREE') {
            // Direct download for free
            window.open(LINK_FREE, '_blank');
            return;
        }
        
        selectedProduct = product;
        modalTitle.innerText = `Get ${product} Edition`;
        modal.classList.add('active');
    };

    // Close Modal
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    // Confirm Purchase & Send Email
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            const email = emailInput.value.trim();
            
            if (!validateEmail(email)) {
                alert("Please enter a valid email address.");
                return;
            }

            confirmBtn.innerText = "Processing...";
            confirmBtn.disabled = true;

            // Send Email to YOU (Bot)
            const templateParams = {
                product_name: selectedProduct,
                user_email: email
            };

            emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
                .then(() => {
                    // Success - Redirect to Stripe
                    redirectToStripe(selectedProduct, email);
                }, (error) => {
                    console.error('EmailJS Error:', error);
                    // Even if email fails, let them buy (don't lose the sale)
                    redirectToStripe(selectedProduct, email);
                });
        });
    }

    function redirectToStripe(product, email) {
        let baseUrl = (product === 'PRO') ? LINK_PRO : LINK_STUDIO;
        
        // Append email to Stripe URL for pre-filling
        const finalUrl = `${baseUrl}?prefilled_email=${encodeURIComponent(email)}`;
        
        window.location.href = finalUrl;
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
});
