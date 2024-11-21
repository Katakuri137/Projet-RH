document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector('form');
    const emailInput = document.querySelector('#email');
    const passwordInput = document.querySelector('#password');

    form.addEventListener('submit', function (event) {
        if (!emailInput.value || !passwordInput.value) {
            event.preventDefault();  // Empêche l'envoi du formulaire
            alert("Veuillez remplir tous les champs.");
        }
    });

    // Animation personnalisée lors du focus
    emailInput.addEventListener('focus', function () {
        emailInput.classList.add('focus-animation');
    });

    passwordInput.addEventListener('focus', function () {
        passwordInput.classList.add('focus-animation');
    });

    // Retirer l'animation après le blur (perte de focus)
    emailInput.addEventListener('blur', function () {
        emailInput.classList.remove('focus-animation');
    });

    passwordInput.addEventListener('blur', function () {
        passwordInput.classList.remove('focus-animation');
    });
});
