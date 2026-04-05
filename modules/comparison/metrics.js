// Shared metric calculation utilities for relationship analysis
export class RelationshipMetrics {
  static calculateInfluence(data) {
    const scores = [
      data.debt?.leverageScore || 0,
      data.emotional?.totalRisk || 0,
      data.network?.powerScore || 0,
      data.boundary?.totalThreat || 0,
      data.status?.totalScore || 0,
      data.intimacy?.totalRisk || 0
    ].filter(s => s > 0);

    return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  }

  static calculateTrust(data) {
    const riskScores = [
      data.debt?.leverageScore || 0,
      data.emotional?.totalRisk || 0,
      data.boundary?.totalThreat || 0,
      data.status?.totalScore || 0,
      data.intimacy?.totalRisk || 0
    ];
    
    const avgRisk = riskScores.reduce((a, b) => a + b, 0) / riskScores.length;
    return 100 - avgRisk;
  }

  static getTrustColor(trust) {
    if (trust >= 60) return '#44ff44';
    if (trust >= 40) return '#ffaa00';
    return '#ff4444';
  }

  static getScoreColor(score) {
    if (score >= 75) return '#ff4444';
    if (score >= 50) return '#ffaa00';
    if (score >= 25) return '#ffff00';
    return '#44ff44';
  }

  static getNodeBackground(type) {
    const backgrounds = {
      'friend': 'rgba(68, 255, 68, 0.1)',
      'partner': 'rgba(255, 68, 255, 0.1)',
      'coworker': 'rgba(68, 170, 255, 0.1)',
      'family': 'rgba(255, 170, 68, 0.1)',
      'other': 'rgba(170, 170, 170, 0.1)'
    };
    return backgrounds[type] || 'rgba(0, 0, 0, 0.3)';
  }
}