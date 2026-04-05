export class StatusDecoder {
  constructor(tagManager) {
    this.tagManager = tagManager;
    this.analyses = [];
  }

  render() {
    const container = document.createElement('div');
    container.className = 'module';

    container.innerHTML = `
      <div class="input-group">
        <label>Person Name</label>
        <input type="text" id="sd-person" placeholder="Enter name">
      </div>
      <div class="input-group">
        <label>Name-Dropping Frequency</label>
        <select id="sd-namedrop">
          <option value="0">Never</option>
          <option value="1">Occasionally</option>
          <option value="2">Regularly</option>
          <option value="3">Constantly</option>
        </select>
      </div>
      <div class="input-group">
        <label>Virtue Signaling</label>
        <select id="sd-virtue">
          <option value="0">Genuine actions</option>
          <option value="1">Some performative acts</option>
          <option value="2">Mostly performative</option>
          <option value="3">Pure performance</option>
        </select>
      </div>
      <div class="input-group">
        <label>Association Strategy</label>
        <select id="sd-association">
          <option value="0">Authentic connections</option>
          <option value="1">Some strategic networking</option>
          <option value="2">Opportunistic friendships</option>
          <option value="3">Pure social climbing</option>
        </select>
      </div>
      <div class="input-group">
        <label>Value When Not Useful</label>
        <select id="sd-utility">
          <option value="0">Consistent</option>
          <option value="1">Slight decrease</option>
          <option value="2">Significant decrease</option>
          <option value="3">Discarded</option>
        </select>
      </div>
      <button class="primary" id="analyze-sd">Decode Status Games</button>
      <div id="sd-results"></div>
    `;

    container.querySelector('#analyze-sd').addEventListener('click', () => {
      this.analyze(container);
    });

    return container;
  }

  analyze(container) {
    const person = container.querySelector('#sd-person').value;
    const namedrop = parseInt(container.querySelector('#sd-namedrop').value);
    const virtue = parseInt(container.querySelector('#sd-virtue').value);
    const association = parseInt(container.querySelector('#sd-association').value);
    const utility = parseInt(container.querySelector('#sd-utility').value);

    if (!person) return;

    const namedropScore = namedrop * 25;
    const virtueScore = virtue * 25;
    const climbingScore = association * 25;
    const transactionalScore = utility * 25;
    
    const totalScore = (namedropScore + virtueScore + climbingScore + transactionalScore) / 4;

    // Store the analysis
    this.analyses.push({ person, totalScore, transactionalScore });

    const resultsDiv = container.querySelector('#sd-results');
    resultsDiv.innerHTML = '';
    resultsDiv.className = 'results';

    this.addMetric(resultsDiv, 'Status Signaling', namedropScore,
      'Using connections to elevate perceived status');
    
    this.addMetric(resultsDiv, 'Performative Virtue', virtueScore,
      'Good deeds done for social credit, not genuine care');
    
    this.addMetric(resultsDiv, 'Social Climbing', climbingScore,
      'Relationships formed for advancement, not connection');
    
    this.addMetric(resultsDiv, 'Transactional Utility', transactionalScore,
      'Your value tied to what you can provide');

    // Add tags
    if (this.tagManager) {
      resultsDiv.appendChild(this.tagManager.renderTagSelector(person, () => {
        this.analyze(container);
      }));
    }

    if (totalScore >= 65) {
      const alert = document.createElement('div');
      alert.className = 'alert';
      alert.innerHTML = `
        <div class="alert-title">⚠️ Purely Transactional Relationship</div>
        This person views you as a status asset, not a genuine connection. You will be discarded when no longer useful. Protect your emotional investment.
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