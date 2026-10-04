const form = document.getElementById("future-value-form");
const principalInput = document.getElementById("principal");
const principalConfirmInput = document.getElementById("principal-confirm");
const principalFeedback = document.getElementById("principal-feedback");
const result = document.getElementById("result");

function validatePrincipalMatch() {
  const principal = principalInput.value;
  const confirmation = principalConfirmInput.value;

  if (!principal || !confirmation) {
    principalConfirmInput.setCustomValidity("");
    principalConfirmInput.removeAttribute("aria-invalid");
    principalFeedback.textContent = "";
    return;
  }

  if (principalInput.valueAsNumber !== principalConfirmInput.valueAsNumber) {
    principalConfirmInput.setCustomValidity(
      "The principal amounts must match.",
    );
    principalConfirmInput.setAttribute("aria-invalid", "true");
    principalFeedback.textContent =
      "These amounts do not match. Check both entries.";
    return;
  }

  principalConfirmInput.setCustomValidity("");
  principalConfirmInput.removeAttribute("aria-invalid");
  principalFeedback.textContent = "The principal amounts match.";
}

function readValidNumber(id) {
  const input = document.getElementById(id);
  const value = input.valueAsNumber;

  return Number.isFinite(value) ? value : null;
}

form.addEventListener("input", (event) => {
  event.target.classList.add("touched");
  result.textContent = "";

  if (
    event.target === principalInput ||
    event.target === principalConfirmInput
  ) {
    validatePrincipalMatch();
  }
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  form.classList.add("was-validated");
  validatePrincipalMatch();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const principal = readValidNumber("principal");
  const annualRate = readValidNumber("annual-rate");
  const years = readValidNumber("years");
  const periods = readValidNumber("periods");

  if (
    principal === null ||
    annualRate === null ||
    years === null ||
    periods === null ||
    principal <= 0 ||
    annualRate < 0 ||
    years < 1 ||
    periods < 1 ||
    !Number.isInteger(years) ||
    !Number.isInteger(periods)
  ) {
    result.textContent =
      "Check each value: amounts and rates must be valid numbers, and years and periods must be positive whole numbers.";
    return;
  }

  const futureValue =
    principal * Math.pow(1 + annualRate / periods, periods * years);

  if (
    !Number.isFinite(futureValue) ||
    futureValue > Number.MAX_SAFE_INTEGER
  ) {
    result.textContent =
      "The future value is outside the reliably displayable range. Try smaller inputs.";
    return;
  }

  result.textContent = `Future value: ${futureValue.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  })}`;
});
