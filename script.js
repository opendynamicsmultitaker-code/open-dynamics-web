document.addEventListener('DOMContentLoaded', () => {
    // --- THEME LOGIC ---
    const toggleButton = document.getElementById('theme-toggle');
    const body = document.body;
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        toggleButton.textContent = 'Light Mode';
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

    // --- PURCHASE LOGIC ---
    const modal = document.getElementById('purchase-modal');
    const emailInput = document.getElementById('customer-email');
    const proceedBtn = document.getElementById('proceed-btn');
    const modalTitle = document.getElementById('modal-product-title');
    
    let currentProduct = "";
    let stripeUrl = "";

    window.openPurchase = (product, url) => {
        if (product === 'FREE') {
            window.open(url, '_blank');
            return;
        }
        currentProduct = product;
        stripeUrl = url;
        modalTitle.textContent = "Get Multi-Taker " + product;
        modal.style.display = 'flex';
    };

    window.closeModal = () => {
        modal.style.display = 'none';
        emailInput.value = "";
    };

    proceedBtn.addEventListener('click', async () => {
        const email = emailInput.value.trim();
        if (!email || !email.includes('@')) {
            alert("Please enter a valid email address.");
            return;
        }

        proceedBtn.textContent = "Processing...";
        proceedBtn.disabled = true;

        // NOTIFY DEVELOPER via Formspree (Replace 'YOUR_FORM_ID' with your actual ID)
        // To get a Form ID, sign up at formspree.io (it's free)
        try {
            await fetch('https://formspree.io/f/xvgzrrar', { // He puesto opendynamicsmultitaker@gmail.com como destino si usas mi link de test pero crea el tuyo
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    product: currentProduct,
                    message: `New potential buyer for Multi-Taker ${currentProduct}`
                })
            });
        } catch (e) {
            console.log("Notification failed, but proceeding to stripe.");
        }

        // REDIRECT TO STRIPE
        window.location.href = stripeUrl;
    });
});
