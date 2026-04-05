import { RelationshipMetrics } from './metrics.js';

// Modal for displaying detailed node information
export class NodeDetailsModal {
  constructor(analyzer) {
    this.analyzer = analyzer;
  }

  show(node) {
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #000;
      border: 2px solid #fff;
      border-radius: 8px;
      padding: 20px;
      max-width: 400px;
      width: 90%;
      z-index: 1000;
      max-height: 80vh;
      overflow-y: auto;
    `;

    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      z-index: 999;
    `;

    const intensity = node.intensity || 'unset';
    const type = node.type || 'unset';
    const notes = this.analyzer.tagManager.getNotes(node.name);

    modal.innerHTML = `
      <div style="margin-bottom: 16px;">
        <div style="font-size: 16px; font-weight: 700; margin-bottom: 8px;">${node.name}</div>
        <div style="font-size: 11px; color: #aaa;">
          <div>Type: ${type}</div>
          <div>Intensity: ${intensity}</div>
          <div style="margin-top: 4px;">Influence Score: <span style="color: ${RelationshipMetrics.getScoreColor(node.influence)}; font-weight: 700;">${Math.round(node.influence)}/100</span></div>
        </div>
      </div>

      ${notes ? `
        <div style="margin-bottom: 12px; padding: 8px; background: #0a0a0a; border: 1px solid #333; border-radius: 4px;">
          <div style="font-size: 11px; color: #666; margin-bottom: 4px;">Notes:</div>
          <div style="font-size: 11px; color: #aaa; line-height: 1.5;">${notes}</div>
        </div>
      ` : ''}

      <div style="font-size: 11px;">
        <div style="font-weight: 700; margin-bottom: 6px;">Detailed Scores:</div>
        ${node.data.debt ? `<div style="color: #aaa;">Social Debt: ${node.data.debt.leverageScore}/100</div>` : ''}
        ${node.data.emotional ? `<div style="color: #aaa;">Emotional Risk: ${Math.round(node.data.emotional.totalRisk)}/100</div>` : ''}
        ${node.data.network ? `<div style="color: #aaa;">Network Power: ${node.data.network.powerScore}/100</div>` : ''}
        ${node.data.network ? `<div style="color: #aaa;">Reputation Control: ${node.data.network.reputationScore}/100</div>` : ''}
        ${node.data.network ? `<div style="color: #aaa;">Political Maneuvering: ${node.data.network.maneuveringScore}/100</div>` : ''}
        ${node.data.boundary ? `<div style="color: #aaa;">Boundary Threat: ${Math.round(node.data.boundary.totalThreat)}/100</div>` : ''}
        ${node.data.status ? `<div style="color: #aaa;">Status Games: ${Math.round(node.data.status.totalScore)}/100</div>` : ''}
        ${node.data.intimacy ? `<div style="color: #aaa;">Intimacy Risk: ${Math.round(node.data.intimacy.totalRisk)}/100</div>` : ''}
      </div>

      <button style="margin-top: 16px; width: 100%; padding: 10px; background: #fff; color: #000; border: none; font-family: inherit; font-weight: 700; border-radius: 4px; cursor: pointer;" id="close-modal">Close</button>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(modal);

    const closeModal = () => {
      document.body.removeChild(modal);
      document.body.removeChild(overlay);
    };

    modal.querySelector('#close-modal').addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
  }
}