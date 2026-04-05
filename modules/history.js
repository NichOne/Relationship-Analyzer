export class HistoryManager {
  constructor() {
    this.history = [];
    this.currentIndex = -1;
    this.maxHistory = 50;
  }

  recordAction(action, data) {
    // Remove any actions after current index (for redo branch pruning)
    this.history = this.history.slice(0, this.currentIndex + 1);
    
    this.history.push({
      action,
      data: JSON.parse(JSON.stringify(data)), // Deep clone
      timestamp: Date.now()
    });

    if (this.history.length > this.maxHistory) {
      this.history.shift();
    } else {
      this.currentIndex++;
    }

    this.updateButtons();
  }

  undo() {
    if (this.currentIndex >= 0) {
      const action = this.history[this.currentIndex];
      this.currentIndex--;
      this.updateButtons();
      return action;
    }
    return null;
  }

  redo() {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      const action = this.history[this.currentIndex];
      this.updateButtons();
      return action;
    }
    return null;
  }

  canUndo() {
    return this.currentIndex >= 0;
  }

  canRedo() {
    return this.currentIndex < this.history.length - 1;
  }

  updateButtons() {
    const undoBtn = document.querySelector('#undo-btn');
    const redoBtn = document.querySelector('#redo-btn');
    
    if (undoBtn) {
      undoBtn.disabled = !this.canUndo();
      undoBtn.style.opacity = this.canUndo() ? '1' : '0.5';
      undoBtn.style.cursor = this.canUndo() ? 'pointer' : 'not-allowed';
    }
    
    if (redoBtn) {
      redoBtn.disabled = !this.canRedo();
      redoBtn.style.opacity = this.canRedo() ? '1' : '0.5';
      redoBtn.style.cursor = this.canRedo() ? 'pointer' : 'not-allowed';
    }
  }

  render() {
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      display: flex;
      gap: 8px;
      z-index: 100;
    `;

    const undoBtn = document.createElement('button');
    undoBtn.id = 'undo-btn';
    undoBtn.style.cssText = `
      padding: 10px 16px;
      background: #fff;
      color: #000;
      border: none;
      font-family: inherit;
      font-size: 12px;
      font-weight: 700;
      border-radius: 4px;
      cursor: pointer;
      transition: transform 0.1s;
    `;
    undoBtn.textContent = '↶ Undo';
    undoBtn.addEventListener('click', () => {
      const action = this.undo();
      if (action) {
        // Trigger undo event
        window.dispatchEvent(new CustomEvent('history-undo', { detail: action }));
      }
    });

    const redoBtn = document.createElement('button');
    redoBtn.id = 'redo-btn';
    redoBtn.style.cssText = `
      padding: 10px 16px;
      background: #fff;
      color: #000;
      border: none;
      font-family: inherit;
      font-size: 12px;
      font-weight: 700;
      border-radius: 4px;
      cursor: pointer;
      transition: transform 0.1s;
    `;
    redoBtn.textContent = '↷ Redo';
    redoBtn.addEventListener('click', () => {
      const action = this.redo();
      if (action) {
        // Trigger redo event
        window.dispatchEvent(new CustomEvent('history-redo', { detail: action }));
      }
    });

    container.appendChild(undoBtn);
    container.appendChild(redoBtn);

    this.updateButtons();

    return container;
  }
}