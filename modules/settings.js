export class Settings {
  constructor() {
    this.thresholds = this.loadThresholds();
  }

  loadThresholds() {
    const saved = localStorage.getItem('relationshipAnalyzerThresholds');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      debt: 60,
      emotional: 60,
      boundary: 60,
      status: 65,
      intimacy: 60,
      network: 70,
      codependency: 70,
      leverage: 70,
      obligation: 70
    };
  }

  saveThresholds(thresholds) {
    this.thresholds = thresholds;
    localStorage.setItem('relationshipAnalyzerThresholds', JSON.stringify(thresholds));
  }

  render() {
    const container = document.createElement('div');
    container.className = 'module';

    const llmConfig = window.llmProvider?.config || {
      provider: 'together',
      togetherApiKey: '',
      togetherModel: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
      openrouterApiKey: '',
      openrouterModel: 'meta-llama/llama-3.1-8b-instruct',
      localEndpoint: 'http://localhost:1234/v1',
      localModel: 'llama-3.1-8b'
    };

    container.innerHTML = `
      <div style="margin-bottom: 24px;">
        <div style="font-size: 13px; font-weight: 700; margin-bottom: 8px;">AI Provider Configuration</div>
        <div style="font-size: 11px; color: #666; margin-bottom: 16px;">
          Configure your LLM provider for AI analysis features
        </div>

        <div class="input-group">
          <label>Provider</label>
          <select id="llm-provider">
            <option value="together" ${llmConfig.provider === 'together' ? 'selected' : ''}>Together.ai</option>
            <option value="openrouter" ${llmConfig.provider === 'openrouter' ? 'selected' : ''}>OpenRouter</option>
            <option value="local" ${llmConfig.provider === 'local' ? 'selected' : ''}>Local LLM</option>
          </select>
        </div>

        <div id="together-config" style="display: ${llmConfig.provider === 'together' ? 'block' : 'none'};">
          <div class="input-group">
            <label>Together.ai API Key</label>
            <input type="password" id="together-api-key" value="${llmConfig.togetherApiKey}" placeholder="Enter your Together.ai API key">
            <div style="font-size: 10px; color: #666; margin-top: 4px;">Get your API key from <a href="https://api.together.xyz" target="_blank" style="color: #fff;">api.together.xyz</a></div>
          </div>
          <div class="input-group">
            <label>Model</label>
            <select id="together-model">
              ${window.llmProvider?.getAvailableModels().together.map(m => 
                `<option value="${m}" ${llmConfig.togetherModel === m ? 'selected' : ''}>${m}</option>`
              ).join('') || ''}
            </select>
          </div>
        </div>

        <div id="openrouter-config" style="display: ${llmConfig.provider === 'openrouter' ? 'block' : 'none'};">
          <div class="input-group">
            <label>OpenRouter API Key</label>
            <input type="password" id="openrouter-api-key" value="${llmConfig.openrouterApiKey}" placeholder="Enter your OpenRouter API key">
            <div style="font-size: 10px; color: #666; margin-top: 4px;">Get your API key from <a href="https://openrouter.ai/keys" target="_blank" style="color: #fff;">openrouter.ai/keys</a></div>
          </div>
          <div class="input-group">
            <label>Model</label>
            <select id="openrouter-model">
              ${window.llmProvider?.getAvailableModels().openrouter.map(m => 
                `<option value="${m}" ${llmConfig.openrouterModel === m ? 'selected' : ''}>${m}</option>`
              ).join('') || ''}
            </select>
          </div>
        </div>

        <div id="local-config" style="display: ${llmConfig.provider === 'local' ? 'block' : 'none'};">
          <div class="input-group">
            <label>Endpoint URL</label>
            <input type="text" id="local-endpoint" value="${llmConfig.localEndpoint}" placeholder="http://localhost:1234/v1">
            <div style="font-size: 10px; color: #666; margin-top: 4px;">OpenAI-compatible endpoint (e.g., LM Studio, Ollama with openai-compat)</div>
          </div>
          <div class="input-group">
            <label>Model Name</label>
            <input type="text" id="local-model" value="${llmConfig.localModel}" placeholder="llama-3.1-8b">
          </div>
        </div>

        <button class="primary" id="save-llm-config">Save AI Configuration</button>
      </div>

      <div style="margin-bottom: 16px; padding-top: 24px; border-top: 1px solid #333;">
        <div style="font-size: 13px; font-weight: 700; margin-bottom: 8px;">Alert Thresholds</div>
        <div style="font-size: 11px; color: #666; margin-bottom: 16px;">
          Customize when critical alerts trigger (0-100 scale)
        </div>
      </div>

      <div class="input-group">
        <label>Social Debt Leverage Threshold</label>
        <input type="range" id="threshold-debt" min="0" max="100" value="${this.thresholds.debt}" style="width: 100%;">
        <div style="text-align: right; font-size: 11px; color: #aaa; margin-top: 4px;">
          <span id="value-debt">${this.thresholds.debt}</span>/100
        </div>
      </div>

      <div class="input-group">
        <label>Emotional Manipulation Threshold</label>
        <input type="range" id="threshold-emotional" min="0" max="100" value="${this.thresholds.emotional}" style="width: 100%;">
        <div style="text-align: right; font-size: 11px; color: #aaa; margin-top: 4px;">
          <span id="value-emotional">${this.thresholds.emotional}</span>/100
        </div>
      </div>

      <div class="input-group">
        <label>Boundary Violation Threshold</label>
        <input type="range" id="threshold-boundary" min="0" max="100" value="${this.thresholds.boundary}" style="width: 100%;">
        <div style="text-align: right; font-size: 11px; color: #aaa; margin-top: 4px;">
          <span id="value-boundary">${this.thresholds.boundary}</span>/100
        </div>
      </div>

      <div class="input-group">
        <label>Status Games/Transactional Threshold</label>
        <input type="range" id="threshold-status" min="0" max="100" value="${this.thresholds.status}" style="width: 100%;">
        <div style="text-align: right; font-size: 11px; color: #aaa; margin-top: 4px;">
          <span id="value-status">${this.thresholds.status}</span>/100
        </div>
      </div>

      <div class="input-group">
        <label>Intimacy Weaponization Threshold</label>
        <input type="range" id="threshold-intimacy" min="0" max="100" value="${this.thresholds.intimacy}" style="width: 100%;">
        <div style="text-align: right; font-size: 11px; color: #aaa; margin-top: 4px;">
          <span id="value-intimacy">${this.thresholds.intimacy}</span>/100
        </div>
      </div>

      <div class="input-group">
        <label>Network Power Concentration Threshold</label>
        <input type="range" id="threshold-network" min="0" max="100" value="${this.thresholds.network}" style="width: 100%;">
        <div style="text-align: right; font-size: 11px; color: #aaa; margin-top: 4px;">
          <span id="value-network">${this.thresholds.network}</span>/100
        </div>
      </div>

      <div class="input-group">
        <label>Co-dependency Index Threshold</label>
        <input type="range" id="threshold-codependency" min="0" max="100" value="${this.thresholds.codependency}" style="width: 100%;">
        <div style="text-align: right; font-size: 11px; color: #aaa; margin-top: 4px;">
          <span id="value-codependency">${this.thresholds.codependency}</span>/100
        </div>
      </div>

      <div class="input-group">
        <label>Emotional Leverage Threshold</label>
        <input type="range" id="threshold-leverage" min="0" max="100" value="${this.thresholds.leverage}" style="width: 100%;">
        <div style="text-align: right; font-size: 11px; color: #aaa; margin-top: 4px;">
          <span id="value-leverage">${this.thresholds.leverage}</span>/100
        </div>
      </div>

      <div class="input-group">
        <label>Social Obligation Debt Threshold</label>
        <input type="range" id="threshold-obligation" min="0" max="100" value="${this.thresholds.obligation}" style="width: 100%;">
        <div style="text-align: right; font-size: 11px; color: #aaa; margin-top: 4px;">
          <span id="value-obligation">${this.thresholds.obligation}</span>/100
        </div>
      </div>

      <button class="primary" id="save-thresholds">Save Thresholds</button>
      <button class="primary" id="reset-thresholds" style="background: #333; margin-top: 8px;">Reset to Defaults</button>
    `;

    const setupSlider = (key) => {
      const slider = container.querySelector(`#threshold-${key}`);
      const valueDisplay = container.querySelector(`#value-${key}`);
      slider.addEventListener('input', () => {
        valueDisplay.textContent = slider.value;
      });
    };

    ['debt', 'emotional', 'boundary', 'status', 'intimacy', 'network', 'codependency', 'leverage', 'obligation'].forEach(setupSlider);

    // LLM provider configuration
    const providerSelect = container.querySelector('#llm-provider');
    const togetherConfig = container.querySelector('#together-config');
    const openrouterConfig = container.querySelector('#openrouter-config');
    const localConfig = container.querySelector('#local-config');

    providerSelect.addEventListener('change', () => {
      togetherConfig.style.display = providerSelect.value === 'together' ? 'block' : 'none';
      openrouterConfig.style.display = providerSelect.value === 'openrouter' ? 'block' : 'none';
      localConfig.style.display = providerSelect.value === 'local' ? 'block' : 'none';
    });

    container.querySelector('#save-llm-config').addEventListener('click', () => {
      const newConfig = {
        provider: container.querySelector('#llm-provider').value,
        togetherApiKey: container.querySelector('#together-api-key').value,
        togetherModel: container.querySelector('#together-model').value,
        openrouterApiKey: container.querySelector('#openrouter-api-key').value,
        openrouterModel: container.querySelector('#openrouter-model').value,
        localEndpoint: container.querySelector('#local-endpoint').value,
        localModel: container.querySelector('#local-model').value
      };
      
      if (window.llmProvider) {
        window.llmProvider.saveConfig(newConfig);
        
        const feedback = document.createElement('div');
        feedback.style.cssText = 'margin-top: 12px; padding: 8px; background: #0a1a0a; border: 1px solid #2a4a2a; border-radius: 4px; font-size: 11px; color: #4a8a4a;';
        feedback.textContent = '✓ AI configuration saved successfully';
        container.querySelector('#save-llm-config').after(feedback);
        setTimeout(() => feedback.remove(), 3000);
      }
    });

    container.querySelector('#save-thresholds').addEventListener('click', () => {
      const newThresholds = {
        debt: parseInt(container.querySelector('#threshold-debt').value),
        emotional: parseInt(container.querySelector('#threshold-emotional').value),
        boundary: parseInt(container.querySelector('#threshold-boundary').value),
        status: parseInt(container.querySelector('#threshold-status').value),
        intimacy: parseInt(container.querySelector('#threshold-intimacy').value),
        network: parseInt(container.querySelector('#threshold-network').value),
        codependency: parseInt(container.querySelector('#threshold-codependency').value),
        leverage: parseInt(container.querySelector('#threshold-leverage').value),
        obligation: parseInt(container.querySelector('#threshold-obligation').value)
      };
      this.saveThresholds(newThresholds);
      
      const feedback = document.createElement('div');
      feedback.style.cssText = 'margin-top: 12px; padding: 8px; background: #0a1a0a; border: 1px solid #2a4a2a; border-radius: 4px; font-size: 11px; color: #4a8a4a;';
      feedback.textContent = '✓ Thresholds saved successfully';
      container.appendChild(feedback);
      setTimeout(() => feedback.remove(), 3000);
    });

    container.querySelector('#reset-thresholds').addEventListener('click', () => {
      const defaults = {
        debt: 60,
        emotional: 60,
        boundary: 60,
        status: 65,
        intimacy: 60,
        network: 70,
        codependency: 70,
        leverage: 70,
        obligation: 70
      };
      this.saveThresholds(defaults);
      location.reload();
    });

    return container;
  }
}