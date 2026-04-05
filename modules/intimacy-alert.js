export class IntimacyAlert {
  constructor(tagManager) {
    this.tagManager = tagManager;
    this.alerts = [];
  }

  render() {
    const container = document.createElement('div');
    container.className = 'module';

    container.innerHTML = `
      <div class="input-group">
        <label>Person Name</label>
        <input type="text" id="ia-person" placeholder="Enter name">
      </div>
      <div class="input-group">
        <label>Secrets You've Shared</label>
        <select id="ia-secrets">
          <option value="1">Surface level</option>
          <option value="2">Personal information</option>
          <option value="3">Deep vulnerabilities</option>
          <option value="4">Weaponizable secrets</option>
        </select>
      </div>
      <div class="input-group">
        <label>Information Used Against You</label>
        <select id="ia-weaponized">
          <option value="0">Never</option>
          <option value="1">Once, seemed accidental</option>
          <option value="2">Multiple times</option>
          <option value="3">Regularly weaponized</option>
        </select>
      </div>
      <div class="input-group">
        <label>Pressure to Share More</label>
        <select id="ia-pressure">
          <option value="0">No pressure</option>
          <option value="1">Gentle encouragement</option>
          <option value="2">Persistent pushing</option>
          <option value="3">Manipulation to extract</option>
        </select>
      </div>
      <div class="input-group">
        <label>They Share Back</label>
        <select id="ia-reciprocal">
          <option value="0">Equal vulnerability</option>
          <option value="1">Less than you</option>
          <option value="2">Very little</option>
          <option value="3">Nothing real</option>
        </select>
      </div>
      <button class="primary" id="analyze-ia">Analyze Intimacy Weaponization</button>
      <div id="ia-results"></div>
    `;

    container.querySelector('#analyze-ia').addEventListener('click', () => {
      this.analyze(container);
    });

    return container;
  }

  analyze(container) {
    const person = container.querySelector('#ia-person').value;
    const secrets = parseInt(container.querySelector('#ia-secrets').value);
    const weaponized = parseInt(container.querySelector('#ia-weaponized').value);
    const pressure = parseInt(container.querySelector('#ia-pressure').value);
    const reciprocal = parseInt(container.querySelector('#ia-reciprocal').value);

    if (!person) return;

    const exposureScore = secrets * 25;
    const weaponizationScore = weaponized * 33;
    const extractionScore = pressure * 33;
    const imbalanceScore = reciprocal * 33;
    
    const totalRisk = (exposureScore + weaponizationScore + extractionScore + imbalanceScore) / 4;

    // Store the alert
    this.alerts.push({ person, totalRisk, weaponizationScore });

    const resultsDiv = container.querySelector('#ia-results');
    resultsDiv.innerHTML = '';
    resultsDiv.className = 'results';

    this.addMetric(resultsDiv, 'Vulnerability Exposure', exposureScore,
      'Amount of weaponizable information shared');
    
    this.addMetric(resultsDiv, 'Weaponization History', weaponizationScore,
      'Past use of your vulnerabilities against you');
    
    this.addMetric(resultsDiv, 'Extraction Tactics', extractionScore,
      'Pressure to share more intimate information');
    
    this.addMetric(resultsDiv, 'Vulnerability Imbalance', imbalanceScore,
      'One-sided sharing creates power asymmetry');

    // Add tags
    if (this.tagManager) {
      resultsDiv.appendChild(this.tagManager.renderTagSelector(person, () => {
        this.analyze(container);
      }));
    }

    if (weaponizationScore >= 66) {
      const alert = document.createElement('div');
      alert.className = 'alert';
      alert.innerHTML = `
        <div class="alert-title">🚨 Active Weaponization of Intimacy</div>
        This person has repeatedly used your vulnerabilities against you. Every new secret is ammunition. STOP SHARING. This is severe emotional abuse.
      `;
      resultsDiv.appendChild(alert);
    } else if (totalRisk >= 60) {
      const alert = document.createElement('div');
      alert.className = 'alert';
      alert.innerHTML = `
        <div class="alert-title">⚠️ High Weaponization Risk</div>
        Pattern suggests information extraction for future leverage. The intimacy is not genuine—it's intelligence gathering. Guard your vulnerabilities.
      `;
      resultsDiv.appendChild(alert);
    }
  }

  addMetric(container, name, score, description) {
    const metric = document.createElement('div');
    metric.className = 'metric';
    metric.innerHTML = `
      <div class="metric-header">
        <span class="metric-name">${name}</span>
        <span class="metric-score ${this.getScoreClass(score)}">${Math.round(score)}/100</span>
      </div>
      <div class="metric-bar">
        <div class="metric-fill" style="width: ${score}%; background: ${this.getScoreColor(score)}"></div>
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