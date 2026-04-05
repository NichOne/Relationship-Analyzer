import { RelationshipMetrics } from './metrics.js';

export class ComparisonTable {
  constructor(analyzer) {
    this.analyzer = analyzer;
  }

  render(container, selected) {
    const results = container.querySelector('#comparison-results');
    results.innerHTML = '';
    results.className = 'results';

    const compareData = selected.map(person => this.getPersonData(person));

    const table = this.createTable(selected, compareData);
    results.appendChild(table);

    const summary = this.createSummary(compareData);
    results.appendChild(summary);
  }

  createTable(selected, compareData) {
    const table = document.createElement('div');
    table.style.cssText = 'overflow-x: auto; margin-top: 16px;';
    
    let html = `
      <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
        <thead>
          <tr style="border-bottom: 1px solid #333;">
            <th style="text-align: left; padding: 8px; color: #aaa;">Metric</th>
            ${selected.map(p => `<th style="text-align: center; padding: 8px; font-weight: 700;">${p}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
    `;

    const metrics = [
      { name: 'Social Debt', key: 'debt', value: d => d?.leverageScore || 0 },
      { name: 'Emotional Risk', key: 'emotional', value: d => d?.totalRisk || 0 },
      { name: 'Network Power', key: 'network', value: d => d?.powerScore || 0 },
      { name: 'Boundary Threat', key: 'boundary', value: d => d?.totalThreat || 0 },
      { name: 'Status Games', key: 'status', value: d => d?.totalScore || 0 },
      { name: 'Intimacy Risk', key: 'intimacy', value: d => d?.totalRisk || 0 }
    ];

    metrics.forEach(metric => {
      html += `<tr style="border-bottom: 1px solid #222;">
        <td style="padding: 8px; color: #aaa;">${metric.name}</td>`;
      
      compareData.forEach(person => {
        const value = metric.value(person[metric.key]);
        const color = RelationshipMetrics.getScoreColor(value);
        html += `<td style="text-align: center; padding: 8px;">
          <span style="color: ${color}; font-weight: 700;">${Math.round(value)}</span>
        </td>`;
      });
      
      html += '</tr>';
    });

    html += '</tbody></table>';
    table.innerHTML = html;
    return table;
  }

  createSummary(compareData) {
    const summary = document.createElement('div');
    summary.style.cssText = 'margin-top: 16px; padding: 12px; background: #111; border: 1px solid #333; border-radius: 4px; font-size: 11px; line-height: 1.6;';
    summary.innerHTML = `<div style="font-weight: 700; margin-bottom: 8px;">Comparative Insights:</div>`;
    
    const insights = this.generateInsights(compareData);
    insights.forEach(insight => {
      summary.innerHTML += `<div style="margin-bottom: 4px; color: #aaa;">• ${insight}</div>`;
    });
    
    return summary;
  }

  generateInsights(compareData) {
    const insights = [];
    
    const risks = compareData.map(p => {
      const total = (p.debt?.leverageScore || 0) + (p.emotional?.totalRisk || 0) + 
                    (p.boundary?.totalThreat || 0) + (p.intimacy?.totalRisk || 0);
      return { name: p.name, risk: total };
    });
    
    const highest = risks.reduce((max, r) => r.risk > max.risk ? r : max, risks[0]);
    if (highest.risk > 150) {
      insights.push(`${highest.name} shows the highest overall risk profile`);
    }

    const powerNodes = compareData.filter(p => (p.network?.powerScore || 0) >= 70);
    if (powerNodes.length > 0) {
      insights.push(`${powerNodes.map(p => p.name).join(', ')} control significant network access`);
    }

    const violators = compareData.filter(p => (p.boundary?.totalThreat || 0) >= 60);
    if (violators.length > 0) {
      insights.push(`${violators.map(p => p.name).join(', ')} exhibit severe boundary violations`);
    }

    const transactional = compareData.filter(p => (p.status?.totalScore || 0) >= 65);
    if (transactional.length > 0) {
      insights.push(`${transactional.map(p => p.name).join(', ')} appear purely transactional`);
    }

    if (insights.length === 0) {
      insights.push('No critical patterns detected across selected relationships');
    }

    return insights;
  }

  getPersonData(person) {
    return {
      name: person,
      debt: this.analyzer.modules.debt?.analyses.find(a => a.person === person),
      emotional: this.analyzer.modules.emotional?.analyses.find(a => a.person === person),
      network: this.analyzer.modules.network?.people.find(p => p.name === person),
      boundary: this.analyzer.modules.boundary?.scans.find(s => s.person === person),
      status: this.analyzer.modules.status?.analyses.find(a => a.person === person),
      intimacy: this.analyzer.modules.intimacy?.alerts.find(a => a.person === person)
    };
  }
}