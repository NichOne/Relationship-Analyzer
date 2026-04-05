export class QuickActions {
  constructor(analyzer) {
    this.analyzer = analyzer;
  }

  render() {
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 100;
    `;

    const fab = document.createElement('button');
    fab.style.cssText = `
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: #fff;
      color: #000;
      border: none;
      font-size: 24px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      transition: transform 0.2s;
    `;
    fab.textContent = '+';
    fab.addEventListener('mouseenter', () => fab.style.transform = 'scale(1.1)');
    fab.addEventListener('mouseleave', () => fab.style.transform = 'scale(1)');

    const menu = document.createElement('div');
    menu.style.cssText = `
      position: absolute;
      bottom: 70px;
      right: 0;
      background: #000;
      border: 1px solid #fff;
      border-radius: 8px;
      padding: 8px;
      display: none;
      min-width: 200px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;

    const actions = [
      { label: 'Quick Favor', icon: '💰', module: 'debt' },
      { label: 'Quick Obligation', icon: '⚖️', module: 'debt' },
      { label: 'Boundary Violation', icon: '🚫', module: 'boundary' },
      { label: 'Emotional Event', icon: '💔', module: 'emotional' },
      { label: 'Status Signal', icon: '📢', module: 'status' }
    ];

    actions.forEach(action => {
      const btn = document.createElement('button');
      btn.style.cssText = `
        display: block;
        width: 100%;
        padding: 10px;
        background: #111;
        border: 1px solid #333;
        color: #fff;
        font-family: inherit;
        font-size: 11px;
        text-align: left;
        cursor: pointer;
        border-radius: 4px;
        margin-bottom: 4px;
        transition: background 0.2s;
      `;
      btn.innerHTML = `${action.icon} ${action.label}`;
      btn.addEventListener('mouseenter', () => btn.style.background = '#222');
      btn.addEventListener('mouseleave', () => btn.style.background = '#111');
      btn.addEventListener('click', () => {
        this.showQuickForm(action);
        menu.style.display = 'none';
      });
      menu.appendChild(btn);
    });

    fab.addEventListener('click', () => {
      menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    });

    container.appendChild(fab);
    container.appendChild(menu);

    return container;
  }

  showQuickForm(action) {
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
      z-index: 1001;
    `;

    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      z-index: 1000;
    `;

    modal.innerHTML = `
      <div style="font-size: 14px; font-weight: 700; margin-bottom: 16px;">${action.icon} ${action.label}</div>
      <div class="input-group">
        <label>Person</label>
        <input type="text" id="quick-person" placeholder="Enter name">
      </div>
      <div class="input-group">
        <label>Details</label>
        <textarea id="quick-details" placeholder="Brief description" style="min-height: 60px;"></textarea>
      </div>
      ${action.module === 'debt' ? `
        <div class="input-group">
          <label>Type</label>
          <select id="quick-type">
            <option value="favor">They did a favor</option>
            <option value="obligation">I owe them</option>
          </select>
        </div>
      ` : ''}
      <div style="display: flex; gap: 8px; margin-top: 16px;">
        <button id="quick-save" class="primary" style="flex: 1;">Save</button>
        <button id="quick-cancel" style="flex: 1; padding: 12px; background: #333; color: #fff; border: none; font-family: inherit; font-size: 14px; border-radius: 4px; cursor: pointer;">Cancel</button>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(modal);

    const close = () => {
      document.body.removeChild(modal);
      document.body.removeChild(overlay);
    };

    modal.querySelector('#quick-cancel').addEventListener('click', close);
    overlay.addEventListener('click', close);

    modal.querySelector('#quick-save').addEventListener('click', () => {
      const person = modal.querySelector('#quick-person').value;
      const details = modal.querySelector('#quick-details').value;
      
      if (!person || !details) return;

      // Add to appropriate module and create notification
      const notes = this.analyzer.tagManager.getNotes(person);
      const timestamp = new Date().toLocaleString();
      const newNote = `[${timestamp}] ${action.label}: ${details}`;
      this.analyzer.tagManager.setNotes(person, notes ? `${notes}\n${newNote}` : newNote);

      this.analyzer.notificationCenter.addNotification(
        'info',
        `${action.label} recorded: ${details}`,
        person
      );

      close();
    });
  }
}