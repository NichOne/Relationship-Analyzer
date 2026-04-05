export class About {
  render() {
    const container = document.createElement('div');
    container.className = 'module';

    container.innerHTML = `
      <div style="max-width: 700px;">
        <h1 style="font-size: 20px; font-weight: 700; margin-bottom: 12px;">Relationship Analyzer</h1>
        <p style="font-size: 12px; color: #666; margin-bottom: 8px;">A framework for identifying manipulation patterns and power dynamics</p>
        <p style="font-size: 11px; color: #888; margin-bottom: 24px; font-style: italic;">Final iteration — Complete and feature-locked</p>

        <div style="background: #0a0a0a; border: 1px solid #333; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
          <h2 style="font-size: 14px; font-weight: 700; margin-bottom: 12px;">What is this?</h2>
          <p style="font-size: 12px; line-height: 1.6; color: #aaa; margin-bottom: 12px;">
            This is a systematic toolkit for analyzing relationships through the lens of power dynamics, emotional manipulation, and social control. It helps you identify patterns that are often invisible in the moment but become clear when examined with structured frameworks.
          </p>
          <p style="font-size: 12px; line-height: 1.6; color: #aaa; margin-bottom: 12px;">
            The analyzer is designed to reveal covert manipulation tactics—from intermittent reinforcement and trauma bonding to weaponized intimacy and social credit systems.
          </p>
          <p style="font-size: 12px; line-height: 1.6; color: #aaa;">
            <strong>Platform-independent architecture:</strong> This tool uses your own LLM provider (Together.ai, OpenRouter, or Local LLM) for AI analysis, ensuring sovereignty and portability. All data stays in your browser's local storage.
          </p>
        </div>

        <div style="background: #0a0a0a; border: 1px solid #333; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
          <h2 style="font-size: 14px; font-weight: 700; margin-bottom: 12px;">Analysis Modules</h2>
          
          <div style="margin-bottom: 16px;">
            <h3 style="font-size: 13px; font-weight: 700; margin-bottom: 6px; color: #fff;">Social Debt Tracker</h3>
            <p style="font-size: 11px; line-height: 1.6; color: #aaa;">
              Maps favors, obligations, and guilt-based leverage. Identifies when past actions are weaponized to manufacture compliance through unspoken debts and explicit scorekeeping.
            </p>
          </div>

          <div style="margin-bottom: 16px;">
            <h3 style="font-size: 13px; font-weight: 700; margin-bottom: 6px; color: #fff;">Emotional Bait Detector</h3>
            <p style="font-size: 11px; line-height: 1.6; color: #aaa;">
              Analyzes patterns of intermittent reinforcement, love-bombing cycles, and trauma bonding. Tracks hot/cold emotional patterns that create addiction-like attachment.
            </p>
          </div>

          <div style="margin-bottom: 16px;">
            <h3 style="font-size: 13px; font-weight: 700; margin-bottom: 6px; color: #fff;">Network Power Mapper</h3>
            <p style="font-size: 11px; line-height: 1.6; color: #aaa;">
              Visualizes who controls access to resources, information, and opportunities. Maps hierarchies, reputation flow, and political maneuvering within social networks.
            </p>
          </div>

          <div style="margin-bottom: 16px;">
            <h3 style="font-size: 13px; font-weight: 700; margin-bottom: 6px; color: #fff;">Boundary Scanner</h3>
            <p style="font-size: 11px; line-height: 1.6; color: #aaa;">
              Measures boundary violations, guilt-tripping, gaslighting, and manufactured obligations. Tracks how well your autonomy is respected versus penetrated.
            </p>
          </div>

          <div style="margin-bottom: 16px;">
            <h3 style="font-size: 13px; font-weight: 700; margin-bottom: 6px; color: #fff;">Status Decoder</h3>
            <p style="font-size: 11px; line-height: 1.6; color: #aaa;">
              Identifies purely transactional relationships, social climbing, virtue signaling, and name-dropping. Reveals when you're valued for utility rather than genuine connection.
            </p>
          </div>

          <div style="margin-bottom: 16px;">
            <h3 style="font-size: 13px; font-weight: 700; margin-bottom: 6px; color: #fff;">Intimacy Weaponization Alert</h3>
            <p style="font-size: 11px; line-height: 1.6; color: #aaa;">
              Detects when vulnerabilities are extracted and used against you. Measures one-sided sharing, pressure to disclose, and historical weaponization of secrets.
            </p>
          </div>

          <div style="margin-bottom: 0;">
            <h3 style="font-size: 13px; font-weight: 700; margin-bottom: 6px; color: #fff;">Social Credit System</h3>
            <p style="font-size: 11px; line-height: 1.6; color: #aaa;">
              Analyzes communities/groups as reputation-based control mechanisms. Identifies fear-based compliance, conformity pressure, and social punishment for dissent.
            </p>
          </div>
        </div>

        <div style="background: #0a0a0a; border: 1px solid #333; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
          <h2 style="font-size: 14px; font-weight: 700; margin-bottom: 12px;">Key Metrics Explained</h2>
          
          <div style="margin-bottom: 12px;">
            <h3 style="font-size: 12px; font-weight: 700; margin-bottom: 4px; color: #fff;">Co-dependency Index</h3>
            <p style="font-size: 11px; line-height: 1.6; color: #aaa;">
              Aggregate measure of emotional manipulation, network dependencies, and boundary violations. High scores indicate loss of autonomy and unhealthy attachment.
            </p>
          </div>

          <div style="margin-bottom: 12px;">
            <h3 style="font-size: 12px; font-weight: 700; margin-bottom: 4px; color: #fff;">Emotional Leverage Score</h3>
            <p style="font-size: 11px; line-height: 1.6; color: #aaa;">
              Combines social debt, emotional bait patterns, and intimacy weaponization to measure how much others can manipulate you emotionally.
            </p>
          </div>

          <div style="margin-bottom: 12px;">
            <h3 style="font-size: 12px; font-weight: 700; margin-bottom: 4px; color: #fff;">Boundary Integrity Rating</h3>
            <p style="font-size: 11px; line-height: 1.6; color: #aaa;">
              How well your boundaries are respected. Low scores indicate chronic violations, gaslighting, and penetration of your autonomy.
            </p>
          </div>

          <div style="margin-bottom: 0;">
            <h3 style="font-size: 12px; font-weight: 700; margin-bottom: 4px; color: #fff;">Predictive Risk Score</h3>
            <p style="font-size: 11px; line-height: 1.6; color: #aaa;">
              Forecasts escalation based on patterns and trends. Multiple high-risk relationships, increasing debt scores, and escalating emotional patterns raise this metric.
            </p>
          </div>
        </div>

        <div style="background: #0a0a0a; border: 1px solid #333; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
          <h2 style="font-size: 14px; font-weight: 700; margin-bottom: 12px;">Features</h2>
          <ul style="font-size: 11px; line-height: 1.8; color: #aaa; padding-left: 20px;">
            <li>Visual network mapping with drag-and-drop nodes</li>
            <li>Trend analysis with historical snapshots</li>
            <li>Side-by-side comparison of relationships</li>
            <li>Privacy controls (visible, private, hidden, archived)</li>
            <li>Tag system for pattern recognition</li>
            <li>Notes with critical incident highlighting</li>
            <li>Quick-add action buttons for rapid logging</li>
            <li>Notification center for alerts</li>
            <li>Undo/redo functionality</li>
            <li>Customizable dashboard widgets</li>
            <li>CSV export for external analysis</li>
            <li>Light/dark theme toggle</li>
            <li>Mobile-responsive with swipe navigation</li>
            <li>AI-powered analysis with configurable providers (Together.ai, OpenRouter, Local LLM)</li>
            <li>Local-first architecture with browser storage</li>
            <li>Platform-independent and portable</li>
          </ul>
        </div>

        <div style="background: #0a0a0a; border: 1px solid #333; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
          <h2 style="font-size: 14px; font-weight: 700; margin-bottom: 12px;">How to Use</h2>
          <ol style="font-size: 11px; line-height: 1.8; color: #aaa; padding-left: 20px;">
            <li>Start with the <strong>Overview</strong> to see aggregate metrics across all relationships</li>
            <li>Use individual modules to analyze specific people or situations</li>
            <li>Tag relationships with patterns (gaslighting, manipulation, genuine, etc.)</li>
            <li>Add notes to document incidents—critical keywords are auto-highlighted</li>
            <li>Set privacy levels to control visibility and exports</li>
            <li>Use the <strong>Compare</strong> tab to visualize networks and compare people side-by-side</li>
            <li>Check the <strong>Notifications</strong> center for critical alerts</li>
            <li>Save snapshots to track changes over time</li>
            <li>Export to CSV for deeper analysis in spreadsheet tools</li>
            <li>Use the <strong>AI Analyzer</strong> to apply the framework to any scenario or text</li>
          </ol>
        </div>

        <div style="background: #1a0a00; border: 1px solid #ff8800; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
          <h2 style="font-size: 14px; font-weight: 700; margin-bottom: 12px; color: #ff8800;">Important Notes</h2>
          <p style="font-size: 11px; line-height: 1.6; color: #aaa; margin-bottom: 12px;">
            This tool is designed to help you identify patterns, not to diagnose psychological conditions. High scores indicate concerning dynamics that warrant attention, reflection, and potentially professional support.
          </p>
          <p style="font-size: 11px; line-height: 1.6; color: #aaa; margin-bottom: 12px;">
            The framework is based on recognized manipulation tactics and power dynamics from psychology, sociology, and relationship research. However, human relationships are complex—use this as one lens among many.
          </p>
          <p style="font-size: 11px; line-height: 1.6; color: #aaa;">
            <strong>Privacy & Data Sovereignty:</strong> All relationship data and analysis stays in your browser. AI features require you to configure your own LLM provider API key in Settings. Your data never leaves your control.
          </p>
        </div>

        <div style="background: #0a0a0a; border: 1px solid #333; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
          <h2 style="font-size: 14px; font-weight: 700; margin-bottom: 12px;">Methodology</h2>
          <p style="font-size: 11px; line-height: 1.6; color: #aaa; margin-bottom: 12px;">
            The analyzer uses quantitative scoring across multiple dimensions to create composite metrics. Scores are calibrated to:
          </p>
          <ul style="font-size: 11px; line-height: 1.8; color: #aaa; padding-left: 20px; margin-bottom: 12px;">
            <li><strong>0-24:</strong> Healthy/safe patterns</li>
            <li><strong>25-49:</strong> Caution—watch for escalation</li>
            <li><strong>50-74:</strong> Warning—concerning patterns present</li>
            <li><strong>75-100:</strong> Critical—severe manipulation/abuse indicators</li>
          </ul>
          <p style="font-size: 11px; line-height: 1.6; color: #aaa;">
            Trend analysis tracks changes over time to forecast escalation. The predictive risk score combines current scores with trajectory analysis to identify worsening patterns before they become severe.
          </p>
        </div>

        <div style="background: #0a0a0a; border: 1px solid #333; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
          <h2 style="font-size: 14px; font-weight: 700; margin-bottom: 12px;">Technical Architecture</h2>
          <p style="font-size: 11px; line-height: 1.6; color: #aaa; margin-bottom: 12px;">
            <strong>Platform Independence:</strong> This tool is designed to survive platform shutdowns and API changes. It uses a provider abstraction layer that supports:
          </p>
          <ul style="font-size: 11px; line-height: 1.8; color: #aaa; padding-left: 20px; margin-bottom: 12px;">
            <li><strong>Together.ai:</strong> Direct API access with model selection</li>
            <li><strong>OpenRouter:</strong> Multi-provider routing with unified billing</li>
            <li><strong>Local LLM:</strong> Full sovereignty via LM Studio, Ollama, or other OpenAI-compatible endpoints</li>
          </ul>
          <p style="font-size: 11px; line-height: 1.6; color: #aaa; margin-bottom: 12px;">
            All relationship data is stored in browser localStorage. No external database. No vendor lock-in. Your analysis artifacts persist independent of any platform.
          </p>
          <p style="font-size: 11px; line-height: 1.6; color: #aaa;">
            To preserve your work: Export to CSV periodically, back up localStorage, or fork this project to GitHub for version control.
          </p>
        </div>

        <div style="background: #0a1a0a; border: 1px solid #2a4a2a; border-radius: 8px; padding: 16px;">
          <h2 style="font-size: 14px; font-weight: 700; margin-bottom: 12px; color: #4a8a4a;">Project Status: Final Iteration</h2>
          <p style="font-size: 11px; line-height: 1.6; color: #aaa; margin-bottom: 12px;">
            This is the final, complete version of the Relationship Analyzer. All core features have been implemented and refined:
          </p>
          <ul style="font-size: 11px; line-height: 1.8; color: #aaa; padding-left: 20px; margin-bottom: 12px;">
            <li>Seven comprehensive analysis modules for relationship dynamics</li>
            <li>Network visualization with interactive graph controls</li>
            <li>Dashboard with trend analysis and predictive risk scoring</li>
            <li>AI-powered analysis with configurable LLM providers</li>
            <li>Complete data sovereignty with local-first architecture</li>
            <li>Export capabilities and snapshot comparison tools</li>
            <li>Mobile-responsive design with touch controls</li>
          </ul>
          <p style="font-size: 11px; line-height: 1.6; color: #aaa;">
            The tool is feature-complete and ready for use. All functionality has been tested and optimized. This version represents the culmination of iterative development focused on providing a comprehensive, privacy-first relationship analysis framework.
          </p>
        </div>
      </div>
    `;

    return container;
  }
}