export class WidgetManager {
  constructor() {
    this.widgetOrder = JSON.parse(localStorage.getItem('dashboardWidgetOrder') || '["codependency", "leverage", "obligation", "boundary", "authenticity"]');
    this.hiddenWidgets = new Set(JSON.parse(localStorage.getItem('hiddenWidgets') || '[]'));
  }

  save() {
    localStorage.setItem('dashboardWidgetOrder', JSON.stringify(this.widgetOrder));
    localStorage.setItem('hiddenWidgets', JSON.stringify(Array.from(this.hiddenWidgets)));
  }

  getVisibleWidgets() {
    return this.widgetOrder.filter(key => !this.hiddenWidgets.has(key));
  }

  showCustomizer(onSave) {
    const modal = document.createElement('div');
    modal.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #000; border: 2px solid #fff; border-radius: 8px; padding: 20px; max-width: 400px; width: 90%; z-index: 1001;';
    
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.8); z-index: 1000;';
    
    modal.innerHTML = `
      <div style="font-size: 14px; font-weight: 700; margin-bottom: 16px;">Customize Dashboard</div>
      <div id="widget-list" style="margin-bottom: 16px;"></div>
      <button id="save-custom" class="primary">Save Changes</button>
    `;
    
    const widgetList = modal.querySelector('#widget-list');
    const widgetNames = {
      codependency: 'Co-dependency Index',
      leverage: 'Emotional Leverage',
      obligation: 'Social Obligation',
      boundary: 'Boundary Integrity',
      authenticity: 'Authenticity'
    };
    
    this.widgetOrder.forEach((key, index) => {
      const item = document.createElement('div');
      item.style.cssText = 'padding: 10px; background: #111; border: 1px solid #333; margin-bottom: 8px; border-radius: 4px; display: flex; justify-content: space-between; align-items: center;';
      item.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="cursor: move;">☰</span>
          <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
            <input type="checkbox" ${!this.hiddenWidgets.has(key) ? 'checked' : ''} data-widget="${key}">
            <span>${widgetNames[key]}</span>
          </label>
        </div>
        <div>
          ${index > 0 ? '<button class="move-up" data-index="' + index + '">↑</button>' : ''}
          ${index < this.widgetOrder.length - 1 ? '<button class="move-down" data-index="' + index + '">↓</button>' : ''}
        </div>
      `;
      widgetList.appendChild(item);
    });
    
    document.body.appendChild(overlay);
    document.body.appendChild(modal);
    
    modal.addEventListener('click', (e) => {
      if (e.target.classList.contains('move-up')) {
        const index = parseInt(e.target.dataset.index);
        [this.widgetOrder[index], this.widgetOrder[index - 1]] = [this.widgetOrder[index - 1], this.widgetOrder[index]];
        widgetList.innerHTML = '';
        this.showCustomizer(onSave);
        document.body.removeChild(modal);
        document.body.removeChild(overlay);
      } else if (e.target.classList.contains('move-down')) {
        const index = parseInt(e.target.dataset.index);
        [this.widgetOrder[index], this.widgetOrder[index + 1]] = [this.widgetOrder[index + 1], this.widgetOrder[index]];
        widgetList.innerHTML = '';
        this.showCustomizer(onSave);
        document.body.removeChild(modal);
        document.body.removeChild(overlay);
      }
    });
    
    modal.querySelector('#save-custom').addEventListener('click', () => {
      this.hiddenWidgets.clear();
      modal.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        if (!cb.checked) {
          this.hiddenWidgets.add(cb.dataset.widget);
        }
      });
      this.save();
      document.body.removeChild(modal);
      document.body.removeChild(overlay);
      if (onSave) onSave();
    });
    
    overlay.addEventListener('click', () => {
      document.body.removeChild(modal);
      document.body.removeChild(overlay);
    });
  }
}