// Provider abstraction layer for LLM inference
// Supports Together.ai, OpenRouter, and Local LLM

export class LLMProvider {
  constructor() {
    this.config = this.loadConfig();
  }

  loadConfig() {
    const saved = localStorage.getItem('llmProviderConfig');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      provider: 'together', // together, openrouter, local
      togetherApiKey: '',
      togetherModel: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
      openrouterApiKey: '',
      openrouterModel: 'meta-llama/llama-3.1-8b-instruct',
      localEndpoint: 'http://localhost:1234/v1',
      localModel: 'llama-3.1-8b'
    };
  }

  saveConfig(config) {
    this.config = config;
    localStorage.setItem('llmProviderConfig', JSON.stringify(config));
  }

  async chat(messages, options = {}) {
    const { provider } = this.config;
    
    switch (provider) {
      case 'together':
        return await this.togetherChat(messages, options);
      case 'openrouter':
        return await this.openrouterChat(messages, options);
      case 'local':
        return await this.localChat(messages, options);
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }

  async togetherChat(messages, options = {}) {
    const { togetherApiKey, togetherModel } = this.config;
    
    if (!togetherApiKey) {
      throw new Error('Together.ai API key not configured. Please add it in Settings.');
    }

    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${togetherApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: togetherModel,
        messages: messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 2048
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Together.ai API error: ${error}`);
    }

    const data = await response.json();
    return {
      role: 'assistant',
      content: data.choices[0].message.content
    };
  }

  async openrouterChat(messages, options = {}) {
    const { openrouterApiKey, openrouterModel } = this.config;
    
    if (!openrouterApiKey) {
      throw new Error('OpenRouter API key not configured. Please add it in Settings.');
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openrouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.href,
        'X-Title': 'Relationship Analyzer'
      },
      body: JSON.stringify({
        model: openrouterModel,
        messages: messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 2048
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenRouter API error: ${error}`);
    }

    const data = await response.json();
    return {
      role: 'assistant',
      content: data.choices[0].message.content
    };
  }

  async localChat(messages, options = {}) {
    const { localEndpoint, localModel } = this.config;
    
    const response = await fetch(`${localEndpoint}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: localModel,
        messages: messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 2048
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Local LLM error: ${error}`);
    }

    const data = await response.json();
    return {
      role: 'assistant',
      content: data.choices[0].message.content
    };
  }

  getAvailableModels() {
    return {
      together: [
        'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
        'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
        'mistralai/Mixtral-8x7B-Instruct-v0.1',
        'mistralai/Mistral-7B-Instruct-v0.2',
        'NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO'
      ],
      openrouter: [
        'meta-llama/llama-3.1-8b-instruct',
        'meta-llama/llama-3.1-70b-instruct',
        'anthropic/claude-3-5-sonnet',
        'openai/gpt-4-turbo',
        'mistralai/mixtral-8x7b-instruct'
      ],
      local: [
        'llama-3.1-8b',
        'mistral-7b',
        'custom-model'
      ]
    };
  }
}