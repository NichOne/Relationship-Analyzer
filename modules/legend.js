export class Legend {
  render() {
    const container = document.createElement('div');
    container.className = 'module';

    container.innerHTML = `
      <div style="font-size: 14px; font-weight: 700; margin-bottom: 16px;">Metrics & Colors Guide</div>
      
      <div style="margin-bottom: 24px;">
        <div style="font-size: 12px; font-weight: 700; margin-bottom: 8px; color: #aaa;">Score Ranges</div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 40px; height: 8px; background: #44ff44; border-radius: 4px;"></div>
            <span style="font-size: 11px;">0-24: Safe/Healthy</span>
          </div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 40px; height: 8px; background: #ffff00; border-radius: 4px;"></div>
            <span style="font-size: 11px;">25-49: Caution</span>
          </div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 40px; height: 8px; background: #ffaa00; border-radius: 4px;"></div>
            <span style="font-size: 11px;">50-74: Warning</span>
          </div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 40px; height: 8px; background: #ff4444; border-radius: 4px;"></div>
            <span style="font-size: 11px;">75-100: Critical</span>
          </div>
        </div>
      </div>

      <div style="margin-bottom: 24px;">
        <div style="font-size: 12px; font-weight: 700; margin-bottom: 8px; color: #aaa;">Network Map Indicators</div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 20px; height: 20px; background: #ff4444; border-radius: 50%; font-size: 10px; display: flex; align-items: center; justify-content: center;">⚠</div>
            <span style="font-size: 11px;">Emotional Bait Detected</span>
          </div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 20px; height: 20px; background: #ff8800; border-radius: 50%; font-size: 10px; display: flex; align-items: center; justify-content: center;">!</div>
            <span style="font-size: 11px;">Boundary Violation</span>
          </div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 20px; height: 20px; background: #8800ff; border-radius: 50%; font-size: 10px; display: flex; align-items: center; justify-content: center;">👑</div>
            <span style="font-size: 11px;">Reputation Control</span>
          </div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 20px; height: 20px; background: #00ff88; border-radius: 50%; font-size: 10px; display: flex; align-items: center; justify-content: center;">♟</div>
            <span style="font-size: 11px;">Political Maneuvering</span>
          </div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 24px; height: 24px; border-radius: 50%; box-shadow: 0 0 10px rgba(255, 68, 68, 0.8); background: rgba(255,68,68,0.2); border: 1px solid #ff4444;"></div>
            <span style="font-size: 11px;">High Leverage Relationship</span>
          </div>
        </div>
      </div>

      <div style="margin-bottom: 24px;">
        <div style="font-size: 12px; font-weight: 700; margin-bottom: 8px; color: #aaa;">Trust Levels</div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 20px; height: 20px; border: 2px solid #44ff44; border-radius: 50%;"></div>
            <span style="font-size: 11px;">High Trust (60-100)</span>
          </div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 20px; height: 20px; border: 2px solid #ffaa00; border-radius: 50%;"></div>
            <span style="font-size: 11px;">Low Trust (40-59)</span>
          </div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 20px; height: 20px; border: 2px solid #ff4444; border-radius: 50%;"></div>
            <span style="font-size: 11px;">No Trust (0-39)</span>
          </div>
        </div>
      </div>

      <div style="margin-bottom: 24px;">
        <div style="font-size: 12px; font-weight: 700; margin-bottom: 8px; color: #aaa;">Key Metrics Explained</div>
        <div style="background: #0a0a0a; border: 1px solid #333; border-radius: 4px; padding: 12px; font-size: 11px; line-height: 1.6;">
          <div style="margin-bottom: 8px;"><strong>Social Debt:</strong> Measures leverage from favors, obligations, and guilt-based control</div>
          <div style="margin-bottom: 8px;"><strong>Emotional Risk:</strong> Tracks manipulation patterns like intermittent reinforcement, love-bombing, trauma bonding</div>
          <div style="margin-bottom: 8px;"><strong>Network Power:</strong> Evaluates control over access, information, and opportunities</div>
          <div style="margin-bottom: 8px;"><strong>Boundary Threat:</strong> Assesses violations of your autonomy and personal limits</div>
          <div style="margin-bottom: 8px;"><strong>Status Games:</strong> Identifies transactional relationships and social climbing behavior</div>
          <div style="margin-bottom: 8px;"><strong>Intimacy Risk:</strong> Detects weaponization of vulnerability and one-sided sharing</div>
          <div style="margin-bottom: 8px;"><strong>Co-dependency Index:</strong> Overall measure of unhealthy attachment and loss of autonomy</div>
          <div><strong>Predictive Risk:</strong> Forecast of manipulation escalation based on patterns and trends</div>
        </div>
      </div>

      <div style="margin-bottom: 24px;">
        <div style="font-size: 12px; font-weight: 700; margin-bottom: 8px; color: #aaa;">Privacy Levels</div>
        <div style="display: flex; flex-direction: column; gap: 6px; font-size: 11px;">
          <div><strong>Visible:</strong> Shown in all views and exports</div>
          <div><strong>Private:</strong> Shown only to you, excluded from exports</div>
          <div><strong>Hidden:</strong> Hidden from normal views but can be accessed</div>
          <div><strong>Archived:</strong> Excluded from active analysis, stored for reference</div>
        </div>
      </div>

      <div style="background: #0a1a0a; border: 1px solid #2a4a2a; border-radius: 4px; padding: 12px; font-size: 10px; color: #4a8a4a;">
        <strong>Tip:</strong> Use quick-add buttons (bottom right) to rapidly log events. Access notification center to review all alerts.
      </div>
    `;

    return container;
  }
}