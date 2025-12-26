// GLOBAL VARIABLES FOR PURCHASE FLOW
let currentStripeUrl = "";

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

// --- PURCHASE MODAL LOGIC ---

function openPurchaseModal(version, stripeUrl) {
    currentStripeUrl = stripeUrl;
    
    // Set hidden input value for the email bot
    document.getElementById('productInput').value = "INTENT TO BUY: " + version;
    
    // Show Modal
    const modal = document.getElementById('emailModal');
    modal.classList.add('active');
}

function closePurchaseModal() {
    const modal = document.getElementById('emailModal');
    modal.classList.remove('active');
}

function submitPurchaseForm(event) {
    event.preventDefault(); // Stop default form reload
    
    const email = document.getElementById('emailInput').value;
    const product = document.getElementById('productInput').value;
    const btn = event.target.querySelector('button');
    
    // Visual feedback
    const originalText = btn.textContent;
    btn.textContent = "Redirecting...";
    btn.disabled = true;

    // Send data to FormSubmit (The Bot)
    fetch("https://formsubmit.co/ajax/opendynamicsmultitaker@gmail.com", {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            message: "User " + email + " is proceeding to buy " + product
        })
    })
    .then(response => {
        // Whether email succeeds or fails, we redirect the customer to pay
        // so we don't lose the sale.
        window.location.href = currentStripeUrl;
    })
    .catch(error => {
        console.error('Error sending email notification:', error);
        // Fallback: Redirect anyway
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
