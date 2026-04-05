// Aggregates data from all analyzer modules into dashboard metrics
export class MetricsAggregator {
  constructor(analyzer) {
    this.analyzer = analyzer;
  }

  aggregate() {
    const debtModule = this.analyzer.modules.debt;
    const emotionalModule = this.analyzer.modules.emotional;
    const networkModule = this.analyzer.modules.network;
    const boundaryModule = this.analyzer.modules.boundary;
    const statusModule = this.analyzer.modules.status;
    const intimacyModule = this.analyzer.modules.intimacy;
    const creditModule = this.analyzer.modules.credit;

    // Calculate averages from all modules
    const debtAvg = this.calculateAverage(debtModule.analyses, 'leverageScore');
    const emotionalAvg = this.calculateAverage(emotionalModule.analyses, 'totalRisk');
    const networkPowerAvg = this.calculateAverage(networkModule.people, 'powerScore');
    const boundaryAvg = this.calculateAverage(boundaryModule.scans, 'totalThreat');
    const statusAvg = this.calculateAverage(statusModule.analyses, 'totalScore');
    const intimacyAvg = this.calculateAverage(intimacyModule.alerts, 'totalRisk');
    const communityToxicity = this.calculateAverage(creditModule.community, 'toxicityScore');
    const communityVulnerability = this.calculateAverage(creditModule.community, 'vulnerabilityScore');

    // Co-dependency index: emotional manipulation + network dependencies + boundary violations
    const codependency = (emotionalAvg * 0.4) + (networkPowerAvg * 0.3) + (boundaryAvg * 0.3);

    // Emotional leverage: debt + emotional bait + intimacy weaponization
    const leverage = (debtAvg * 0.3) + (emotionalAvg * 0.4) + (intimacyAvg * 0.3);

    // Social obligation debt: debt tracking + community control + network dependencies
    const obligation = (debtAvg * 0.4) + (communityToxicity * 0.3) + (networkPowerAvg * 0.3);

    // Boundary integrity: inverse of boundary violations
    const boundaryIntegrity = boundaryModule.scans.length > 0
      ? boundaryModule.scans.reduce((sum, b) => sum + b.boundaryRespect, 0) / boundaryModule.scans.length
      : 100;

    // Authenticity vs Performance: inverse of status games and transactional dynamics
    const transactionalAvg = this.calculateAverage(statusModule.analyses, 'transactionalScore');
    const authenticity = Math.max(0, 100 - ((statusAvg * 0.5) + (transactionalAvg * 0.3) + (communityToxicity * 0.2)));

    // Total relationship count
    const totalRelationships = debtModule.analyses.length + emotionalModule.analyses.length + 
                               networkModule.people.length + boundaryModule.scans.length + 
                               statusModule.analyses.length + intimacyModule.alerts.length;

    // Critical alerts
    const criticalAlerts = this.collectCriticalAlerts({
      codependency,
      leverage,
      obligation,
      boundaryIntegrity,
      authenticity,
      debtModule,
      emotionalModule,
      networkModule,
      boundaryModule,
      statusModule,
      intimacyModule,
      creditModule
    });

    return {
      codependency: Math.round(codependency),
      leverage: Math.round(leverage),
      obligation: Math.round(obligation),
      boundary: Math.round(boundaryIntegrity),
      authenticity: Math.round(authenticity),
      criticalAlerts,
      totalRelationships,
      totalCommunities: creditModule.community.length
    };
  }

  calculateAverage(items, property) {
    if (items.length === 0) return 0;
    return items.reduce((sum, item) => sum + item[property], 0) / items.length;
  }

  collectCriticalAlerts(data) {
    const alerts = [];
    
    if (data.codependency >= 70) {
      alerts.push('Severe co-dependency detected across relationships');
    }
    if (data.leverage >= 70) {
      alerts.push('High emotional leverage vulnerability');
    }
    if (data.obligation >= 70) {
      alerts.push('Heavy social obligation debt load');
    }
    if (data.boundaryIntegrity <= 30) {
      alerts.push('Critical boundary integrity failure');
    }
    if (data.authenticity <= 30) {
      alerts.push('Predominantly transactional/performative relationships');
    }

    // Module-specific alerts
    const manipulativeDebts = data.debtModule.analyses.filter(d => d.manipulationRisk);
    if (manipulativeDebts.length > 0) {
      alerts.push(`${manipulativeDebts.length} debt(s) being weaponized: ${manipulativeDebts.map(d => d.person).join(', ')}`);
    }

    const highRiskEmotional = data.emotionalModule.analyses.filter(e => e.totalRisk >= 60);
    if (highRiskEmotional.length > 0) {
      alerts.push(`${highRiskEmotional.length} emotional manipulation pattern(s): ${highRiskEmotional.map(e => e.person).join(', ')}`);
    }

    const highPowerNodes = data.networkModule.people.filter(p => p.powerScore >= 70);
    if (highPowerNodes.length > 0) {
      alerts.push(`${highPowerNodes.length} person(s) with excessive power: ${highPowerNodes.map(p => p.name).join(', ')}`);
    }

    const severeBoundaryViolations = data.boundaryModule.scans.filter(b => b.totalThreat >= 60);
    if (severeBoundaryViolations.length > 0) {
      alerts.push(`${severeBoundaryViolations.length} severe boundary violator(s): ${severeBoundaryViolations.map(b => b.person).join(', ')}`);
    }

    const transactionalRelationships = data.statusModule.analyses.filter(s => s.totalScore >= 65);
    if (transactionalRelationships.length > 0) {
      alerts.push(`${transactionalRelationships.length} purely transactional relationship(s): ${transactionalRelationships.map(s => s.person).join(', ')}`);
    }

    const weaponizedIntimacy = data.intimacyModule.alerts.filter(i => i.weaponizationScore >= 66);
    if (weaponizedIntimacy.length > 0) {
      alerts.push(`${weaponizedIntimacy.length} actively weaponizing intimacy: ${weaponizedIntimacy.map(i => i.person).join(', ')}`);
    }

    const toxicCommunities = data.creditModule.community.filter(c => c.toxicityScore >= 70);
    if (toxicCommunities.length > 0) {
      alerts.push(`${toxicCommunities.length} toxic social control system(s): ${toxicCommunities.map(c => c.community).join(', ')}`);
    }

    return alerts;
  }
}