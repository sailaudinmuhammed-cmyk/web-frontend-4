document.querySelectorAll('form').forEach((form) => {
  const status = document.getElementById('form-status');
  const bootstrap = form.dataset.validation === 'bootstrap';
  const password = form.querySelector('#password');
  const confirmation = form.querySelector('#confirm-password');
  const controls = [...form.querySelectorAll('input, textarea, select')];
  let submitted = false;

  if (bootstrap) form.noValidate = true;

  function matchPasswords() {
    if (confirmation) {
      confirmation.setCustomValidity(confirmation.value && confirmation.value !== password.value
        ? 'Passwords must match.' : '');
    }
  }

  function feedback(control) {
    if (control.type === 'checkbox') return; // Hobbies are optional.
    const valid = control.validity.valid;
    control.classList.toggle('is-valid', valid);
    control.classList.toggle('is-invalid', !valid);
    control.setAttribute('aria-invalid', String(!valid));
    const error = document.getElementById(`${control.id}-error`);
    if (error) {
      if (control.validity.valueMissing) error.textContent = `${control.labels[0].textContent} is required.`;
      else if (control.validity.customError) error.textContent = control.validationMessage;
      else if (control.validity.typeMismatch) error.textContent = 'Please enter a valid email address.';
      else if (control.validity.tooShort) error.textContent = `Use at least ${control.minLength} characters.`;
      else error.textContent = 'Please check this value.';
    }
  }

  function refresh() {
    matchPasswords();
    controls.forEach(feedback);
    const gender = form.querySelector('input[name="gender"]');
    if (gender) {
      document.getElementById('gender-error').hidden = gender.validity.valid;
      document.getElementById('gender-valid').hidden = !gender.validity.valid;
    }
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    submitted = true;
    matchPasswords();
    if (bootstrap) refresh();
    if (!form.checkValidity()) {
      status.textContent = 'Please correct the highlighted fields.';
      form.querySelector(':invalid').focus();
      return;
    }
    status.textContent = 'Form completed successfully.';
  });

  form.addEventListener('input', () => {
    status.textContent = '';
    if (bootstrap && submitted) refresh();
  });
  form.addEventListener('change', () => {
    status.textContent = '';
    if (bootstrap && submitted) refresh();
  });
  form.addEventListener('reset', () => {
    submitted = false;
    status.textContent = '';
    controls.forEach((control) => {
      control.classList.remove('is-valid', 'is-invalid');
      control.removeAttribute('aria-invalid');
      control.setCustomValidity('');
    });
    form.querySelectorAll('.group-feedback, .group-success').forEach((element) => { element.hidden = true; });
  });
});
