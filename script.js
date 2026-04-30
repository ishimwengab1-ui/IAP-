document.getElementById('bmi-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const weight = parseFloat(document.getElementById('weight').value);
  const heightCm = parseFloat(document.getElementById('height').value);
  
  // Validation
  if (!weight || !heightCm || weight <= 0 || heightCm <= 0) {
    alert('Please enter valid positive numbers for weight and height.');
    return;
  }

  // BMI Calculation
  const heightM = heightCm / 100;
  const bmi = weight / (heightM * heightM);
  const roundedBmi = bmi.toFixed(1);

  // Categorization & UI Mapping
  let category, message, colorClass;
  if (bmi < 18.5) {
    category = 'Underweight';
    message = 'Consider consulting a nutritionist for a balanced diet plan.';
    colorClass = 'underweight';
  } else if (bmi < 25) {
    category = 'Healthy Weight';
    message = 'Great job! Maintain your active lifestyle and balanced diet.';
    colorClass = 'healthy';
  } else if (bmi < 30) {
    category = 'Overweight';
    message = 'Regular exercise and mindful eating can help improve your health.';
    colorClass = 'overweight';
  } else {
    category = 'Obese';
    message = 'Please consult a healthcare provider for personalized guidance.';
    colorClass = 'obese';
  }

  // Dynamic DOM Update
  const resultCard = document.getElementById('result-card');
  document.getElementById('bmi-value').textContent = `BMI: ${roundedBmi}`;
  document.getElementById('bmi-category').textContent = category;
  document.getElementById('bmi-message').textContent = message;

  // Apply color class & show result
  resultCard.className = 'result-card ' + colorClass;
  resultCard.classList.remove('hidden');
});
