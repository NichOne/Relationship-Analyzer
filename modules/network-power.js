export class NetworkPower {
  constructor(tagManager) {
    this.tagManager = tagManager;
    this.people = [];
    this.connections = []; // { from, to, type }
    this.networks = new Map(); // networkName -> Set of people
  }

  render() {
    const container = document.createElement('div');
    container.className = 'module';

    container.innerHTML = `
      <div class="input-group">
        <label>Person Name</label>
        <input type="text" id="np-person" placeholder="Enter name">
      </div>
      <div class="input-group">
        <label>Controls Access To</label>
        <input type="text" id="np-access" placeholder="Jobs, people, opportunities, information">
      </div>
      <div class="input-group">
        <label>Information Flow</label>
        <select id="np-info">
          <option value="1">Transparent</option>
          <option value="2">Selective sharing</option>
          <option value="3">Gatekeeping</option>
          <option value="4">Information monopoly</option>
        </select>
      </div>
      <div class="input-group">
        <label>Dependency Level</label>
        <select id="np-dependency">
          <option value="1">Independent</option>
          <option value="2">Slight dependence</option>
          <option value="3">Moderate dependence</option>
          <option value="4">Complete dependence</option>
        </select>
      </div>
      <div class="input-group">
        <label>Hierarchy Position</label>
        <select id="np-hierarchy">
          <option value="1">Peer/Equal</option>
          <option value="2">Slightly above you</option>
          <option value="3">Authority figure</option>
          <option value="4">Gatekeeper/Power broker</option>
        </select>
      </div>
      <div class="input-group">
        <label>Reputation Influence</label>
        <select id="np-reputation">
          <option value="0">Cannot affect your reputation</option>
          <option value="1">Minor influence on others' perception</option>
          <option value="2">Significant reputation control</option>
          <option value="3">Can make/break your standing</option>
        </select>
      </div>
      <div class="input-group">
        <label>Positional Maneuvering</label>
        <select id="np-maneuvering">
          <option value="0">Stable position</option>
          <option value="1">Occasional repositioning</option>
          <option value="2">Frequent strategic moves</option>
          <option value="3">Constant political positioning</option>
        </select>
      </div>
      <div class="input-group">
        <label>Network/Circle (optional)</label>
        <input type="text" id="np-network" placeholder="e.g., Work, Friends, Family">
      </div>
      <button class="primary" id="analyze-np">Add to Network Map</button>
      <div id="np-results"></div>
      <div id="np-hierarchy-map" style="margin-top: 16px;"></div>
      <div id="np-overlap" style="margin-top: 16px;"></div>
    `;

    container.querySelector('#analyze-np').addEventListener('click', () => {
      this.addPerson(container);
    });

    return container;
  }

  addPerson(container) {
    const name = container.querySelector('#np-person').value;
    const access = container.querySelector('#np-access').value;
    const infoFlow = parseInt(container.querySelector('#np-info').value);
    const dependency = parseInt(container.querySelector('#np-dependency').value);
    const hierarchy = parseInt(container.querySelector('#np-hierarchy').value);
    const reputation = parseInt(container.querySelector('#np-reputation').value);
    const maneuvering = parseInt(container.querySelector('#np-maneuvering').value);
    const network = container.querySelector('#np-network').value.trim();

    if (!name || !access) return;

    const powerScore = (infoFlow * 25) + (dependency * 20);
    const reputationScore = reputation * 33;
    const maneuveringScore = maneuvering * 33;
    
    // Add to networks if specified
    if (network) {
      if (!this.networks.has(network)) {
        this.networks.set(network, new Set());
      }
      this.networks.get(network).add(name);
    }
    
    const existingIndex = this.people.findIndex(p => p.name === name);
    const person = { 
      name, 
      access, 
      powerScore, 
      infoFlow, 
      dependency,
      hierarchy,
      reputationScore,
      maneuveringScore,
      network 
    };
    if (existingIndex >= 0) {
      this.people[existingIndex] = person;
    } else {
      this.people.push(person);
    }
    
    this.renderNetwork(container);
    this.renderHierarchyMap(container);
    this.renderNetworkOverlap(container);

    // Clear inputs
    container.querySelector('#np-person').value = '';
    container.querySelector('#np-access').value = '';
    container.querySelector('#np-network').value = '';
  }

  renderNetwork(container) {
    const resultsDiv = container.querySelector('#np-results');
    resultsDiv.innerHTML = '';
    resultsDiv.className = 'results';

    // Sort by power score
    const sorted = [...this.people].sort((a, b) => b.powerScore - a.powerScore);

    sorted.forEach(person => {
      const hierarchyLabel = ['Peer', 'Above You', 'Authority', 'Gatekeeper'][person.hierarchy - 1] || 'Peer';
      const maneuveringLabel = person.maneuveringScore >= 66 ? '⚠️ Political Player' : '';
      
      const item = document.createElement('div');
      item.className = 'relationship-item';
      item.innerHTML = `
        <div class="relationship-name">
          ${person.name}
          ${maneuveringLabel ? `<span style="color: #ff8800; font-size: 10px; margin-left: 8px;">${maneuveringLabel}</span>` : ''}
        </div>
        <div class="relationship-stats" style="margin-bottom: 4px;">
          Position: ${hierarchyLabel} | Controls: ${person.access}
        </div>
        <div style="display: flex; gap: 8px; font-size: 10px; color: #aaa; margin-bottom: 8px;">
          <span>Power: ${person.powerScore}/100</span>
          <span>Reputation Control: ${person.reputationScore}/100</span>
          <span>Maneuvering: ${person.maneuveringScore}/100</span>
        </div>
        <div class="metric-bar">
          <div class="metric-fill" style="width: ${person.powerScore}%; background: ${this.getScoreColor(person.powerScore)}"></div>
        </div>
      `;
      
      if (this.tagManager) {
        item.appendChild(this.tagManager.renderTagSelector(person.name, () => {
          this.renderNetwork(container);
        }));
      }
      
      resultsDiv.appendChild(item);
    });

    // Enhanced alerts
    const highPower = sorted.filter(p => p.powerScore >= 70);
    const reputationControllers = sorted.filter(p => p.reputationScore >= 66);
    const manipulators = sorted.filter(p => p.maneuveringScore >= 66);
    
    if (highPower.length > 0) {
      const alert = document.createElement('div');
      alert.className = 'alert';
      alert.innerHTML = `
        <div class="alert-title">⚠️ Power Concentration Warning</div>
        ${highPower.map(p => p.name).join(', ')} ${highPower.length === 1 ? 'has' : 'have'} significant power over your access and opportunities. This creates vulnerability to coercion and reduces your autonomy.
      `;
      resultsDiv.appendChild(alert);
    }

    if (reputationControllers.length > 0) {
      const alert = document.createElement('div');
      alert.className = 'alert';
      alert.innerHTML = `
        <div class="alert-title">🚨 Reputation Control Detected</div>
        ${reputationControllers.map(p => p.name).join(', ')} can significantly damage your reputation. Your standing is vulnerable to their narrative control.
      `;
      resultsDiv.appendChild(alert);
    }

    if (manipulators.length > 0) {
      const alert = document.createElement('div');
      alert.className = 'alert';
      alert.innerHTML = `
        <div class="alert-title">⚠️ Political Maneuvering Detected</div>
        ${manipulators.map(p => p.name).join(', ')} frequently repositions strategically. Watch for opportunistic behavior and shifting allegiances.
      `;
      resultsDiv.appendChild(alert);
    }
  }

  renderNetworkOverlap(container) {
    const overlapDiv = container.querySelector('#np-overlap');
    if (this.networks.size < 2) {
      overlapDiv.innerHTML = '';
      return;
    }

    overlapDiv.innerHTML = `
      <div style="padding: 12px; background: #0a0a0a; border: 1px solid #333; border-radius: 4px;">
        <div style="font-size: 11px; font-weight: 700; margin-bottom: 8px; color: #aaa;">Network Overlap Analysis</div>
    `;

    const networkArray = Array.from(this.networks.entries());
    
    networkArray.forEach(([networkName, people]) => {
      const overlaps = [];
      networkArray.forEach(([otherName, otherPeople]) => {
        if (networkName !== otherName) {
          const overlap = new Set([...people].filter(p => otherPeople.has(p)));
          if (overlap.size > 0) {
            overlaps.push({ network: otherName, people: Array.from(overlap) });
          }
        }
      });

      if (overlaps.length > 0) {
        overlapDiv.innerHTML += `
          <div style="margin-bottom: 8px; padding: 8px; background: #111; border-radius: 4px;">
            <div style="font-size: 11px; font-weight: 700; margin-bottom: 4px;">${networkName} (${people.size} people)</div>
            ${overlaps.map(o => `
              <div style="font-size: 10px; color: #888; margin-left: 8px;">
                → ${o.people.length} overlap with ${o.network}: ${o.people.join(', ')}
              </div>
            `).join('')}
          </div>
        `;
      }
    });

    overlapDiv.innerHTML += '</div>';
  }

  renderHierarchyMap(container) {
    const hierarchyDiv = container.querySelector('#np-hierarchy-map');
    if (this.people.length === 0) {
      hierarchyDiv.innerHTML = '';
      return;
    }

    hierarchyDiv.innerHTML = `
      <div style="padding: 12px; background: #0a0a0a; border: 1px solid #333; border-radius: 4px;">
        <div style="font-size: 11px; font-weight: 700; margin-bottom: 12px; color: #aaa;">Social Hierarchy & Reputation Flow</div>
    `;

    // Group by hierarchy level
    const levels = {
      4: { label: 'Gatekeepers/Power Brokers', people: [] },
      3: { label: 'Authority Figures', people: [] },
      2: { label: 'Above You', people: [] },
      1: { label: 'Peers/Equals', people: [] }
    };

    this.people.forEach(person => {
      const level = person.hierarchy || 1;
      levels[level].people.push(person);
    });

    // Render hierarchy levels from top to bottom
    [4, 3, 2, 1].forEach(level => {
      if (levels[level].people.length === 0) return;

      const levelDiv = document.createElement('div');
      levelDiv.style.cssText = 'margin-bottom: 12px;';
      
      const levelColor = level === 4 ? '#ff4444' : level === 3 ? '#ff8800' : level === 2 ? '#ffaa00' : '#666';
      
      levelDiv.innerHTML = `
        <div style="font-size: 10px; font-weight: 700; color: ${levelColor}; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">
          ${levels[level].label}
        </div>
      `;

      levels[level].people.forEach(person => {
        const personDiv = document.createElement('div');
        personDiv.style.cssText = `
          padding: 8px;
          margin-bottom: 4px;
          background: #111;
          border-left: 3px solid ${levelColor};
          border-radius: 3px;
          position: relative;
        `;

        const reputationFlowArrow = person.reputationScore >= 66 ? '⬇️ High reputation flow' : 
                                     person.reputationScore >= 33 ? '↓ Moderate flow' : '';

        personDiv.innerHTML = `
          <div style="font-size: 11px; font-weight: 700; margin-bottom: 2px;">
            ${person.name}
            ${person.maneuveringScore >= 66 ? '<span style="color: #ff8800; font-size: 9px; margin-left: 4px;">[MANEUVERING]</span>' : ''}
          </div>
          <div style="font-size: 10px; color: #666;">Controls: ${person.access}</div>
          ${reputationFlowArrow ? `<div style="font-size: 10px; color: #ff8800; margin-top: 4px;">${reputationFlowArrow}</div>` : ''}
        `;
        levelDiv.appendChild(personDiv);
      });

      hierarchyDiv.querySelector('div').appendChild(levelDiv);
    });

    // Add reputation flow analysis
    const highRepFlow = this.people.filter(p => p.reputationScore >= 66);
    if (highRepFlow.length > 0) {
      const flowAnalysis = document.createElement('div');
      flowAnalysis.style.cssText = 'margin-top: 12px; padding: 8px; background: #1a0a00; border: 1px solid #ff8800; border-radius: 3px; font-size: 10px;';
      flowAnalysis.innerHTML = `
        <div style="font-weight: 700; margin-bottom: 4px; color: #ff8800;">⚡ Reputation Flow Analysis:</div>
        <div style="color: #aaa; line-height: 1.5;">
          ${highRepFlow.map(p => `• ${p.name} controls significant reputation flow—what they say about you shapes others' perceptions`).join('<br>')}
        </div>
      `;
      hierarchyDiv.querySelector('div').appendChild(flowAnalysis);
    }

    hierarchyDiv.innerHTML += '</div>';
  }

  getScoreColor(score) {
    if (score >= 75) return '#ff4444';
    if (score >= 50) return '#ffaa00';
    if (score >= 25) return '#ffff00';
    return '#44ff44';
  }
}