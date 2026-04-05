export class EmotionalBait {
  constructor(tagManager) {
    this.tagManager = tagManager;
    this.analyses = [];
    this.timeline = new Map(); // person -> array of emotion pattern entries
  }

  render() {
    const container = document.createElement('div');
    container.className = 'module';

    container.innerHTML = `
      <div class="input-group">
        <label>Person Name</label>
        <input type="text" id="eb-person" placeholder="Enter name">
      </div>
      <div class="input-group">
        <label>Affection Pattern</label>
        <select id="eb-pattern">
          <option value="1">Consistent</option>
          <option value="2">Varies slightly</option>
          <option value="3">Hot and cold cycles</option>
          <option value="4">Extreme unpredictability</option>
        </select>
      </div>
      <div class="input-group">
        <label>Intensity After Distance</label>
        <select id="eb-intensity">
          <option value="0">Same</option>
          <option value="1">Slightly more</option>
          <option value="2">Much more</option>
          <option value="3">Love-bombing</option>
        </select>
      </div>
      <div class="input-group">
        <label>Shared Trauma/Pain Topics</label>
        <select id="eb-trauma">
          <option value="0">Never discussed</option>
          <option value="1">Occasionally, naturally</option>
          <option value="2">Frequently, seems strategic</option>
          <option value="3">Constantly, creates false intimacy</option>
        </select>
      </div>
      <button class="primary" id="analyze-eb">Analyze Emotional Patterns</button>
      <div id="eb-results"></div>
    `;

    container.querySelector('#analyze-eb').addEventListener('click', () => {
      this.analyze(container);
    });

    return container;
  }

  analyze(container) {
    const person = container.querySelector('#eb-person').value;
    const pattern = parseInt(container.querySelector('#eb-pattern').value);
    const intensity = parseInt(container.querySelector('#eb-intensity').value);
    const trauma = parseInt(container.querySelector('#eb-trauma').value);

    if (!person) return;

    const intermittentScore = pattern * 25;
    const loveBombScore = intensity * 30;
    const traumaBondScore = trauma * 25;
    const totalRisk = (intermittentScore + loveBombScore + traumaBondScore) / 3;

    // Add to timeline
    if (!this.timeline.has(person)) {
      this.timeline.set(person, []);
    }
    this.timeline.get(person).push({
      timestamp: Date.now(),
      pattern,
      intensity,
      trauma,
      totalRisk
    });

    // Store or update the analysis
    const existingIndex = this.analyses.findIndex(a => a.person === person);
    const analysis = { person, pattern, intensity, trauma, totalRisk };
    if (existingIndex >= 0) {
      this.analyses[existingIndex] = analysis;
    } else {
      this.analyses.push(analysis);
    }

    const resultsDiv = container.querySelector('#eb-results');
    resultsDiv.innerHTML = '';
    resultsDiv.className = 'results';

    this.addMetric(resultsDiv, 'Intermittent Reinforcement', intermittentScore, 
      'Unpredictable affection creates addiction-like attachment');
    
    this.addMetric(resultsDiv, 'Love-Bombing After Distance', loveBombScore,
      'Excessive affection after withdrawal is a manipulation tactic');
    
    this.addMetric(resultsDiv, 'Trauma Bonding', traumaBondScore,
      'Shared pain used to create false intimacy and dependency');

    // Add tags
    if (this.tagManager) {
      resultsDiv.appendChild(this.tagManager.renderTagSelector(person, () => {
        // Refresh on tag change
        this.analyze(container);
      }));
    }

    // Pattern-specific alerts
    if (intermittentScore >= 75) {
      const alert = document.createElement('div');
      alert.className = 'alert';
      alert.style.background = 'rgba(255, 68, 68, 0.15)';
      alert.style.borderColor = '#ff4444';
      alert.innerHTML = `
        <div class="alert-title" style="color: #ff4444;">🚨 Intermittent Reinforcement Detected</div>
        Extreme unpredictability in affection creates addiction-like attachment. This is a deliberate manipulation tactic used to keep you hooked and anxious.
      `;
      resultsDiv.appendChild(alert);
    }

    if (loveBombScore >= 60) {
      const alert = document.createElement('div');
      alert.className = 'alert';
      alert.style.background = 'rgba(255, 136, 0, 0.15)';
      alert.style.borderColor = '#ff8800';
      alert.innerHTML = `
        <div class="alert-title" style="color: #ff8800;">🚨 Love-Bombing Pattern Detected</div>
        Excessive affection after distance/withdrawal is a manipulation cycle. They're training you to fear abandonment and chase their approval.
      `;
      resultsDiv.appendChild(alert);
    }

    if (traumaBondScore >= 75) {
      const alert = document.createElement('div');
      alert.className = 'alert';
      alert.style.background = 'rgba(255, 68, 68, 0.15)';
      alert.style.borderColor = '#ff4444';
      alert.innerHTML = `
        <div class="alert-title" style="color: #ff4444;">🚨 Trauma-Bonding Detected</div>
        Constant shared pain creates false intimacy and dependency. This person is using your vulnerabilities to bond you to them—classic abuse tactic.
      `;
      resultsDiv.appendChild(alert);
    }

    if (totalRisk >= 60 && intermittentScore < 75 && loveBombScore < 60 && traumaBondScore < 75) {
      const alert = document.createElement('div');
      alert.className = 'alert';
      alert.style.background = 'rgba(255, 170, 0, 0.15)';
      alert.style.borderColor = '#ffaa00';
      alert.innerHTML = `
        <div class="alert-title" style="color: #ffaa00;">⚠️ Emotional Manipulation Detected</div>
        Multiple manipulation tactics active. This person is using psychological techniques to create artificial attachment and dependency. These patterns are common in toxic/abusive relationships.
      `;
      resultsDiv.appendChild(alert);
    }

    // Show emotion timeline and trends if exists
    if (this.timeline.has(person) && this.timeline.get(person).length > 1) {
      this.renderEmotionTimeline(resultsDiv, person);
      this.renderTrendChart(resultsDiv, person);
    }
  }

  renderTrendChart(container, person) {
    const entries = this.timeline.get(person);
    if (entries.length < 2) return;

    const isCollapsed = localStorage.getItem(`chart-collapsed-${person}`) === 'true';

    const chart = document.createElement('div');
    chart.className = 'collapsible-section';
    chart.style.marginTop = '12px';
    
    const header = document.createElement('div');
    header.className = 'collapsible-header';
    header.innerHTML = `
      <div style="font-size: 11px; font-weight: 700; color: var(--text-secondary);">Risk Trend</div>
      <div style="display: flex; gap: 8px; align-items: center;">
        <select id="time-window-${person.replace(/\s/g, '_')}" style="padding: 4px 8px; background: #0a0a0a; border: 1px solid #333; color: #fff; font-family: inherit; font-size: 10px; border-radius: 3px;" onclick="event.stopPropagation();">
          <option value="all">All Time</option>
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="90">Last 90 Days</option>
        </select>
        <span id="collapse-icon-${person.replace(/\s/g, '_')}" style="font-size: 14px;">${isCollapsed ? '▶' : '▼'}</span>
      </div>
    `;
    
    const content = document.createElement('div');
    content.className = `collapsible-content${isCollapsed ? ' collapsed' : ''}`;
    content.innerHTML = `
      <div style="font-size: 10px; color: #666; margin-bottom: 8px;">Drag to pan</div>
    `;
    
    header.addEventListener('click', () => {
      const isNowCollapsed = !content.classList.contains('collapsed');
      content.classList.toggle('collapsed');
      const icon = document.getElementById(`collapse-icon-${person.replace(/\s/g, '_')}`);
      if (icon) icon.textContent = isNowCollapsed ? '▶' : '▼';
      localStorage.setItem(`chart-collapsed-${person}`, isNowCollapsed);
    });
    
    chart.appendChild(header);
    chart.appendChild(content);

    const renderGraph = (filteredEntries) => {
      const graphContainer = document.createElement('div');
      graphContainer.style.cssText = 'position: relative; height: 100px; margin: 12px 0; overflow: hidden; cursor: grab;';
      
      const graphContent = document.createElement('div');
      graphContent.style.cssText = 'position: relative; height: 100%; transition: transform 0.1s;';
      graphContainer.appendChild(graphContent);

      const max = 100;
      const pointWidth = Math.max(20, 300 / filteredEntries.length);
      graphContent.style.width = `${Math.max(300, filteredEntries.length * pointWidth)}px`;

      filteredEntries.forEach((entry, i) => {
        const height = (entry.totalRisk / max) * 100;
        const bar = document.createElement('div');
        bar.className = 'tooltip';
        bar.setAttribute('data-tooltip', `${new Date(entry.timestamp).toLocaleDateString()}: ${Math.round(entry.totalRisk)}`);
        bar.style.cssText = `
          position: absolute;
          bottom: 0;
          left: ${i * pointWidth}px;
          width: ${pointWidth - 2}px;
          height: ${height}%;
          background: ${this.getScoreColor(entry.totalRisk)};
          opacity: 0.7;
          cursor: help;
        `;
        graphContent.appendChild(bar);
      });
      
      return { graphContainer, graphContent };
    };
    
    const { graphContainer, graphContent } = renderGraph(entries);

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

    const trendDiv = document.createElement('div');
    trendDiv.id = `trend-${person.replace(/\s/g, '_')}`;
    
    const updateTrend = (filteredEntries) => {
      const risks = filteredEntries.map(e => e.totalRisk);
      const trend = risks[risks.length - 1] - risks[0];
      const trendText = trend > 10 ? '⬆️ Escalating' : trend < -10 ? '⬇️ Decreasing' : '→ Stable';
      const trendColor = trend > 10 ? '#ff4444' : trend < -10 ? '#44ff44' : '#666';
      
      trendDiv.innerHTML = `
        <div style="font-size: 10px; color: ${trendColor}; margin-top: 8px;">
          Trend: ${trendText} (${trend > 0 ? '+' : ''}${Math.round(trend)} points) | ${filteredEntries.length} entries
        </div>
      `;
    };
    
    updateTrend(entries);
    content.appendChild(graphContainer);
    content.appendChild(trendDiv);
    
    // Time window filter
    const timeWindowSelect = header.querySelector(`#time-window-${person.replace(/\s/g, '_')}`);
    timeWindowSelect.addEventListener('change', () => {
      const days = timeWindowSelect.value;
      let filteredEntries = entries;
      
      if (days !== 'all') {
        const cutoff = Date.now() - (parseInt(days) * 24 * 60 * 60 * 1000);
        filteredEntries = entries.filter(e => e.timestamp >= cutoff);
      }
      
      if (filteredEntries.length < 2) {
        filteredEntries = entries.slice(-2);
      }
      
      // Re-render graph
      const oldGraph = content.querySelector('div[style*="height: 100px"]').parentElement;
      const { graphContainer: newGraph } = renderGraph(filteredEntries);
      
      // Re-bind pan
      let isDragging = false;
      let startX = 0;
      let scrollLeft = 0;
      const newContent = newGraph.querySelector('div[style*="transition"]');

      newGraph.addEventListener('mousedown', (e) => {
        isDragging = true;
        newGraph.style.cursor = 'grabbing';
        startX = e.pageX - newGraph.offsetLeft;
        scrollLeft = newContent.offsetLeft;
      });

      newGraph.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - newGraph.offsetLeft;
        const walk = (x - startX);
        const newLeft = Math.min(0, Math.max(scrollLeft + walk, -(newContent.offsetWidth - newGraph.offsetWidth)));
        newContent.style.transform = `translateX(${newLeft}px)`;
      });

      newGraph.addEventListener('mouseup', () => {
        isDragging = false;
        newGraph.style.cursor = 'grab';
      });

      newGraph.addEventListener('mouseleave', () => {
        isDragging = false;
        newGraph.style.cursor = 'grab';
      });
      
      oldGraph.replaceWith(newGraph);
      updateTrend(filteredEntries);
    });

    container.appendChild(chart);
  }

  renderEmotionTimeline(container, person) {
    const entries = this.timeline.get(person);
    const timeline = document.createElement('div');
    timeline.style.cssText = 'margin-top: 16px; padding: 12px; background: #0a0a0a; border: 1px solid #333; border-radius: 4px;';
    timeline.innerHTML = `<div style="font-size: 11px; font-weight: 700; margin-bottom: 8px; color: #aaa;">Emotion Pattern Timeline (${entries.length} entries)</div>`;

    entries.slice().reverse().slice(0, 5).forEach(entry => {
      const date = new Date(entry.timestamp).toLocaleDateString();
      const entryDiv = document.createElement('div');
      entryDiv.style.cssText = 'padding: 6px; margin-bottom: 4px; border-left: 2px solid ' + this.getScoreColor(entry.totalRisk) + '; padding-left: 8px;';
      
      const patternText = ['Consistent', 'Varies slightly', 'Hot/cold cycles', 'Extreme unpredictability'][entry.pattern - 1];
      const intensityText = ['Same', 'Slightly more', 'Much more', 'Love-bombing'][entry.intensity];
      
      entryDiv.innerHTML = `
        <div style="font-size: 10px; color: #666;">${date}</div>
        <div style="font-size: 11px; color: #aaa; margin-top: 2px;">Pattern: ${patternText}</div>
        <div style="font-size: 11px; color: #aaa;">Intensity: ${intensityText}</div>
        <div style="font-size: 10px; color: ${this.getScoreColor(entry.totalRisk)}; margin-top: 2px;">Risk: ${Math.round(entry.totalRisk)}/100</div>
      `;
      timeline.appendChild(entryDiv);
    });

    if (entries.length > 5) {
      timeline.innerHTML += `<div style="font-size: 10px; color: #666; margin-top: 8px;">Showing 5 most recent of ${entries.length} total entries</div>`;
    }

    container.appendChild(timeline);
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