export class NotificationCenter {
  constructor() {
    this.notifications = [];
    this.unreadCount = 0;
  }

  addNotification(type, message, person = null) {
    const notification = {
      id: Date.now(),
      type, // 'critical', 'warning', 'info'
      message,
      person,
      timestamp: Date.now(),
      read: false
    };
    this.notifications.unshift(notification);
    this.unreadCount++;
    this.updateBadge();
  }

  markAsRead(id) {
    const notif = this.notifications.find(n => n.id === id);
    if (notif && !notif.read) {
      notif.read = true;
      this.unreadCount = Math.max(0, this.unreadCount - 1);
      this.updateBadge();
    }
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.unreadCount = 0;
    this.updateBadge();
  }

  clearAll() {
    this.notifications = [];
    this.unreadCount = 0;
    this.updateBadge();
  }

  updateBadge() {
    const badge = document.querySelector('#notification-badge');
    if (badge) {
      badge.textContent = this.unreadCount > 0 ? this.unreadCount : '';
      badge.style.display = this.unreadCount > 0 ? 'flex' : 'none';
    }
  }

  render() {
    const container = document.createElement('div');
    container.className = 'module';

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div style="font-size: 14px; font-weight: 700;">Notification Center</div>
        <div style="display: flex; gap: 8px;">
          <button id="mark-all-read" style="padding: 6px 12px; background: #333; border: none; color: #fff; font-family: inherit; font-size: 10px; border-radius: 3px; cursor: pointer;">Mark All Read</button>
          <button id="clear-all" style="padding: 6px 12px; background: #333; border: none; color: #fff; font-family: inherit; font-size: 10px; border-radius: 3px; cursor: pointer;">Clear All</button>
        </div>
      </div>
      <div id="notifications-list"></div>
    `;

    const list = container.querySelector('#notifications-list');

    if (this.notifications.length === 0) {
      list.innerHTML = '<div style="padding: 24px; text-align: center; color: #666; font-size: 11px;">No notifications</div>';
    } else {
      this.notifications.forEach(notif => {
        const item = document.createElement('div');
        item.style.cssText = `
          padding: 12px;
          background: ${notif.read ? '#0a0a0a' : '#111'};
          border: 1px solid ${this.getNotifColor(notif.type)};
          border-left: 3px solid ${this.getNotifColor(notif.type)};
          border-radius: 4px;
          margin-bottom: 8px;
          cursor: pointer;
          transition: background 0.2s;
        `;
        
        const icon = notif.type === 'critical' ? '🚨' : notif.type === 'warning' ? '⚠️' : 'ℹ️';
        const time = this.formatTime(notif.timestamp);
        
        item.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 4px;">
            <div style="font-size: 10px; font-weight: 700; color: ${this.getNotifColor(notif.type)};">
              ${icon} ${notif.type.toUpperCase()}
            </div>
            <div style="font-size: 9px; color: #666;">${time}</div>
          </div>
          <div style="font-size: 11px; color: ${notif.read ? '#666' : '#aaa'}; line-height: 1.4;">
            ${notif.person ? `<span style="font-weight: 700;">${notif.person}:</span> ` : ''}${notif.message}
          </div>
          ${!notif.read ? '<div style="width: 8px; height: 8px; background: #ff4444; border-radius: 50%; position: absolute; top: 12px; right: 12px;"></div>' : ''}
        `;
        
        item.style.position = 'relative';
        
        item.addEventListener('click', () => {
          this.markAsRead(notif.id);
          item.style.background = '#0a0a0a';
          const dot = item.querySelector('div[style*="position: absolute"]');
          if (dot) dot.remove();
        });
        
        list.appendChild(item);
      });
    }

    container.querySelector('#mark-all-read').addEventListener('click', () => {
      this.markAllAsRead();
      Array.from(list.children).forEach(child => {
        child.style.background = '#0a0a0a';
        const dot = child.querySelector('div[style*="position: absolute"]');
        if (dot) dot.remove();
      });
    });

    container.querySelector('#clear-all').addEventListener('click', () => {
      this.clearAll();
      list.innerHTML = '<div style="padding: 24px; text-align: center; color: #666; font-size: 11px;">No notifications</div>';
    });

    return container;
  }

  getNotifColor(type) {
    if (type === 'critical') return '#ff4444';
    if (type === 'warning') return '#ff8800';
    return '#4444ff';
  }

  formatTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  }
}