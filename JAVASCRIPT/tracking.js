const steps = document.querySelectorAll('.step-wizard-item');

steps.forEach((step) => {
  step.addEventListener('click', () => {
    if (!step.classList.contains('current-item')) {
      step.classList.add('current-item');
      const currentItem = document.querySelector('.current-item');
      currentItem.classList.remove('current-item');
      step.classList.add('current-item');
      updateProgressTracker();
    }
  });
});

function updateProgressTracker() {
  const currentStep = document.querySelector('.current-item');
  const nextStep = currentStep.nextElementSibling;

  if (nextStep === null) {
    return;
  }

  const currentStepNumber = currentStep.querySelector('.progress-count');
  const nextStepNumber = nextStep.querySelector('.progress-count');
  const currentStepLabel = currentStep.querySelector('.progress-label');
  const nextStepLabel = nextStep.querySelector('.progress-label');

  currentStepNumber.textContent = parseInt(currentStepNumber.textContent) + 1;
  nextStepNumber.textContent = parseInt(nextStepNumber.textContent) - 1;

  currentStepLabel.classList.remove('active-label');
  nextStepLabel.classList.add('active-label');
}

