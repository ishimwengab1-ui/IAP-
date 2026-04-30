
/* ══════════════════════════════════════════════════════════════════
     JAVASCRIPT
══════════════════════════════════════════════════════════════════ */

  /* ─────────────────────────────────────────────────────────────────
     GLOBAL STATE
  ───────────────────────────────────────────────────────────────── */
  // Array that stores each BMI history entry
  let bmiHistory = [];

  // Current active page ID
  let currentPage = 'home';


  /* ─────────────────────────────────────────────────────────────────
     NAVIGATION SYSTEM
     showPage(id) — hides all pages, shows the chosen one,
     and updates the active highlight on the nav buttons.
  ───────────────────────────────────────────────────────────────── */
  function showPage(id) {
    // Hide every .page element
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    // Show the chosen page
    document.getElementById('page-' + id).classList.add('active');

    // Remove active class from all nav buttons
    document.querySelectorAll('.nav-links button, .mobile-menu button').forEach(b => b.classList.remove('active'));

    // Add active class to matching buttons
    const desktopBtn = document.getElementById('nav-' + id);
    const mobileBtn  = document.getElementById('mnav-' + id);
    if (desktopBtn) desktopBtn.classList.add('active');
    if (mobileBtn)  mobileBtn.classList.add('active');

    currentPage = id;
    window.scrollTo(0, 0);

    // Refresh history view each time the history page is opened
    if (id === 'history') renderHistory();
  }

  function toggleMenu() {
    document.getElementById('mobile-menu').classList.toggle('open');
  }


  /* ─────────────────────────────────────────────────────────────────
     HELPER: Apply dynamic colour theme to the result cards
  ───────────────────────────────────────────────────────────────── */
  function applyTheme(elementId, scheme) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.style.setProperty('--result-bg',     scheme.bg);
    el.style.setProperty('--result-border', scheme.border);
    el.style.setProperty('--result-text',   scheme.text);
    el.style.setProperty('--result-glow',   scheme.glow);
  }

  // Colour themes for each BMI category
  const themes = {
    underweight: { bg:'rgba(96,165,250,.08)',  border:'#60a5fa', text:'#93c5fd', glow:'rgba(96,165,250,.15)' },
    healthy:     { bg:'rgba(0,212,170,.08)',   border:'#00d4aa', text:'#5eead4', glow:'rgba(0,212,170,.2)' },
    overweight:  { bg:'rgba(246,201,14,.08)',  border:'#f6c90e', text:'#fcd34d', glow:'rgba(246,201,14,.15)' },
    obese:       { bg:'rgba(252,104,104,.08)', border:'#fc6868', text:'#fca5a5', glow:'rgba(252,104,104,.15)' },
  };

  /* ─────────────────────────────────────────────────────────────────
     HELPER: Categorise a BMI value
     Returns an object with { category, theme, label, tip }
  ───────────────────────────────────────────────────────────────── */
  function categorizeBMI(bmi) {
    if (bmi < 18.5) {
      return {
        label:    '🔵 Underweight',
        theme:    themes.underweight,
        badgeClass: 'badge-blue',
        tip:      'Your BMI is below the healthy range. Consider speaking with a nutritionist about a balanced, calorie-rich diet to reach a healthy weight. Focus on whole foods, lean proteins, and healthy fats.'
      };
    } else if (bmi <= 24.9) {
      return {
        label:    '🟢 Healthy Weight',
        theme:    themes.healthy,
        badgeClass: 'badge-green',
        tip:      'Great news — you\'re in the healthy weight range! Keep it up with a balanced diet, regular physical activity, and sufficient hydration. Aim for at least 30 minutes of movement per day.'
      };
    } else if (bmi <= 29.9) {
      return {
        label:    '🟡 Overweight',
        theme:    themes.overweight,
        badgeClass: 'badge-yellow',
        tip:      'Your BMI is slightly above the healthy range. Small lifestyle changes — like daily 20-minute walks, reducing sugary drinks, and eating more vegetables — can help bring it back to a healthy level.'
      };
    } else {
      return {
        label:    '🔴 Obese',
        theme:    themes.obese,
        badgeClass: 'badge-red',
        tip:      'Your BMI is in the obese range. We strongly recommend speaking with a healthcare professional for a personalised health plan. Small, consistent changes make a lasting difference.'
      };
    }
  }


  /* ═════════════════════════════════════════════════════════════════
     PAGE 2: BMI CALCULATOR
  ═════════════════════════════════════════════════════════════════ */
  function calcBMI() {
    const weight = parseFloat(document.getElementById('bmi-weight').value);
    const height = parseFloat(document.getElementById('bmi-height').value);
    const errEl  = document.getElementById('bmi-error');

    // Validate inputs
    if (!weight || !height || weight <= 0 || height <= 0) {
      errEl.style.display = 'block';
      document.getElementById('bmi-result').style.display = 'none';
      return;
    }
    errEl.style.display = 'none';

    // BMI Formula: weight(kg) ÷ height(m)²
    const heightM = height / 100;
    const bmi     = weight / (heightM * heightM);
    const bmiStr  = bmi.toFixed(1);

    const cat = categorizeBMI(bmi);

    // Update DOM
    document.getElementById('bmi-value').textContent    = bmiStr;
    document.getElementById('bmi-category').textContent = cat.label;
    document.getElementById('bmi-tip').textContent      = cat.tip;
    document.getElementById('bmi-info-weight').textContent = weight + ' kg';
    document.getElementById('bmi-info-height').textContent = height + ' cm';

    // Move gauge needle (scale 10–40)
    const pct = Math.min(Math.max(((bmi - 10) / 30) * 100, 0), 100);
    const needle = document.getElementById('bmi-needle');
    needle.style.left        = pct + '%';
    needle.style.borderColor = cat.theme.border;

    // Apply colour theme
    applyTheme('bmi-result', cat.theme);

    // Show result card
    const resultCard = document.getElementById('bmi-result');
    resultCard.style.display   = 'block';
    resultCard.style.animation = 'none';
    resultCard.offsetHeight;
    resultCard.style.animation = 'slideUp .4s ease';

    // Auto-save to history
    bmiHistory.push({
      weight, height,
      bmi: parseFloat(bmiStr),
      category: cat.label,
      badgeClass: cat.badgeClass,
      time: new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })
    });
  }

  function resetBMI() {
    document.getElementById('bmi-weight').value = '';
    document.getElementById('bmi-height').value = '';
    document.getElementById('bmi-error').style.display = 'none';
    document.getElementById('bmi-result').style.display = 'none';
  }

  // Allow Enter key on BMI inputs
  ['bmi-weight','bmi-height'].forEach(id => {
    document.getElementById(id).addEventListener('keydown', e => { if (e.key==='Enter') calcBMI(); });
  });


  /* ═════════════════════════════════════════════════════════════════
     PAGE 3: IDEAL WEIGHT FINDER  (Feature 1)
     Formula: Healthy weight range = BMI 18.5–24.9 at given height
     minWeight = 18.5 × h²    maxWeight = 24.9 × h²
  ═════════════════════════════════════════════════════════════════ */
  function calcIdeal() {
    const height = parseFloat(document.getElementById('ideal-height').value);
    const errEl  = document.getElementById('ideal-error');

    if (!height || height < 50 || height > 250) {
      errEl.style.display = 'block';
      document.getElementById('ideal-result').style.display = 'none';
      return;
    }
    errEl.style.display = 'none';

    const hM = height / 100;
    const min = (18.5 * hM * hM).toFixed(1);
    const max = (24.9 * hM * hM).toFixed(1);
    const mid = ((parseFloat(min) + parseFloat(max)) / 2).toFixed(1);

    document.getElementById('ideal-range').textContent = min + ' – ' + max + ' kg';
    document.getElementById('ideal-sub').textContent   = 'Healthy range for ' + height + ' cm';
    document.getElementById('ideal-min').textContent   = min + ' kg';
    document.getElementById('ideal-max').textContent   = max + ' kg';
    document.getElementById('ideal-tip').textContent   =
      'For your height of ' + height + ' cm, the WHO considers ' + min + ' kg to ' + max + ' kg to be the healthy weight range (BMI 18.5–24.9). Your ideal midpoint is around ' + mid + ' kg.';

    // Bar position: visually represent 18.5–24.9 on a wider scale (10–40)
    const leftPct  = ((18.5 - 10) / 30) * 100;
    const widthPct = ((24.9 - 18.5) / 30) * 100;
    document.getElementById('ideal-bar').style.left  = leftPct + '%';
    document.getElementById('ideal-bar').style.width = widthPct + '%';
    document.getElementById('ideal-markers').innerHTML =
      '<span>10 kg</span><span>' + min + ' kg</span><span>' + max + ' kg</span><span>40 kg</span>';

    const rc = document.getElementById('ideal-result');
    rc.style.display   = 'block';
    rc.style.animation = 'none';
    rc.offsetHeight;
    rc.style.animation = 'slideUp .4s ease';
  }

  function resetIdeal() {
    document.getElementById('ideal-height').value = '';
    document.getElementById('ideal-error').style.display = 'none';
    document.getElementById('ideal-result').style.display = 'none';
  }

  document.getElementById('ideal-height').addEventListener('keydown', e => { if(e.key==='Enter') calcIdeal(); });


  /* ═════════════════════════════════════════════════════════════════
     PAGE 4: WATER INTAKE CALCULATOR  (Feature 2)
     Formula: Base = weight(kg) × 35 ml, then × activity multiplier
  ═════════════════════════════════════════════════════════════════ */
  function calcWater() {
    const weight   = parseFloat(document.getElementById('water-weight').value);
    const activity = parseFloat(document.getElementById('water-activity').value);
    const errEl    = document.getElementById('water-error');

    if (!weight || weight <= 0) {
      errEl.style.display = 'block';
      document.getElementById('water-result').style.display = 'none';
      return;
    }
    errEl.style.display = 'none';

    // Calculate daily water in ml, then convert to litres
    const totalMl     = weight * 35 * activity;
    const totalLitres = (totalMl / 1000).toFixed(2);
    // Average glass = 250 ml
    const glasses     = Math.ceil(totalMl / 250);

    document.getElementById('water-value').textContent   = totalLitres + ' L';
    document.getElementById('water-glasses').textContent = glasses + ' glasses of water (250 ml each)';
    document.getElementById('water-litres').textContent  = totalLitres + ' L';
    document.getElementById('water-cups').textContent    = glasses + ' glasses';

    // Determine tip based on amount
    let tip = '';
    if (glasses <= 6)       tip = 'That\'s a manageable daily amount. Spread it throughout the day — try starting with 1 glass as soon as you wake up.';
    else if (glasses <= 10) tip = 'Great target! Keep a reusable water bottle handy. Set phone reminders to drink a glass every 2 hours to hit your goal.';
    else                    tip = 'With your activity level, hydration is critical. Drink consistently — don\'t wait until you feel thirsty, as thirst signals you\'re already slightly dehydrated.';

    document.getElementById('water-tip').textContent = tip;

    // Render glass icons
    const visual = document.getElementById('water-visual');
    visual.innerHTML = '';
    const displayGlasses = Math.min(glasses, 16); // show max 16 icons
    for (let i = 0; i < displayGlasses; i++) {
      const span = document.createElement('span');
      span.className = 'glass-icon';
      span.textContent = '🥤';
      visual.appendChild(span);
      // Animate filling
      setTimeout(() => span.classList.add('filled'), i * 60);
    }
    if (glasses > 16) {
      const more = document.createElement('span');
      more.className = 'glass-icon filled';
      more.textContent = '+' + (glasses - 16);
      more.style.fontSize = '1rem';
      more.style.opacity = '1';
      visual.appendChild(more);
    }

    const rc = document.getElementById('water-result');
    rc.style.display   = 'block';
    rc.style.animation = 'none';
    rc.offsetHeight;
    rc.style.animation = 'slideUp .4s ease';
  }

  function resetWater() {
    document.getElementById('water-weight').value = '';
    document.getElementById('water-error').style.display = 'none';
    document.getElementById('water-result').style.display = 'none';
  }

  document.getElementById('water-weight').addEventListener('keydown', e => { if(e.key==='Enter') calcWater(); });


  /* ═════════════════════════════════════════════════════════════════
     PAGE 5: CALORIE ESTIMATOR  (Feature 3)
     Harris-Benedict Equation:
       Male:   BMR = 88.36 + (13.40 × kg) + (4.80 × cm) − (5.68 × age)
       Female: BMR = 447.60 + (9.25 × kg) + (3.10 × cm) − (4.33 × age)
     TDEE = BMR × activity multiplier
  ═════════════════════════════════════════════════════════════════ */
  function calcCalorie() {
    const weight   = parseFloat(document.getElementById('cal-weight').value);
    const height   = parseFloat(document.getElementById('cal-height').value);
    const age      = parseFloat(document.getElementById('cal-age').value);
    const gender   = document.getElementById('cal-gender').value;
    const activity = parseFloat(document.getElementById('cal-activity').value);
    const errEl    = document.getElementById('cal-error');

    if (!weight || !height || !age || weight <= 0 || height <= 0 || age <= 0) {
      errEl.style.display = 'block';
      document.getElementById('cal-result').style.display = 'none';
      return;
    }
    errEl.style.display = 'none';

    // Calculate BMR using Harris-Benedict equation
    let bmr;
    if (gender === 'male') {
      bmr = 88.36 + (13.40 * weight) + (4.80 * height) - (5.68 * age);
    } else {
      bmr = 447.60 + (9.25 * weight) + (3.10 * height) - (4.33 * age);
    }

    // Total Daily Energy Expenditure
    const tdee = bmr * activity;

    // Different goal calorie targets
    const losefast  = Math.round(tdee - 750);
    const loseslow  = Math.round(tdee - 350);
    const maintain  = Math.round(tdee);
    const gainSlow  = Math.round(tdee + 350);

    document.getElementById('cal-bmr').textContent = Math.round(bmr) + ' kcal / day';

    // Render calorie breakdown boxes
    document.getElementById('cal-breakdown').innerHTML = `
      <div class="cal-box">
        <div class="cb-label">Lose Fast</div>
        <div class="cb-val">${losefast > 0 ? losefast : '—'} kcal</div>
        <div class="cb-sub">−750 kcal/day deficit</div>
      </div>
      <div class="cal-box">
        <div class="cb-label">Lose Slowly</div>
        <div class="cb-val">${loseslow} kcal</div>
        <div class="cb-sub">−350 kcal/day deficit</div>
      </div>
      <div class="cal-box highlight">
        <div class="cb-label">Maintain Weight</div>
        <div class="cb-val">${maintain} kcal</div>
        <div class="cb-sub">Your TDEE (maintenance)</div>
      </div>
      <div class="cal-box">
        <div class="cb-label">Gain Slowly</div>
        <div class="cb-val">${gainSlow} kcal</div>
        <div class="cb-sub">+350 kcal/day surplus</div>
      </div>
    `;

    document.getElementById('cal-tip').textContent =
      'Your BMR of ' + Math.round(bmr) + ' kcal is the number of calories your body burns at rest. To maintain your current weight, eat around ' + maintain + ' kcal per day. Adjust up or down based on your goal. Always ensure you eat at least 1200 kcal (women) or 1500 kcal (men) per day.';

    const rc = document.getElementById('cal-result');
    rc.style.display   = 'block';
    rc.style.animation = 'none';
    rc.offsetHeight;
    rc.style.animation = 'slideUp .4s ease';
  }

  function resetCalorie() {
    ['cal-weight','cal-height','cal-age'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('cal-error').style.display = 'none';
    document.getElementById('cal-result').style.display = 'none';
  }


  /* ═════════════════════════════════════════════════════════════════
     PAGE 6: BMI HISTORY LOG  (Feature 4)
  ═════════════════════════════════════════════════════════════════ */
  function addHistory() {
    const weight = parseFloat(document.getElementById('hist-weight').value);
    const height = parseFloat(document.getElementById('hist-height').value);
    const errEl  = document.getElementById('hist-error');

    if (!weight || !height || weight <= 0 || height <= 0) {
      errEl.style.display = 'block';
      return;
    }
    errEl.style.display = 'none';

    // Calculate and save entry
    const hM  = height / 100;
    const bmi = weight / (hM * hM);
    const cat = categorizeBMI(bmi);

    bmiHistory.push({
      weight, height,
      bmi: parseFloat(bmi.toFixed(1)),
      category: cat.label,
      badgeClass: cat.badgeClass,
      time: new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })
    });

    document.getElementById('hist-weight').value = '';
    document.getElementById('hist-height').value = '';
    renderHistory();
  }

  function renderHistory() {
    const container = document.getElementById('history-container');

    if (bmiHistory.length === 0) {
      container.innerHTML = `
        <div class="history-empty">
          <div class="he-icon">📭</div>
          <p>No history yet. Go to the BMI Calculator or use the Quick Entry below!</p>
        </div>`;
      return;
    }

    // Build table from history array
    let rows = '';
    bmiHistory.forEach((entry, i) => {
      rows += `
        <tr>
          <td>${i + 1}</td>
          <td>${entry.time}</td>
          <td>${entry.weight} kg</td>
          <td>${entry.height} cm</td>
          <td><strong>${entry.bmi}</strong></td>
          <td><span class="badge ${entry.badgeClass}">${entry.category.replace(/[🔵🟢🟡🔴]/gu,'').trim()}</span></td>
        </tr>`;
    });

    container.innerHTML = `
      <button class="clear-history-btn" onclick="clearHistory()">🗑 Clear All History</button>
      <div class="history-table-wrap">
        <table class="history-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Time</th>
              <th>Weight</th>
              <th>Height</th>
              <th>BMI</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
  }

  function clearHistory() {
    bmiHistory = [];
    renderHistory();
  }

  ['hist-weight','hist-height'].forEach(id => {
    document.getElementById(id).addEventListener('keydown', e => { if(e.key==='Enter') addHistory(); });
  });


  /* ═════════════════════════════════════════════════════════════════
     PAGE 7: HEALTH TIPS LIBRARY  (Feature 5)
     Tips data array — each tip has a category and content
  ═════════════════════════════════════════════════════════════════ */
  const healthTips = [
    // NUTRITION
    { cat:'nutrition', icon:'🥦', title:'Eat More Vegetables', text:'Aim to fill half your plate with vegetables at every meal. They are rich in fibre, vitamins, and minerals while being low in calories.' },
    { cat:'nutrition', icon:'🍳', title:'Never Skip Breakfast', text:'Breakfast jump-starts your metabolism and helps you avoid overeating later. Choose whole grains, eggs, or fruit for sustained energy.' },
    { cat:'nutrition', icon:'🚫', title:'Reduce Ultra-Processed Foods', text:'Limit chips, sodas, and packaged snacks. These are high in sugar, salt, and unhealthy fats that contribute to weight gain and disease.' },
    { cat:'nutrition', icon:'🍗', title:'Prioritise Protein', text:'Protein keeps you full longer and supports muscle growth. Include lean meats, eggs, beans, lentils, or dairy in every meal.' },
    { cat:'nutrition', icon:'🫐', title:'Snack Smart', text:'Replace chips and sweets with nuts, fruits, yoghurt, or carrot sticks. Smart snacking keeps blood sugar stable and energy levels high.' },
    // FITNESS
    { cat:'fitness', icon:'🚶', title:'Walk 10,000 Steps a Day', text:'Walking is one of the most effective forms of exercise. Use a phone pedometer to track your steps and gradually increase daily movement.' },
    { cat:'fitness', icon:'🧘', title:'Stretch Every Morning', text:'5–10 minutes of morning stretching improves flexibility, reduces injury risk, and helps wake up your muscles for the day ahead.' },
    { cat:'fitness', icon:'💪', title:'Strength Training Twice a Week', text:'Lifting weights or doing bodyweight exercises (push-ups, squats) builds muscle, boosts metabolism, and strengthens bones.' },
    { cat:'fitness', icon:'⏱', title:'Try the 7-Minute Workout', text:'Seven minutes of high-intensity circuit training can provide many of the same benefits as longer workouts — perfect for busy schedules.' },
    { cat:'fitness', icon:'🧗', title:'Take the Stairs', text:'Small habits matter. Choosing stairs over lifts, parking farther away, or cycling instead of driving adds up to significant activity over time.' },
    // HYDRATION
    { cat:'hydration', icon:'🌅', title:'Drink Water First Thing', text:'Keep a glass of water on your nightstand. Drinking water before anything else in the morning rehydrates your body after sleep.' },
    { cat:'hydration', icon:'🍵', title:'Limit Sugary Drinks', text:'A single can of soda contains up to 10 teaspoons of sugar. Replace it with water, herbal tea, or sparkling water with lemon.' },
    { cat:'hydration', icon:'📱', title:'Set Hydration Reminders', text:'Use your phone\'s alarm or a hydration app to remind yourself to drink water every 2 hours. Most people forget to drink enough.' },
    { cat:'hydration', icon:'🫗', title:'Hydrate Before Meals', text:'Drinking 1–2 glasses of water 30 minutes before eating can reduce appetite and improve digestion, supporting healthy weight management.' },
    // SLEEP
    { cat:'sleep', icon:'😴', title:'Sleep 7–9 Hours Each Night', text:'Chronic sleep deprivation is linked to weight gain, weakened immunity, and poor concentration. Prioritise sleep as a health necessity, not a luxury.' },
    { cat:'sleep', icon:'📵', title:'Screen-Free 1 Hour Before Bed', text:'Blue light from phones and laptops suppresses melatonin production. Swap screens for reading, light stretching, or listening to calm music.' },
    { cat:'sleep', icon:'🌡', title:'Cool Your Bedroom', text:'The ideal sleep temperature is 16–19°C. A cooler room helps your body drop its core temperature, a key trigger for deep sleep.' },
    { cat:'sleep', icon:'⏰', title:'Consistent Sleep Schedule', text:'Going to bed and waking at the same time every day — even on weekends — regulates your body clock and dramatically improves sleep quality.' },
    // MENTAL HEALTH
    { cat:'mental', icon:'🧠', title:'Practice Mindfulness Daily', text:'Even 5 minutes of mindful breathing reduces cortisol (stress hormone) levels. Apps like Headspace or Calm can guide beginners.' },
    { cat:'mental', icon:'📓', title:'Journaling Reduces Stress', text:'Writing down 3 things you\'re grateful for each day shifts focus from stress to positivity. It\'s a simple habit with powerful mental health benefits.' },
    { cat:'mental', icon:'🤝', title:'Stay Socially Connected', text:'Human connection is a biological need. Regular time with friends, family, or community groups significantly reduces anxiety and depression risk.' },
    { cat:'mental', icon:'🌿', title:'Spend Time in Nature', text:'Studies show that just 20 minutes outdoors lowers stress hormones. Walk in a park, garden, or any green space to reset your mind.' },
  ];

  // Store the active filter
  let activeFilter = 'all';

  function filterTips(category, btn) {
    activeFilter = category;
    // Update filter button active state
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderTips();
  }

  function renderTips() {
    const grid = document.getElementById('tips-grid');
    const filtered = activeFilter === 'all'
      ? healthTips
      : healthTips.filter(t => t.cat === activeFilter);

    // Category label map
    const catLabels = {
      nutrition: '🥗 Nutrition',
      fitness:   '🏃 Fitness',
      hydration: '💧 Hydration',
      sleep:     '😴 Sleep',
      mental:    '🧠 Mental Health'
    };

    grid.innerHTML = filtered.map(tip => `
      <div class="tip-card">
        <div class="tc-icon">${tip.icon}</div>
        <h3>${tip.title}</h3>
        <p>${tip.text}</p>
        <span class="tip-cat">${catLabels[tip.cat]}</span>
      </div>
    `).join('');
  }

  // Render tips on page load
  renderTips();