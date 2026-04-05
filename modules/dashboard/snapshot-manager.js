export class SnapshotManager {
  constructor() {
    this.snapshots = JSON.parse(localStorage.getItem('relationshipSnapshots') || '[]');
  }

  save(name, data) {
    this.snapshots.push({
      id: Date.now(),
      name,
      timestamp: Date.now(),
      data
    });
    localStorage.setItem('relationshipSnapshots', JSON.stringify(this.snapshots));
  }

  getAll() {
    return this.snapshots;
  }

  renderComparison(container, snapshotData, currentData) {
    const metrics = ['codependency', 'leverage', 'obligation', 'boundary', 'authenticity'];
    const metricNames = {
      codependency: 'Co-dependency',
      leverage: 'Leverage',
      obligation: 'Obligation',
      boundary: 'Boundary',
      authenticity: 'Authenticity'
    };
    
    container.innerHTML = `
      <div style="margin-top: 12px; padding: 12px; background: #0a0a0a; border: 1px solid #333; border-radius: 4px;">
        <div style="font-size: 11px; font-weight: 700; margin-bottom: 8px; color: #aaa;">Changes Since Snapshot</div>
        ${metrics.map(key => {
          const change = currentData[key] - snapshotData[key];
          const changeColor = Math.abs(change) < 5 ? '#666' : change > 0 ? '#ff4444' : '#44ff44';
          const arrow = change > 0 ? '↑' : change < 0 ? '↓' : '→';
          return `
            <div style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #111;">
              <span style="font-size: 11px;">${metricNames[key]}</span>
              <span style="font-size: 11px; color: ${changeColor}; font-weight: 700;">
                ${arrow} ${Math.abs(change).toFixed(0)} ${change !== 0 ? (change > 0 ? '(worse)' : '(better)') : ''}
              </span>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }
}