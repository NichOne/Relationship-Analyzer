export class SocialCredit {
  constructor() {
    this.community = [];
    this.points = 0;
    this.level = 1;
    this.achievements = new Set();
    this.pointsHistory = [];
  }
  
  addPoints(amount, reason) {
    this.points += amount;
    this.pointsHistory.push({ timestamp: Date.now(), amount, reason, total: this.points });
    this.checkLevelUp();
    this.checkAchievements();
  }
  
  checkLevelUp() {
    const newLevel = Math.floor(this.points / 100) + 1;
    if (newLevel > this.level) {
      this.level = newLevel;
      return true;
    }
    return false;
  }
  
  checkAchievements() {
    if (this.community.length >= 5 && !this.achievements.has('analyst')) {
      this.achievements.add('analyst');
    }
    if (this.community.filter(c => c.toxicityScore >= 70).length >= 3 && !this.achievements.has('survivor')) {
      this.achievements.add('survivor');
    }
    if (this.points >= 500 && !this.achievements.has('expert')) {
      this.achievements.add('expert');
    }
  }

  render() {
    const container = document.createElement('div');
    container.className = 'module';

    container.innerHTML = `
      <div style="margin-bottom: 20px; padding: 16px; background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%); border: 1px solid #333; border-radius: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <div>
            <div style="font-size: 10px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Social Credit Level</div>
            <div style="font-size: 28px; font-weight: 700; color: #fff;">${this.level}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 10px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Analysis Points</div>
            <div style="font-size: 20px; font-weight: 700; color: #4a8a4a;">${this.points}</div>
          </div>
        </div>
        <div style="height: 6px; background: #0a0a0a; border-radius: 3px; overflow: hidden;">
          <div style="height: 100%; width: ${(this.points % 100)}%; background: linear-gradient(90deg, #4a8a4a 0%, #2a6a2a 100%); transition: width 0.5s ease;"></div>
        </div>
        <div style="font-size: 9px; color: #666; margin-top: 4px;">${100 - (this.points % 100)} points to level ${this.level + 1}</div>
        
        ${this.achievements.size > 0 ? `
          <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #222;">
            <div style="font-size: 10px; color: #666; margin-bottom: 6px;">ACHIEVEMENTS</div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              ${Array.from(this.achievements).map(a => `
                <div style="padding: 4px 10px; background: #1a1a1a; border: 1px solid #4a8a4a; border-radius: 12px; font-size: 10px; color: #4a8a4a;">
                  ${a === 'analyst' ? '🔍 Analyst' : a === 'survivor' ? '💪 Survivor' : '⭐ Expert'}
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
      
      <div class="input-group">
        <label>Community/Group Name</label>
        <input type="text" id="sc-community" placeholder="Friend group, workplace, etc.">
      </div>
      <div class="input-group">
        <label>Reputation Currency</label>
        <select id="sc-currency">
          <option value="1">Merit-based</option>
          <option value="2">Popularity-based</option>
          <option value="3">Conformity-based</option>
          <option value="4">Fear-based</option>
        </select>
      </div>
      <div class="input-group">
        <label>Social Punishment for Dissent</label>
        <select id="sc-punishment">
          <option value="0">None</option>
          <option value="1">Mild disapproval</option>
          <option value="2">Social cooling</option>
          <option value="3">Complete ostracism</option>
        </select>
      </div>
      <div class="input-group">
        <label>Debt Tracking</label>
        <select id="sc-tracking">
          <option value="0">No scorekeeping</option>
          <option value="1">Informal awareness</option>
          <option value="2">Explicit tracking</option>
          <option value="3">Public ledger</option>
        </select>
      </div>
      <div class="input-group">
        <label>Your Current Status</label>
        <select id="sc-status">
          <option value="1">High standing</option>
          <option value="2">Good standing</option>
          <option value="3">Precarious</option>
          <option value="4">Low/outcast</option>
        </select>
      </div>
      <button class="primary" id="analyze-sc">Analyze Social Credit System</button>
      <div id="sc-results"></div>
    `;

    container.querySelector('#analyze-sc').addEventListener('click', () => {
      this.analyze(container);
    });

    return container;
  }

  analyze(container) {
    const community = container.querySelector('#sc-community').value;
    const currency = parseInt(container.querySelector('#sc-currency').value);
    const punishment = parseInt(container.querySelector('#sc-punishment').value);
    const tracking = parseInt(container.querySelector('#sc-tracking').value);
    const status = parseInt(container.querySelector('#sc-status').value);

    if (!community) return;

    const toxicityScore = currency * 20 + punishment * 25 + tracking * 25;
    const vulnerabilityScore = status * 25;

    // Store for dashboard aggregation
    this.community.push({ community, toxicityScore, vulnerabilityScore });
    
    // Award points
    const points = Math.floor(toxicityScore / 10);
    const leveledUp = this.checkLevelUp();
    this.addPoints(points, `Analyzed ${community}`);
    
    if (leveledUp) {
      const levelUpNotif = document.createElement('div');
      levelUpNotif.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #1a1a1a; border: 2px solid #4a8a4a; padding: 20px; border-radius: 8px; z-index: 2000; animation: fadeInScale 0.3s ease;';
      levelUpNotif.innerHTML = `
        <div style="font-size: 18px; font-weight: 700; text-align: center; margin-bottom: 8px;">🎉 Level Up!</div>
        <div style="font-size: 14px; text-align: center; color: #4a8a4a;">You've reached Level ${this.level}</div>
      `;
      document.body.appendChild(levelUpNotif);
      setTimeout(() => levelUpNotif.remove(), 2000);
    }

    const resultsDiv = container.querySelector('#sc-results');
    resultsDiv.innerHTML = '';
    resultsDiv.className = 'results';

    this.addMetric(resultsDiv, 'System Toxicity', toxicityScore,
      this.getToxicityDescription(toxicityScore));
    
    this.addMetric(resultsDiv, 'Your Vulnerability', vulnerabilityScore,
      'Risk of social punishment and exclusion');

    const metric = document.createElement('div');
    metric.className = 'metric';
    metric.innerHTML = `
      <div class="metric-header">
        <span class="metric-name">Community: ${community}</span>
      </div>
      <div class="metric-detail">
        ${this.getCommunityAnalysis(currency, punishment, tracking, status)}
      </div>
    `;
    resultsDiv.appendChild(metric);

    if (toxicityScore >= 70 && vulnerabilityScore >= 50) {
      const alert = document.createElement('div');
      alert.className = 'alert';
      alert.innerHTML = `
        <div class="alert-title">🚨 Toxic Social Control System</div>
        This community operates as a reputation-based control mechanism. Your behavior is being monitored and punished. This is not a healthy social environment—it's a compliance factory.
      `;
      resultsDiv.appendChild(alert);
    }
  }

  getToxicityDescription(score) {
    if (score >= 70) return 'Severe: Authoritarian social control through reputation';
    if (score >= 50) return 'High: Significant pressure to conform via social currency';
    if (score >= 25) return 'Moderate: Some reputation economics at play';
    return 'Low: Relatively healthy social dynamics';
  }

  getCommunityAnalysis(currency, punishment, tracking, status) {
    const analyses = [];

    if (currency >= 3) {
      analyses.push('• Reputation based on conformity/fear, not merit');
    }
    if (punishment >= 2) {
      analyses.push('• Dissent is socially punished—free thought is costly');
    }
    if (tracking >= 2) {
      analyses.push('• Explicit debt tracking creates obligation economy');
    }
    if (status >= 3) {
      analyses.push('• Your precarious position makes you vulnerable to control');
    }

    return analyses.length > 0 ? analyses.join('\n') : '• Relatively balanced social dynamics';
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