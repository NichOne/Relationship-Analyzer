import { SnapshotManager } from './dashboard/snapshot-manager.js';
import { WidgetManager } from './dashboard/widget-manager.js';
import { MetricsAggregator } from './dashboard/metrics-aggregator.js';
import { TrendAnalyzer } from './dashboard/trend-analyzer.js';

export class Dashboard {
  constructor(analyzer) {
    this.analyzer = analyzer;
    this.snapshotManager = new SnapshotManager();
    this.widgetManager = new WidgetManager();
    this.metricsAggregator = new MetricsAggregator(analyzer);
    this.trendAnalyzer = new TrendAnalyzer(analyzer);
  }
  
  // removed saveSnapshot() - moved to SnapshotManager
  // removed saveWidgetPreferences() - moved to WidgetManager

  render() {
    const container = document.createElement('div');
    container.className = 'module';

    const data = this.metricsAggregator.aggregate();
    
    // Save codependency to history
    this.trendAnalyzer.recordCodependency(data.codependency);
    
    // Calculate predictive risk
    const predictiveRisk = Math.round(this.trendAnalyzer.calculatePredictiveRisk(data));
    const codependencyHistory = this.trendAnalyzer.getCodependencyHistory();

    container.innerHTML = `
      <div class="dashboard-header">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 8px;">
          <h2 style="font-size: 16px; font-weight: 700;">Relationship Health Overview</h2>
          <div style="display: flex; gap: 8px;">
            <button id="customize-widgets" style="padding: 6px 12px; background: #333; color: #fff; border: none; font-family: inherit; font-size: 11px; font-weight: 700; border-radius: 4px; cursor: pointer;">
              ⚙️ Customize
            </button>
            <button id="save-snapshot" style="padding: 6px 12px; background: #333; color: #fff; border: none; font-family: inherit; font-size: 11px; font-weight: 700; border-radius: 4px; cursor: pointer;">
              📸 Snapshot
            </button>
            <button id="export-csv" style="padding: 6px 12px; background: #fff; color: #000; border: none; font-family: inherit; font-size: 11px; font-weight: 700; border-radius: 4px; cursor: pointer;">
              Export CSV
            </button>
          </div>
        </div>
        <p style="font-size: 11px; color: #888; margin-bottom: 16px;">
          ${data.totalRelationships} relationship${data.totalRelationships !== 1 ? 's' : ''} analyzed • 
          ${data.totalCommunities} communit${data.totalCommunities !== 1 ? 'ies' : 'y'} mapped
        </p>
      </div>

      ${predictiveRisk > 0 ? `
        <div style="background: ${predictiveRisk >= 70 ? '#1a0000' : predictiveRisk >= 50 ? '#1a0a00' : '#0a1a0a'}; border: 1px solid ${predictiveRisk >= 70 ? '#ff4444' : predictiveRisk >= 50 ? '#ff8800' : '#4a8a4a'}; border-radius: 4px; padding: 12px; margin-bottom: 16px;">
          <div style="font-size: 13px; font-weight: 700; margin-bottom: 4px; color: ${predictiveRisk >= 70 ? '#ff4444' : predictiveRisk >= 50 ? '#ff8800' : '#4a8a4a'};">
            Predictive Manipulation Risk Score
          </div>
          <div style="font-size: 24px; font-weight: 700; color: ${this.getScoreColor(predictiveRisk)};">
            ${predictiveRisk}/100
          </div>
          <div style="font-size: 11px; color: #aaa; margin-top: 4px;">
            ${predictiveRisk >= 70 ? 'Critical: Multiple manipulation patterns detected across relationships' : 
              predictiveRisk >= 50 ? 'Warning: Concerning patterns emerging' : 
              'Monitoring: Some patterns require attention'}
          </div>
        </div>
      ` : ''}

      ${codependencyHistory.length >= 2 ? `
        <div style="margin-bottom: 16px; padding: 12px; background: #0a0a0a; border: 1px solid #333; border-radius: 4px;">
          <div style="font-size: 11px; font-weight: 700; margin-bottom: 8px; color: #aaa;">Co-dependency Trend</div>
          <div style="position: relative; height: 80px; background: #000; border-radius: 4px; overflow: hidden;">
            ${this.trendAnalyzer.renderTrendLine(codependencyHistory)}
          </div>
        </div>
      ` : ''}
      
      ${this.snapshotManager.getAll().length > 0 ? `
        <div style="margin-bottom: 16px;">
          <div style="font-size: 11px; font-weight: 700; margin-bottom: 8px; color: #aaa;">Snapshot Comparison</div>
          <select id="snapshot-compare" style="width: 100%; padding: 8px; background: #0a0a0a; border: 1px solid #333; color: #fff; font-family: inherit; font-size: 11px; border-radius: 4px;">
            <option value="">Select snapshot to compare...</option>
            ${this.snapshotManager.getAll().slice().reverse().map(s => `
              <option value="${s.id}">${s.name} - ${new Date(s.timestamp).toLocaleDateString()}</option>
            `).join('')}
          </select>
          <div id="snapshot-comparison"></div>
        </div>
      ` : ''}

      <div class="sticky-section">
        <div style="font-size: 11px; font-weight: 700; color: #aaa;">Key Metrics</div>
      </div>
      <div class="key-metrics" id="dashboard-widgets">
        ${this.renderWidgets(data)}
      </div>

      ${data.criticalAlerts.length > 0 ? `
        <div class="critical-summary">
          <div style="font-weight: 700; margin-bottom: 8px; font-size: 13px;">🚨 Critical Alerts</div>
          ${data.criticalAlerts.map(alert => `<div style="font-size: 11px; color: #ff4444; margin-bottom: 4px;">• ${alert}</div>`).join('')}
        </div>
      ` : `
        <div style="background: #0a1a0a; border: 1px solid #2a4a2a; border-radius: 4px; padding: 12px; margin-top: 16px;">
          <div style="font-size: 11px; color: #4a8a4a;">
            ✓ No critical alerts detected. Use the tabs above to analyze specific relationships.
          </div>
        </div>
      `}

      <div class="dashboard-footer">
        <p style="font-size: 11px; color: #666; margin-top: 16px;">
          Analyze relationships in each module to populate real-time metrics above.
        </p>
      </div>
    `;

    container.querySelector('#export-csv').addEventListener('click', () => {
      this.analyzer.exportCSV();
    });
    
    container.querySelector('#customize-widgets')?.addEventListener('click', () => {
      this.widgetManager.showCustomizer(() => {
        this.analyzer.renderModule();
      });
    });
    
    container.querySelector('#save-snapshot')?.addEventListener('click', () => {
      const name = prompt('Snapshot name:', `Snapshot ${new Date().toLocaleDateString()}`);
      if (name) {
        this.snapshotManager.save(name, data);
        this.analyzer.renderModule();
      }
    });
    
    container.querySelector('#snapshot-compare')?.addEventListener('change', (e) => {
      const snapshotId = parseInt(e.target.value);
      if (snapshotId) {
        const snapshot = this.snapshotManager.getAll().find(s => s.id === snapshotId);
        this.snapshotManager.renderComparison(container.querySelector('#snapshot-comparison'), snapshot.data, data);
      } else {
        container.querySelector('#snapshot-comparison').innerHTML = '';
      }
    });

    return container;
  }
  
  renderWidgets(data) {
    const widgets = {
      codependency: () => this.renderGauge('Co-dependency Index', data.codependency, 'Emotional dependence and loss of autonomy'),
      leverage: () => this.renderGauge('Emotional Leverage Score', data.leverage, 'Degree to which others can manipulate you emotionally'),
      obligation: () => this.renderGauge('Social Obligation Debt Load', data.obligation, 'Weight of unrepaid favors and manufactured duties'),
      boundary: () => this.renderGauge('Boundary Integrity Rating', data.boundary, 'How well your boundaries are respected', true),
      authenticity: () => this.renderGauge('Authenticity vs Performance', data.authenticity, 'Genuine connections vs transactional relationships', true)
    };
    
    return this.widgetManager.getVisibleWidgets()
      .map(key => widgets[key]())
      .join('');
  }
  
  // removed showWidgetCustomizer() - moved to WidgetManager
  // removed renderTrendLine() - moved to TrendAnalyzer
  // removed renderSnapshotComparison() - moved to SnapshotManager

  renderGauge(name, score, description, isPositive = false) {
    const colorScore = isPositive ? (100 - score) : score;
    const statusLabel = this.getStatusLabel(colorScore);
    
    return `
      <div class="metric">
        <div class="metric-header">
          <span class="metric-name tooltip" data-tooltip="${description}">${name}</span>
          <span class="metric-score ${this.getScoreClass(colorScore)}">${Math.round(score)}</span>
        </div>
        <div style="position: relative; height: 8px; background: #0a0a0a; border-radius: 4px; margin: 8px 0; overflow: hidden;">
          <div style="position: absolute; height: 100%; width: ${score}%; background: ${this.getScoreColor(colorScore)}; transition: width 0.3s ease;"></div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <span style="font-size: 10px; color: #666;">0</span>
          <span style="font-size: 10px; font-weight: 700; color: ${this.getScoreColor(colorScore)};">${statusLabel}</span>
          <span style="font-size: 10px; color: #666;">100</span>
        </div>
        <div class="metric-detail">${description}</div>
      </div>
    `;
  }

  getStatusLabel(score) {
    if (score >= 75) return 'CRITICAL';
    if (score >= 50) return 'WARNING';
    if (score >= 25) return 'CAUTION';
    return 'HEALTHY';
  }

  // removed aggregateData() - moved to MetricsAggregator
  // removed calculatePredictiveRisk() - moved to TrendAnalyzer
  // removed analyzeDebtTrends() - moved to TrendAnalyzer
  // removed analyzeEmotionalTrends() - moved to TrendAnalyzer

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