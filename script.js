// --- GLOBAL VARIABLES ---
let currentStripeUrl = "";

// --- THEME LOGIC ---
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

// --- PURCHASE MODAL LOGIC (GLOBAL SCOPE) ---

function openPurchaseModal(version, stripeUrl) {
    console.log("Opening modal for:", version); // Debug check
    currentStripeUrl = stripeUrl;
    
    // Set hidden input value for the email bot
    const productInput = document.getElementById('productInput');
    if (productInput) {
        productInput.value = "INTENT TO BUY: " + version;
    }
    
    // Show Modal by adding 'active' class
    const modal = document.getElementById('emailModal');
    if (modal) {
        modal.classList.add('active');
    } else {
        console.error("Modal element not found!");
    }
}

function closePurchaseModal() {
    const modal = document.getElementById('emailModal');
    if (modal) modal.classList.remove('active');
}

function submitPurchaseForm(event) {
    event.preventDefault(); // Stop default form reload
    
    const emailField = document.getElementById('emailInput');
    const productField = document.getElementById('productInput');
    const btn = event.target.querySelector('button');
    
    if (!emailField || !productField) return;

    // Visual feedback
    btn.textContent = "Redirecting...";
    btn.disabled = true;
    btn.style.opacity = "0.7";

    const email = emailField.value;
    const product = productField.value;

    // Send data to FormSubmit (The Bot)
    // NOTE: Check your email (opendynamicsmultitaker@gmail.com) the first time you test this!
    // FormSubmit will ask you to confirm the activation.
    fetch("https://formsubmit.co/ajax/opendynamicsmultitaker@gmail.com", {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            message: "NEW CUSTOMER: " + email + " wants to buy " + product
        })
    })
    .then(response => {
        console.log("Email sent successfully.");
        // Redirect to Stripe regardless of email success
        window.location.href = currentStripeUrl;
    })
    .catch(error => {
        console.error('Error sending email notification:', error);
        // Fallback: Redirect anyway so we don't lose the sale
        window.location.href = currentStripeUrl;
    });
}

// Close modal if clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('emailModal');
    if (event.target == modal) {
        closePurchaseModal();
    }
}
