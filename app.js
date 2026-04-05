import { TagManager } from './modules/tags.js';
import { Dashboard } from './modules/dashboard.js';
import { DebtTracker } from './modules/debt-tracker.js';
import { EmotionalBait } from './modules/emotional-bait.js';
import { NetworkPower } from './modules/network-power.js';
import { BoundaryScanner } from './modules/boundary-scanner.js';
import { StatusDecoder } from './modules/status-decoder.js';
import { IntimacyAlert } from './modules/intimacy-alert.js';
import { SocialCredit } from './modules/social-credit.js';
import { Comparison } from './modules/comparison.js';
import { Settings } from './modules/settings.js';
import { NotificationCenter } from './modules/notifications.js';
import { QuickActions } from './modules/quick-actions.js';
import { HistoryManager } from './modules/history.js';
import { Legend } from './modules/legend.js';
import { About } from './modules/about.js';
import { AIAnalyzer } from './modules/ai-analyzer.js';
import { LLMProvider } from './modules/llm-provider.js';

class RelationshipAnalyzer {
  constructor() {
    this.llmProvider = new LLMProvider();
    window.llmProvider = this.llmProvider; // Make globally accessible for settings
    
    this.tagManager = new TagManager();
    this.settings = new Settings();
    this.notificationCenter = new NotificationCenter();
    this.historyManager = new HistoryManager();
    
    this.modules = {
      debt: new DebtTracker(this.tagManager),
      emotional: new EmotionalBait(this.tagManager),
      network: new NetworkPower(this.tagManager),
      boundary: new BoundaryScanner(this.tagManager),
      status: new StatusDecoder(this.tagManager),
      intimacy: new IntimacyAlert(this.tagManager),
      credit: new SocialCredit()
    };

    this.modules.dashboard = new Dashboard(this);
    this.modules.compare = new Comparison(this);
    this.modules.ai = new AIAnalyzer(this.tagManager, this.llmProvider);
    this.modules.about = new About();
    this.modules.settings = this.settings;
    this.modules.notifications = this.notificationCenter;
    this.modules.legend = new Legend();

    this.currentModule = 'dashboard';
    this.theme = localStorage.getItem('theme') || 'dark';
    this.init();
  }

  exportCSV() {
    const rows = [
      ['Person', 'Type', 'Intensity', 'Social Debt', 'Emotional Risk', 'Network Power', 'Boundary Threat', 'Status Games', 'Intimacy Risk', 'Tags', 'Notes']
    ];

    const allPeople = this.tagManager.getAllPeople();
    
    allPeople.forEach(person => {
      const type = this.tagManager.getType(person) || '';
      const intensity = this.tagManager.getIntensity(person) || '';
      const tags = Array.from(this.tagManager.getTags(person)).join('; ');
      const notes = this.tagManager.getNotes(person).replace(/\n/g, ' ').replace(/,/g, ';');
      
      const debt = this.modules.debt.analyses.find(a => a.person === person);
      const emotional = this.modules.emotional.analyses.find(a => a.person === person);
      const network = this.modules.network.people.find(p => p.name === person);
      const boundary = this.modules.boundary.scans.find(s => s.person === person);
      const status = this.modules.status.analyses.find(a => a.person === person);
      const intimacy = this.modules.intimacy.alerts.find(a => a.person === person);

      rows.push([
        person,
        type,
        intensity,
        debt ? debt.leverageScore : '',
        emotional ? Math.round(emotional.totalRisk) : '',
        network ? network.powerScore : '',
        boundary ? Math.round(boundary.totalThreat) : '',
        status ? Math.round(status.totalScore) : '',
        intimacy ? Math.round(intimacy.totalRisk) : '',
        tags,
        notes
      ]);
    });

    const csv = rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relationship-analysis-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  init() {
    this.applyTheme();
    this.bindTabs();
    this.bindThemeToggle();
    this.bindSidebarToggle();
    this.renderModule();
    this.renderQuickActions();
    this.renderHistoryButtons();
  }

  renderQuickActions() {
    const quickActions = new QuickActions(this);
    document.body.appendChild(quickActions.render());
  }

  renderHistoryButtons() {
    document.body.appendChild(this.historyManager.render());
  }

  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.theme);
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.textContent = this.theme === 'dark' ? '☀' : '🌙';
    }
  }

  bindThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    toggle.addEventListener('click', () => {
      this.theme = this.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', this.theme);
      this.applyTheme();
    });

    const notifBtn = document.getElementById('notification-btn');
    notifBtn.addEventListener('click', () => {
      this.currentModule = 'notifications';
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelector('[data-module="notifications"]').classList.add('active');
      this.renderModule();
      if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('open');
      }
    });
  }

  bindSidebarToggle() {
    const toggleBtn = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });

    // Close sidebar when clicking a tab on mobile
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          sidebar.classList.remove('open');
        }
      });
    });

    // Add mobile swipe gestures for module navigation
    this.setupSwipeGestures();
  }

  setupSwipeGestures() {
    if (window.innerWidth > 768) return;

    const content = document.getElementById('content');
    let touchStartX = 0;
    let touchEndX = 0;

    content.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    content.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe(touchStartX, touchEndX);
    }, { passive: true });
  }

  handleSwipe(startX, endX) {
    const swipeThreshold = 50;
    const diff = startX - endX;

    if (Math.abs(diff) < swipeThreshold) return;

    const tabs = Array.from(document.querySelectorAll('.tab'));
    const currentIndex = tabs.findIndex(tab => tab.classList.contains('active'));

    if (diff > 0 && currentIndex < tabs.length - 1) {
      // Swipe left - next module
      tabs[currentIndex + 1].click();
    } else if (diff < 0 && currentIndex > 0) {
      // Swipe right - previous module
      tabs[currentIndex - 1].click();
    }
  }

  bindTabs() {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.currentModule = tab.dataset.module;
        this.renderModule();
      });
    });
  }

  renderModule() {
    const content = document.getElementById('content');
    const module = this.modules[this.currentModule];
    content.innerHTML = '';
    content.appendChild(module.render());
  }
}

new RelationshipAnalyzer();