// Analyzes trends and calculates predictive risk scores
export class TrendAnalyzer {
  constructor(analyzer) {
    this.analyzer = analyzer;
    this.codependencyHistory = JSON.parse(localStorage.getItem('codependencyHistory') || '[]');
  }

  recordCodependency(value) {
    this.codependencyHistory.push({ timestamp: Date.now(), value });
    if (this.codependencyHistory.length > 50) this.codependencyHistory.shift();
    localStorage.setItem('codependencyHistory', JSON.stringify(this.codependencyHistory));
  }

  getCodependencyHistory() {
    return this.codependencyHistory;
  }

  renderTrendLine(history) {
    const max = Math.max(...history.map(h => h.value), 100);
    const width = 100 / history.length;
    
    return history.map((entry, i) => {
      const height = (entry.value / max) * 100;
      const color = this.getScoreColor(entry.value);
      return `<div class="trend-bar" style="position: absolute; bottom: 0; left: ${i * width}%; width: ${width}%; height: ${height}%; background: ${color}; transition: height 0.3s ease;"></div>`;
    }).join('');
  }

  calculatePredictiveRisk(metricsData) {
    const debtModule = this.analyzer.modules.debt;
    const emotionalModule = this.analyzer.modules.emotional;
    const networkModule = this.analyzer.modules.network;
    const boundaryModule = this.analyzer.modules.boundary;
    const intimacyModule = this.analyzer.modules.intimacy;

    let risk = 0;
    let factors = 0;

    // Analyze trends in debt tracking
    const debtTrends = this.analyzeDebtTrends(debtModule);
    if (debtTrends.increasing) {
      risk += debtTrends.severity;
      factors++;
    }

    // Analyze emotional manipulation patterns
    const emotionalTrends = this.analyzeEmotionalTrends(emotionalModule);
    if (emotionalTrends.escalating) {
      risk += emotionalTrends.severity;
      factors++;
    }

    // Check for multiple high-risk relationships
    const highRiskCount = [
      debtModule.analyses.filter(a => a.leverageScore >= 60).length,
      emotionalModule.analyses.filter(a => a.totalRisk >= 60).length,
      boundaryModule.scans.filter(s => s.totalThreat >= 60).length,
      intimacyModule.alerts.filter(a => a.totalRisk >= 60).length
    ].reduce((sum, count) => sum + count, 0);

    if (highRiskCount >= 3) {
      risk += 80;
      factors++;
    } else if (highRiskCount >= 2) {
      risk += 60;
      factors++;
    }

    // Check for weaponization patterns
    const weaponizationCount = intimacyModule.alerts.filter(a => a.weaponizationScore >= 66).length;
    if (weaponizationCount > 0) {
      risk += Math.min(100, weaponizationCount * 30);
      factors++;
    }

    // Check aggregate scores
    if (metricsData.codependency >= 70) {
      risk += 75;
      factors++;
    }
    if (metricsData.leverage >= 70) {
      risk += 75;
      factors++;
    }

    return factors > 0 ? risk / factors : 0;
  }

  analyzeDebtTrends(debtModule) {
    const trendsData = { increasing: false, severity: 0 };
    
    for (const [person, history] of debtModule.history.entries()) {
      if (history.length >= 3) {
        const recent = history.slice(-3);
        const scores = recent.map(h => h.leverageScore);
        
        if (scores[2] > scores[1] && scores[1] > scores[0]) {
          trendsData.increasing = true;
          trendsData.severity = Math.max(trendsData.severity, scores[2]);
        }
      }
    }
    
    return trendsData;
  }

  analyzeEmotionalTrends(emotionalModule) {
    const trendsData = { escalating: false, severity: 0 };
    
    for (const [person, timeline] of emotionalModule.timeline.entries()) {
      if (timeline.length >= 3) {
        const recent = timeline.slice(-3);
        const risks = recent.map(t => t.totalRisk);
        
        if (risks[2] > risks[1] && risks[1] > risks[0]) {
          trendsData.escalating = true;
          trendsData.severity = Math.max(trendsData.severity, risks[2]);
        }
      }
    }
    
    return trendsData;
  }

  getScoreColor(score) {
    if (score >= 75) return '#ff4444';
    if (score >= 50) return '#ffaa00';
    if (score >= 25) return '#ffff00';
    return '#44ff44';
  }
}