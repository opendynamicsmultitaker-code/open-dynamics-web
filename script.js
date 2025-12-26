document.addEventListener('DOMContentLoaded', () => {
    // --- THEME TOGGLE LOGIC ---
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

// --- PAYMENT & DOWNLOAD LOGIC ---

// Configuration
const LINKS = {
    free: "https://drive.google.com/file/d/145V3IW2AkO25dQHicwWkh9ffPjomh13E",
    pro: "https://buy.stripe.com/aFadRb83Fgrq16l7t56EU01",
    studio: "https://buy.stripe.com/3cIbJ3cjV5MMdT76p16EU00"
};

let selectedProduct = null;

function initiateCheckout(product) {
    // FREE VERSION: Direct Download
    if (product === 'free') {
        window.open(LINKS.free, '_blank');
        return;
    }

    // PRO & STUDIO: Open Email Modal
    selectedProduct = product;
    document.getElementById('checkout-modal').style.display = 'flex';
    document.getElementById('user-email').focus();
}

function closeCheckout() {
    document.getElementById('checkout-modal').style.display = 'none';
    selectedProduct = null;
}

function proceedToPayment() {
    const emailInput = document.getElementById('user-email');
    const email = emailInput.value.trim();

    // Basic Validation
    if (!email || !email.includes('@') || !email.includes('.')) {
        alert("Please enter a valid email address to receive your license key.");
        return;
    }

    // Determine Stripe Link
    let stripeUrl = "";
    if (selectedProduct === 'pro') stripeUrl = LINKS.pro;
    else if (selectedProduct === 'studio') stripeUrl = LINKS.studio;

    // Append Email for Stripe Pre-filling
    // Stripe uses 'prefilled_email' parameter to capture this
    const finalUrl = `${stripeUrl}?prefilled_email=${encodeURIComponent(email)}`;

    // Redirect
    window.location.href = finalUrl;
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('checkout-modal');
    if (event.target == modal) {
        closeCheckout();
    }
}
