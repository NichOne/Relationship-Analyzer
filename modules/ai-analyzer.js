export class AIAnalyzer {
  constructor(tagManager, llmProvider) {
    this.tagManager = tagManager;
    this.llmProvider = llmProvider;
    this.conversationHistory = [];
  }

  render() {
    const container = document.createElement('div');
    container.className = 'module';

    container.innerHTML = `
      <div style="margin-bottom: 16px;">
        <h2 style="font-size: 16px; font-weight: 700; margin-bottom: 8px;">AI Relationship Analyzer</h2>
        <p style="font-size: 11px; color: #666; line-height: 1.6;">
          Paste a conversation, describe a situation, or ask questions. The AI will analyze it using the relationship analysis framework to identify manipulation patterns, power dynamics, and concerning behaviors.
        </p>
      </div>

      <div class="input-group">
        <label>Text to Analyze</label>
        <textarea id="ai-input" placeholder="Paste a conversation, describe a situation, or ask a question about a relationship dynamic..." style="min-height: 120px;"></textarea>
      </div>

      <div class="input-group">
        <label>Analysis Type</label>
        <select id="analysis-type">
          <option value="full">Full Framework Analysis</option>
          <option value="debt">Social Debt Focus</option>
          <option value="emotional">Emotional Manipulation Focus</option>
          <option value="boundary">Boundary Violations Focus</option>
          <option value="power">Power Dynamics Focus</option>
          <option value="conversation">Conversation Analysis</option>
          <option value="question">Answer Question</option>
        </select>
      </div>

      <button class="primary" id="analyze-ai">Analyze with AI</button>
      
      <div id="ai-results" style="margin-top: 20px;"></div>
    `;

    container.querySelector('#analyze-ai').addEventListener('click', () => {
      this.analyze(container);
    });

    return container;
  }

  async analyze(container) {
    const input = container.querySelector('#ai-input').value;
    const analysisType = container.querySelector('#analysis-type').value;
    const resultsDiv = container.querySelector('#ai-results');

    if (!input.trim()) {
      resultsDiv.innerHTML = `
        <div style="padding: 12px; background: #1a0a00; border: 1px solid #ff8800; border-radius: 4px; font-size: 11px; color: #ff8800;">
          Please enter text to analyze
        </div>
      `;
      return;
    }

    resultsDiv.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <div style="font-size: 12px; color: #aaa; margin-bottom: 8px;">Analyzing...</div>
        <div style="width: 100%; height: 4px; background: #111; border-radius: 2px; overflow: hidden;">
          <div style="width: 30%; height: 100%; background: #fff; animation: loading 1.5s infinite;"></div>
        </div>
      </div>
      <style>
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      </style>
    `;

    const systemPrompt = this.getSystemPrompt(analysisType);

    try {
      const userMessage = {
        role: "user",
        content: input
      };

      this.conversationHistory.push(userMessage);
      this.conversationHistory = this.conversationHistory.slice(-10);

      const completion = await this.llmProvider.chat([
        {
          role: "system",
          content: systemPrompt
        },
        ...this.conversationHistory
      ]);

      const response = completion.content;
      this.conversationHistory.push(completion);

      this.renderResults(resultsDiv, response, input, analysisType);

    } catch (error) {
      console.error('LLM Error:', error);
      resultsDiv.innerHTML = `
        <div style="padding: 12px; background: #1a0000; border: 1px solid #ff4444; border-radius: 4px; font-size: 11px; color: #ff4444;">
          ${error.message || 'Error analyzing text. Please check your API configuration in Settings.'}
        </div>
      `;
    }
  }

  getSystemPrompt(analysisType) {
    const baseContext = `You are an expert relationship analyst specializing in identifying manipulation patterns, power dynamics, and emotional abuse tactics. You use a systematic framework that includes:

- Social Debt: Favors weaponized for control, guilt-based leverage, unspoken obligations
- Emotional Manipulation: Intermittent reinforcement, love-bombing, trauma bonding
- Boundary Violations: Gaslighting, guilt-tripping, manufactured obligations
- Power Dynamics: Information control, access gatekeeping, reputation manipulation
- Status Games: Transactional relationships, social climbing, virtue signaling
- Intimacy Weaponization: Vulnerability extraction, one-sided sharing, secret weaponization

For each analysis, provide:
1. Pattern identification
2. Severity scoring (0-100 scale where 75+ is critical)
3. Specific red flags
4. Concrete observations
5. Actionable recommendations

Be direct and unflinching. Call out manipulation when you see it.`;

    const typeSpecific = {
      full: "Analyze the input comprehensively across all framework dimensions. Provide scores for each category and an overall assessment.",
      debt: "Focus on social debt patterns: favors, obligations, guilt-tripping, scorekeeping, and leverage tactics. Identify how past actions are weaponized.",
      emotional: "Focus on emotional manipulation: intermittent reinforcement, love-bombing cycles, hot/cold patterns, and trauma bonding. Track addiction-like attachment patterns.",
      boundary: "Focus on boundary violations: how well autonomy is respected, gaslighting, guilt-tripping, and manufactured obligations. Identify reality distortion.",
      power: "Focus on power dynamics: who controls access to what, information asymmetry, hierarchy positioning, and reputation control. Map the power structure.",
      conversation: "Analyze the conversation for manipulation tactics, power plays, subtext, and concerning patterns. Decode what's really happening beneath the surface.",
      question: "Answer the question using relationship analysis frameworks. Provide clear, actionable insights."
    };

    return `${baseContext}\n\n${typeSpecific[analysisType]}`;
  }

  renderResults(container, analysis, input, analysisType) {
    container.innerHTML = `
      <div style="background: #0a0a0a; border: 1px solid #333; border-radius: 8px; padding: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <div style="font-size: 13px; font-weight: 700;">AI Analysis Results</div>
          <div style="font-size: 10px; color: #666; text-transform: uppercase;">${analysisType.replace('_', ' ')}</div>
        </div>
        
        <div style="background: #111; border: 1px solid #222; border-radius: 4px; padding: 12px; margin-bottom: 16px; font-size: 11px; color: #888; line-height: 1.6; max-height: 100px; overflow-y: auto;">
          <strong style="color: #aaa;">Input:</strong> ${input.substring(0, 200)}${input.length > 200 ? '...' : ''}
        </div>

        <div style="font-size: 12px; line-height: 1.7; color: #aaa; white-space: pre-wrap;">${this.formatAnalysis(analysis)}</div>

        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #222; display: flex; gap: 8px;">
          <button id="continue-conversation" style="flex: 1; padding: 10px; background: #333; color: #fff; border: none; font-family: inherit; font-size: 11px; font-weight: 700; border-radius: 4px; cursor: pointer;">
            Ask Follow-up
          </button>
          <button id="clear-conversation" style="flex: 1; padding: 10px; background: #111; color: #666; border: 1px solid #333; font-family: inherit; font-size: 11px; font-weight: 700; border-radius: 4px; cursor: pointer;">
            Clear Chat
          </button>
        </div>
      </div>
    `;

    container.querySelector('#continue-conversation').addEventListener('click', () => {
      document.querySelector('#ai-input').value = '';
      document.querySelector('#ai-input').focus();
      document.querySelector('#ai-input').placeholder = 'Ask a follow-up question or add more context...';
    });

    container.querySelector('#clear-conversation').addEventListener('click', () => {
      this.conversationHistory = [];
      document.querySelector('#ai-input').value = '';
      document.querySelector('#ai-input').placeholder = 'Paste a conversation, describe a situation, or ask a question about a relationship dynamic...';
      container.innerHTML = '';
    });
  }

  formatAnalysis(text) {
    // Add some basic formatting to make the analysis more readable
    let formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #fff;">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em style="color: #ccc;">$1</em>')
      .replace(/^(#{1,3})\s+(.+)$/gm, (match, hashes, title) => {
        const level = hashes.length;
        const size = level === 1 ? '14px' : level === 2 ? '13px' : '12px';
        return `<div style="font-size: ${size}; font-weight: 700; margin: 12px 0 6px 0; color: #fff;">${title}</div>`;
      })
      .replace(/^- (.+)$/gm, '<div style="margin-left: 12px; margin-bottom: 4px;">• $1</div>')
      .replace(/(\d+\/100|\d+%)/g, '<span style="font-weight: 700; color: #ff8800;">$1</span>');

    return formatted;
  }
}