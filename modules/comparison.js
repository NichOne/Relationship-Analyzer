import { NetworkMap } from './comparison/network-map.js';
import { ComparisonTable } from './comparison/comparison-table.js';

export class Comparison {
  constructor(analyzer) {
    this.analyzer = analyzer;
    this.networkMap = new NetworkMap(analyzer);
    this.comparisonTable = new ComparisonTable(analyzer);
  }

  render() {
    const container = document.createElement('div');
    container.className = 'module';

    const allPeople = this.getAllPeople();

    if (allPeople.length === 0) {
      container.innerHTML = `
        <div style="padding: 24px; text-align: center; color: #666; font-size: 12px;">
          Analyze relationships in other modules to visualize them here.
        </div>
      `;
      return container;
    }

    container.innerHTML = `
      <div style="margin-bottom: 16px;">
        <div style="font-size: 13px; font-weight: 700; margin-bottom: 8px;">Relationship Network Map</div>
        <div style="font-size: 11px; color: #666; margin-bottom: 12px;">Drag nodes to reposition. Click for details. Scroll to zoom.</div>
      </div>
      
      <div style="margin-bottom: 12px; display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
        <input type="text" id="contact-search" placeholder="Search contacts..." style="flex: 1; min-width: 150px; padding: 8px; background: #0a0a0a; border: 1px solid #333; color: #fff; font-family: inherit; font-size: 11px; border-radius: 4px;">
        <select id="filter-by" style="padding: 8px; background: #0a0a0a; border: 1px solid #333; color: #fff; font-family: inherit; font-size: 11px; border-radius: 4px;">
          <option value="all">All Contacts</option>
          <option value="high-risk">High Risk (≥60)</option>
          <option value="high-influence">High Influence (≥60)</option>
          <option value="critical">Critical Alerts</option>
        </select>
      </div>
      
      <div id="network-map" style="position: relative; height: 400px; background: #0a0a0a; border: 1px solid #333; border-radius: 4px; overflow: hidden;"></div>
      <div id="node-legend" style="margin-top: 12px; font-size: 10px; color: #666;"></div>
    `;

    // Bind search and filter
    const searchInput = container.querySelector('#contact-search');
    const filterSelect = container.querySelector('#filter-by');
    
    const applyFilters = () => {
      const searchTerm = searchInput.value.toLowerCase();
      const filterType = filterSelect.value;
      
      let filteredPeople = allPeople.filter(person => {
        if (searchTerm && !person.toLowerCase().includes(searchTerm)) {
          return false;
        }
        return true;
      });
      
      if (filterType === 'high-risk') {
        filteredPeople = filteredPeople.filter(person => {
          const data = this.networkMap.getPersonData(person);
          const avgRisk = [
            data.debt?.leverageScore || 0,
            data.emotional?.totalRisk || 0,
            data.boundary?.totalThreat || 0,
            data.intimacy?.totalRisk || 0
          ].reduce((a, b) => a + b, 0) / 4;
          return avgRisk >= 60;
        });
      } else if (filterType === 'high-influence') {
        filteredPeople = filteredPeople.filter(person => {
          const data = this.networkMap.getPersonData(person);
          const influence = this.networkMap.buildNodes([person])[0]?.influence || 0;
          return influence >= 60;
        });
      } else if (filterType === 'critical') {
        filteredPeople = filteredPeople.filter(person => {
          const data = this.networkMap.getPersonData(person);
          return (data.debt?.leverageScore || 0) >= 60 ||
                 (data.emotional?.totalRisk || 0) >= 60 ||
                 (data.boundary?.totalThreat || 0) >= 60 ||
                 (data.intimacy?.weaponizationScore || 0) >= 66;
        });
      }
      
      container.querySelector('#network-map').innerHTML = '';
      this.networkMap.render(container, filteredPeople.length > 0 ? filteredPeople : allPeople);
    };
    
    searchInput.addEventListener('input', () => {
      applyFilters();
      this.saveFilterSettings(searchInput.value, filterSelect.value);
    });
    filterSelect.addEventListener('change', () => {
      applyFilters();
      this.saveFilterSettings(searchInput.value, filterSelect.value);
    });
    
    // Load saved filter settings
    const savedFilters = this.loadFilterSettings();
    if (savedFilters) {
      searchInput.value = savedFilters.search;
      filterSelect.value = savedFilters.filter;
      applyFilters();
    }
    
    this.networkMap.render(container, allPeople);

    if (allPeople.length < 2) {
      return container;
    }

    const comparisonSection = document.createElement('div');
    comparisonSection.style.marginTop = '24px';
    comparisonSection.innerHTML = `
      <div style="font-size: 13px; font-weight: 700; margin-bottom: 12px;">Side-by-Side Comparison</div>
      <div style="margin-bottom: 16px;">
        <label style="display: block; margin-bottom: 6px; font-size: 12px; color: #aaa;">Select people to compare:</label>
        <div id="person-selector" style="display: flex; flex-direction: column; gap: 4px; max-height: 200px; overflow-y: auto;"></div>
      </div>
      <button class="primary" id="compare-btn">Compare Selected</button>
      <div id="comparison-results"></div>
    `;
    container.appendChild(comparisonSection);

    const selector = comparisonSection.querySelector('#person-selector');
    allPeople.forEach(person => {
      const checkbox = document.createElement('label');
      checkbox.style.cssText = 'display: flex; align-items: center; gap: 8px; padding: 8px; background: #111; border: 1px solid #333; border-radius: 4px; cursor: pointer; font-size: 12px;';
      checkbox.innerHTML = `
        <input type="checkbox" value="${person}" style="width: auto;">
        <span>${person}</span>
      `;
      selector.appendChild(checkbox);
    });

    comparisonSection.querySelector('#compare-btn').addEventListener('click', () => {
      const selected = Array.from(comparisonSection.querySelectorAll('input[type="checkbox"]:checked'))
        .map(cb => cb.value);
      if (selected.length >= 2) {
        this.comparisonTable.render(comparisonSection, selected);
      }
    });

    return container;
  }

  getAllPeople() {
    const people = new Set();
    
    this.analyzer.modules.debt?.analyses.forEach(a => people.add(a.person));
    this.analyzer.modules.emotional?.analyses.forEach(a => people.add(a.person));
    this.analyzer.modules.network?.people.forEach(p => people.add(p.name));
    this.analyzer.modules.boundary?.scans.forEach(s => people.add(s.person));
    this.analyzer.modules.status?.analyses.forEach(a => people.add(a.person));
    this.analyzer.modules.intimacy?.alerts.forEach(a => people.add(a.person));

    return Array.from(people).sort();
  }

  saveFilterSettings(search, filter) {
    localStorage.setItem('comparisonFilters', JSON.stringify({ search, filter }));
  }

  loadFilterSettings() {
    const saved = localStorage.getItem('comparisonFilters');
    return saved ? JSON.parse(saved) : null;
  }

  // removed renderNetworkMap() - moved to NetworkMap class
  // removed calculateTrust() - moved to RelationshipMetrics
  // removed getTrustColor() - moved to RelationshipMetrics
  // removed buildConnections() - moved to NetworkMap class
  // removed calculateInteractionFrequency() - moved to NetworkMap class
  // removed calculateInfluence() - moved to RelationshipMetrics
  // removed getNodeBackground() - moved to RelationshipMetrics
  // removed showNodeDetails() - moved to NetworkMap class
  // removed getPersonData() - moved to NetworkMap and ComparisonTable classes
  // removed renderComparison() - moved to ComparisonTable class
  // removed generateInsights() - moved to ComparisonTable class
  // removed getScoreColor() - moved to RelationshipMetrics
}