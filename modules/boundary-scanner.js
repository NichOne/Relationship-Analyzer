export class BoundaryScanner {
  constructor(tagManager) {
    this.tagManager = tagManager;
    this.scans = [];
  }

  render() {
    const container = document.createElement('div');
    container.className = 'module';

    container.innerHTML = `
      <div class="input-group">
        <label>Person Name</label>
        <input type="text" id="bs-person" placeholder="Enter name">
      </div>
      <div class="input-group">
        <label>When You Say "No"</label>
        <select id="bs-no">
          <option value="0">Respects it</option>
          <option value="1">Asks why</option>
          <option value="2">Pushes back</option>
          <option value="3">Ignores/violates</option>
        </select>
      </div>
      <div class="input-group">
        <label>Guilt-Tripping Frequency</label>
        <select id="bs-guilt">
          <option value="0">Never</option>
          <option value="1">Rarely</option>
          <option value="2">Sometimes</option>
          <option value="3">Often</option>
        </select>
      </div>
      <div class="input-group">
        <label>Gaslighting (Denying Your Reality)</label>
        <select id="bs-gaslight">
          <option value="0">Never</option>
          <option value="1">Minor instances</option>
          <option value="2">Regular occurrences</option>
          <option value="3">Constant reality distortion</option>
        </select>
      </div>
      <div class="input-group">
        <label>Manufactured Obligations</label>
        <select id="bs-obligations">
          <option value="0">None</option>
          <option value="1">Occasional</option>
          <option value="2">Frequent</option>
          <option value="3">Constant pressure</option>
        </select>
      </div>
      <button class="primary" id="analyze-bs">Scan Boundary Violations</button>
      <div id="bs-results"></div>
    `;

    container.querySelector('#analyze-bs').addEventListener('click', () => {
      this.analyze(container);
    });

    return container;
  }

  analyze(container) {
    const person = container.querySelector('#bs-person').value;
    const noResponse = parseInt(container.querySelector('#bs-no').value);
    const guilt = parseInt(container.querySelector('#bs-guilt').value);
    const gaslight = parseInt(container.querySelector('#bs-gaslight').value);
    const obligations = parseInt(container.querySelector('#bs-obligations').value);

    if (!person) return;

    const boundaryRespect = 100 - (noResponse * 33);
    const guiltScore = guilt * 33;
    const gaslightScore = gaslight * 33;
    const obligationScore = obligations * 33;
    
    const totalThreat = (guiltScore + gaslightScore + obligationScore + (100 - boundaryRespect)) / 4;

    // Store the scan
    this.scans.push({ person, boundaryRespect, guiltScore, gaslightScore, obligationScore, totalThreat });

    const resultsDiv = container.querySelector('#bs-results');
    resultsDiv.innerHTML = '';
    resultsDiv.className = 'results';

    this.addMetric(resultsDiv, 'Boundary Respect', boundaryRespect, 
      boundaryRespect < 50 ? 'Your boundaries are regularly violated' : 'Boundaries generally respected');
    
    this.addMetric(resultsDiv, 'Guilt-Tripping', guiltScore,
      'Using guilt to manipulate your behavior');
    
    this.addMetric(resultsDiv, 'Gaslighting', gaslightScore,
      'Denying your reality to maintain control');
    
    this.addMetric(resultsDiv, 'Obligation Manufacturing', obligationScore,
      'Creating artificial duties you must fulfill');

    // Add tags
    if (this.tagManager) {
      resultsDiv.appendChild(this.tagManager.renderTagSelector(person, () => {
        this.analyze(container);
      }));
    }

    if (totalThreat >= 60) {
      const alert = document.createElement('div');
      alert.className = 'alert';
      alert.innerHTML = `
        <div class="alert-title">🚨 Severe Boundary Violations</div>
        This person consistently penetrates your boundaries using multiple manipulation tactics. This is a hallmark of abusive relationships. Your autonomy and reality are under attack.
      `;
      resultsDiv.appendChild(alert);
    } else if (gaslightScore >= 66) {
      const alert = document.createElement('div');
      alert.className = 'alert';
      alert.innerHTML = `
        <div class="alert-title">⚠️ Gaslighting Detected</div>
        Chronic gaslighting erodes your trust in your own perception. This is a severe form of psychological abuse. Document incidents and seek external perspective.
      `;
      resultsDiv.appendChild(alert);
    }
  }

  addMetric(container, name, score, description) {
    const metric = document.createElement('div');
    metric.className = 'metric';
    
    // Invert color for boundary respect (higher is better)
    const displayScore = name === 'Boundary Respect' ? score : score;
    const colorScore = name === 'Boundary Respect' ? (100 - score) : score;
    
    metric.innerHTML = `
      <div class="metric-header">
        <span class="metric-name">${name}</span>
        <span class="metric-score ${this.getScoreClass(colorScore)}">${Math.round(displayScore)}/100</span>
      </div>
      <div class="metric-bar">
        <div class="metric-fill" style="width: ${displayScore}%; background: ${this.getScoreColor(colorScore)}"></div>
      </div>
      <div class="metric-detail">${description}</div>
    `;
    container.appendChild(metric);
  }

  getScoreClass(score) {
    if (score >= 75) return 'score-critical';
    if (score >= 50) return 'score-warning';
    if (score >= 25) return 'score-caution';
    return 'score-safe';
  }

  getScoreColor(score) {
    if (score >= 75) return '#ff4444';
    if (score >= 50) return '#ffaa00';
    if (score >= 25) return '#ffff00';
    return '#44ff44';
  }
}