export class DebtTracker {
  constructor(tagManager) {
    this.tagManager = tagManager;
    this.analyses = [];
    this.history = new Map(); // person -> array of timeline entries
  }

  render() {
    const container = document.createElement('div');
    container.className = 'module';

    container.innerHTML = `
      <div class="input-group">
        <label>Person Name</label>
        <input type="text" id="debt-person" placeholder="Enter name">
      </div>
      <div class="input-group">
        <label>What They Did For You</label>
        <textarea id="debt-favor" placeholder="Describe the favor or action"></textarea>
      </div>
      <div class="input-group">
        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
          <input type="checkbox" id="debt-unspoken" style="width: auto;">
          <span>Unspoken/Implicit Obligation (they never explicitly asked for payback)</span>
        </label>
      </div>
      <div class="input-group">
        <label>How Often They Mention It</label>
        <select id="debt-frequency">
          <option value="0">Never</option>
          <option value="1">Rarely</option>
          <option value="2">Sometimes</option>
          <option value="3">Often</option>
          <option value="4">Constantly</option>
        </select>
      </div>
      <div class="input-group">
        <label>Your Emotional Response</label>
        <select id="debt-response">
          <option value="1">Grateful</option>
          <option value="2">Obligated</option>
          <option value="3">Guilty</option>
          <option value="4">Trapped</option>
        </select>
      </div>
      <button class="primary" id="analyze-debt">Analyze Social Debt</button>
      <div id="debt-results"></div>
    `;

    container.querySelector('#analyze-debt').addEventListener('click', () => {
      this.analyzeDebt(container);
    });

    return container;
  }

  analyzeDebt(container) {
    const person = container.querySelector('#debt-person').value;
    const favor = container.querySelector('#debt-favor').value;
    const frequency = parseInt(container.querySelector('#debt-frequency').value);
    const response = parseInt(container.querySelector('#debt-response').value);
    const isUnspoken = container.querySelector('#debt-unspoken').checked;

    if (!person || !favor) return;

    const leverageScore = (frequency * 20) + (response * 5);
    const manipulationRisk = frequency >= 3 && response >= 3;
    const guiltBasedLeverage = isUnspoken && response >= 3;

    // Add to history
    if (!this.history.has(person)) {
      this.history.set(person, []);
    }
    this.history.get(person).push({
      timestamp: Date.now(),
      favor,
      leverageScore,
      frequency,
      response,
      isUnspoken,
      guiltBasedLeverage
    });

    // Store or update the analysis
    const existingIndex = this.analyses.findIndex(a => a.person === person);
    const analysis = { person, favor, frequency, response, leverageScore, manipulationRisk, isUnspoken, guiltBasedLeverage };
    if (existingIndex >= 0) {
      this.analyses[existingIndex] = analysis;
    } else {
      this.analyses.push(analysis);
    }

    const resultsDiv = container.querySelector('#debt-results');
    resultsDiv.innerHTML = '';
    resultsDiv.className = 'results';

    const metric = document.createElement('div');
    metric.className = 'metric';
    metric.innerHTML = `
      <div class="metric-header">
        <span class="metric-name">Leverage Score: ${person}</span>
        <span class="metric-score ${this.getScoreClass(leverageScore)}">${leverageScore}/100</span>
      </div>
      <div class="metric-bar">
        <div class="metric-fill ${this.getScoreClass(leverageScore)}" style="width: ${leverageScore}%; background: ${this.getScoreColor(leverageScore)}"></div>
      </div>
      <div class="metric-detail">
        ${this.getInterpretation(leverageScore, frequency, response)}
      </div>
    `;
    resultsDiv.appendChild(metric);

    // Add tags
    if (this.tagManager) {
      resultsDiv.appendChild(this.tagManager.renderTagSelector(person, () => {
        // Refresh results on tag change
        this.analyzeDebt(container);
      }));
    }

    if (guiltBasedLeverage) {
      const alert = document.createElement('div');
      alert.className = 'alert';
      alert.innerHTML = `
        <div class="alert-title">🚨 Guilt-Based Leverage Detected</div>
        Unspoken obligation creating intense guilt. This is a covert control tactic—they never explicitly asked for payback but engineered your sense of debt to manipulate you.
      `;
      resultsDiv.appendChild(alert);
    } else if (manipulationRisk) {
      const alert = document.createElement('div');
      alert.className = 'alert';
      alert.innerHTML = `
        <div class="alert-title">⚠️ Manipulation Pattern Detected</div>
        Repeated reminders of past favors combined with guilt responses suggest emotional leverage tactics. This debt is being weaponized to control your behavior.
      `;
      resultsDiv.appendChild(alert);
    }

    // Show history timeline and trends if exists
    if (this.history.has(person) && this.history.get(person).length > 1) {
      this.renderTimeline(resultsDiv, person);
      this.renderTrendChart(resultsDiv, person);
    }

    // Show obligation chain visualization
    this.renderObligationChain(resultsDiv);

    // Clear unspoken checkbox
    container.querySelector('#debt-unspoken').checked = false;
  }

  renderObligationChain(container) {
    if (this.analyses.length === 0) return;

    const chainDiv = document.createElement('div');
    chainDiv.style.cssText = 'margin-top: 16px; padding: 12px; background: #0a0a0a; border: 1px solid #333; border-radius: 4px;';
    chainDiv.innerHTML = `<div style="font-size: 11px; font-weight: 700; margin-bottom: 8px; color: #aaa;">Obligation Chain Map</div>`;

    const sorted = [...this.analyses].sort((a, b) => b.leverageScore - a.leverageScore);
    
    sorted.forEach(analysis => {
      const chainItem = document.createElement('div');
      chainItem.style.cssText = `
        padding: 8px;
        margin-bottom: 6px;
        background: #111;
        border-left: 3px solid ${this.getScoreColor(analysis.leverageScore)};
        border-radius: 3px;
      `;
      
      const typeLabel = analysis.isUnspoken 
        ? '<span style="color: #ff8800; font-size: 10px; font-weight: 700;">[UNSPOKEN]</span>'
        : '<span style="color: #666; font-size: 10px;">[EXPLICIT]</span>';
      
      const guiltLabel = analysis.guiltBasedLeverage
        ? '<span style="color: #ff4444; font-size: 10px; font-weight: 700; margin-left: 4px;">[GUILT-BASED]</span>'
        : '';

      chainItem.innerHTML = `
        <div style="font-size: 11px; margin-bottom: 4px;">
          <span style="font-weight: 700;">You</span>
          <span style="color: #666; margin: 0 4px;">→ owe →</span>
          <span style="font-weight: 700;">${analysis.person}</span>
        </div>
        <div style="font-size: 10px; color: #aaa; margin-bottom: 4px;">${analysis.favor}</div>
        <div style="font-size: 10px;">
          ${typeLabel}${guiltLabel}
          <span style="color: ${this.getScoreColor(analysis.leverageScore)}; margin-left: 8px; font-weight: 700;">Leverage: ${analysis.leverageScore}/100</span>
        </div>
      `;
      
      chainDiv.appendChild(chainItem);
    });

    // Summary stats
    const unspokenCount = this.analyses.filter(a => a.isUnspoken).length;
    const guiltCount = this.analyses.filter(a => a.guiltBasedLeverage).length;
    const highLeverageCount = this.analyses.filter(a => a.leverageScore >= 60).length;

    if (unspokenCount > 0 || guiltCount > 0 || highLeverageCount > 0) {
      const summary = document.createElement('div');
      summary.style.cssText = 'margin-top: 8px; padding: 8px; background: #1a0000; border: 1px solid #333; border-radius: 3px; font-size: 10px; color: #aaa;';
      summary.innerHTML = `
        <div style="font-weight: 700; margin-bottom: 4px; color: #ff8800;">⚠️ Chain Analysis:</div>
        ${unspokenCount > 0 ? `<div>• ${unspokenCount} unspoken obligation(s) - covert control</div>` : ''}
        ${guiltCount > 0 ? `<div>• ${guiltCount} guilt-based leverage situation(s)</div>` : ''}
        ${highLeverageCount > 0 ? `<div>• ${highLeverageCount} high-leverage obligation(s) (≥60/100)</div>` : ''}
      `;
      chainDiv.appendChild(summary);
    }

    container.appendChild(chainDiv);
  }

  renderTimeline(container, person) {
    const entries = this.history.get(person);
    const timeline = document.createElement('div');
    timeline.style.cssText = 'margin-top: 16px; padding: 12px; background: #0a0a0a; border: 1px solid #333; border-radius: 4px;';
    timeline.innerHTML = `<div style="font-size: 11px; font-weight: 700; margin-bottom: 8px; color: #aaa;">Obligation History (${entries.length} entries)</div>`;

    entries.slice().reverse().slice(0, 5).forEach(entry => {
      const date = new Date(entry.timestamp).toLocaleDateString();
      const entryDiv = document.createElement('div');
      entryDiv.style.cssText = 'padding: 6px; margin-bottom: 4px; border-left: 2px solid ' + this.getScoreColor(entry.leverageScore) + '; padding-left: 8px;';
      
      const typeLabel = entry.isUnspoken 
        ? '<span style="color: #ff8800; font-size: 9px;">[UNSPOKEN]</span>'
        : '<span style="color: #666; font-size: 9px;">[EXPLICIT]</span>';
      
      entryDiv.innerHTML = `
        <div style="font-size: 10px; color: #666;">${date} ${typeLabel}</div>
        <div style="font-size: 11px; color: #aaa; margin-top: 2px;">${entry.favor}</div>
        <div style="font-size: 10px; color: ${this.getScoreColor(entry.leverageScore)}; margin-top: 2px;">Leverage: ${entry.leverageScore}/100</div>
      `;
      timeline.appendChild(entryDiv);
    });

    if (entries.length > 5) {
      timeline.innerHTML += `<div style="font-size: 10px; color: #666; margin-top: 8px;">Showing 5 most recent of ${entries.length} total entries</div>`;
    }

    container.appendChild(timeline);
  }

  renderTrendChart(container, person) {
    const entries = this.history.get(person);
    if (entries.length < 2) return;

    const isCollapsed = localStorage.getItem(`debt-chart-collapsed-${person}`) === 'true';

    const chart = document.createElement('div');
    chart.className = 'collapsible-section';
    chart.style.marginTop = '12px';
    
    const header = document.createElement('div');
    header.className = 'collapsible-header';
    header.innerHTML = `
      <div style="font-size: 11px; font-weight: 700; color: var(--text-secondary);">Leverage Trend</div>
      <span id="collapse-debt-icon-${person.replace(/\s/g, '_')}" style="font-size: 14px;">${isCollapsed ? '▶' : '▼'}</span>
    `;
    
    const content = document.createElement('div');
    content.className = `collapsible-content${isCollapsed ? ' collapsed' : ''}`;
    content.innerHTML = `<div style="font-size: 10px; color: #666; margin-bottom: 8px;">Drag to pan</div>`;
    
    header.addEventListener('click', () => {
      const isNowCollapsed = !content.classList.contains('collapsed');
      content.classList.toggle('collapsed');
      const icon = document.getElementById(`collapse-debt-icon-${person.replace(/\s/g, '_')}`);
      if (icon) icon.textContent = isNowCollapsed ? '▶' : '▼';
      localStorage.setItem(`debt-chart-collapsed-${person}`, isNowCollapsed);
    });
    
    chart.appendChild(header);
    chart.appendChild(content);

    const graphContainer = document.createElement('div');
    graphContainer.style.cssText = 'position: relative; height: 100px; margin: 12px 0; overflow: hidden; cursor: grab;';
    
    const graphContent = document.createElement('div');
    graphContent.style.cssText = 'position: relative; height: 100%; transition: transform 0.1s;';
    graphContainer.appendChild(graphContent);

    // Add pan functionality
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;

    graphContainer.addEventListener('mousedown', (e) => {
      isDragging = true;
      graphContainer.style.cursor = 'grabbing';
      startX = e.pageX - graphContainer.offsetLeft;
      scrollLeft = graphContent.offsetLeft;
    });

    graphContainer.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - graphContainer.offsetLeft;
      const walk = (x - startX);
      const newLeft = Math.min(0, Math.max(scrollLeft + walk, -(graphContent.offsetWidth - graphContainer.offsetWidth)));
      graphContent.style.transform = `translateX(${newLeft}px)`;
    });

    graphContainer.addEventListener('mouseup', () => {
      isDragging = false;
      graphContainer.style.cursor = 'grab';
    });

    graphContainer.addEventListener('mouseleave', () => {
      isDragging = false;
      graphContainer.style.cursor = 'grab';
    });

    const max = 100;
    const pointWidth = Math.max(20, 300 / entries.length);
    graphContent.style.width = `${Math.max(300, entries.length * pointWidth)}px`;

    entries.forEach((entry, i) => {
      const height = (entry.leverageScore / max) * 100;
      const bar = document.createElement('div');
      bar.className = 'tooltip';
      bar.setAttribute('data-tooltip', `${new Date(entry.timestamp).toLocaleDateString()}: ${entry.leverageScore}`);
      bar.style.cssText = `
        position: absolute;
        bottom: 0;
        left: ${i * pointWidth}px;
        width: ${pointWidth - 2}px;
        height: ${height}%;
        background: ${this.getScoreColor(entry.leverageScore)};
        opacity: 0.7;
        cursor: help;
      `;
      graphContent.appendChild(bar);
    });

    content.appendChild(graphContainer);

    // Trend analysis
    const scores = entries.map(e => e.leverageScore);
    const trend = scores[scores.length - 1] - scores[0];
    const trendText = trend > 10 ? '⬆️ Increasing' : trend < -10 ? '⬇️ Decreasing' : '→ Stable';
    const trendColor = trend > 10 ? '#ff4444' : trend < -10 ? '#44ff44' : '#666';

    content.innerHTML += `
      <div style="font-size: 10px; color: ${trendColor}; margin-top: 8px;">
        Trend: ${trendText} (${trend > 0 ? '+' : ''}${trend} points)
      </div>
    `;

    container.appendChild(chart);
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

  getInterpretation(score, frequency, response) {
    if (score >= 75) {
      return 'CRITICAL: This person is actively using past favors to control you. The relationship has become transactional and manipulative.';
    } else if (score >= 50) {
      return 'WARNING: Significant emotional leverage detected. Monitor if favors are being used to manufacture obligation.';
    } else if (score >= 25) {
      return 'CAUTION: Mild obligation present. Ensure reciprocity is genuine, not coerced.';
    }
    return 'HEALTHY: Natural gratitude without manipulation. Balanced exchange.';
  }
}