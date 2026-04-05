import { RelationshipMetrics } from './metrics.js';
import { InteractiveMapControls } from './interactive-controls.js';
import { GraphRenderer } from './graph-renderer.js';
import { NodeDetailsModal } from './node-details.js';

export class NetworkMap {
  constructor(analyzer) {
    this.analyzer = analyzer;
    this.renderer = new GraphRenderer(analyzer);
    this.detailsModal = new NodeDetailsModal(analyzer);
  }

  render(container, allPeople) {
    const mapDiv = container.querySelector('#network-map');
    const legendDiv = container.querySelector('#node-legend');
    
    const nodes = this.buildNodes(allPeople);
    const connections = this.buildConnections(nodes);

    // Setup interactive controls
    const controls = new InteractiveMapControls(mapDiv);
    const graphContainer = controls.setup();
    
    this.renderer.renderConnections(graphContainer, mapDiv, nodes, connections);
    this.renderer.renderNodes(graphContainer, mapDiv, nodes, (node) => {
      this.detailsModal.show(node);
    });
    this.renderer.renderLegend(legendDiv);
  }

  // removed setupInteractiveMap() - moved to InteractiveMapControls
  // removed updateTransform() - moved to InteractiveMapControls

  buildNodes(allPeople) {
    return allPeople.map(person => {
      const data = this.getPersonData(person);
      const influenceScore = RelationshipMetrics.calculateInfluence(data);
      const trustLevel = RelationshipMetrics.calculateTrust(data);
      const intensity = this.analyzer.tagManager.getIntensity(person);
      const type = this.analyzer.tagManager.getType(person);
      const isHighLeverage = (data.debt?.leverageScore || 0) >= 60;
      const hasEmotionalBait = (data.emotional?.totalRisk || 0) >= 60;
      const hasBoundaryViolation = (data.boundary?.totalThreat || 0) >= 60;
      const hierarchy = data.network?.hierarchy || 1;
      const hasReputationControl = (data.network?.reputationScore || 0) >= 66;
      const isManeuvering = (data.network?.maneuveringScore || 0) >= 66;
      
      return {
        name: person,
        influence: influenceScore,
        trust: trustLevel,
        intensity,
        type,
        data,
        isHighLeverage,
        hasEmotionalBait,
        hasBoundaryViolation,
        hierarchy,
        hasReputationControl,
        isManeuvering
      };
    });
  }

  buildConnections(nodes) {
    const connections = [];
    const networks = new Map();
    
    nodes.forEach(node => {
      const network = node.data.network?.network;
      if (network) {
        if (!networks.has(network)) {
          networks.set(network, []);
        }
        networks.get(network).push(node.name);
      }
    });

    for (const [network, people] of networks.entries()) {
      for (let i = 0; i < people.length; i++) {
        for (let j = i + 1; j < people.length; j++) {
          const frequency = this.calculateInteractionFrequency(people[i], people[j]);
          connections.push({
            from: people[i],
            to: people[j],
            frequency
          });
        }
      }
    }

    return connections;
  }

  calculateInteractionFrequency(person1, person2) {
    const debt1 = this.analyzer.modules.debt?.history.get(person1)?.length || 0;
    const debt2 = this.analyzer.modules.debt?.history.get(person2)?.length || 0;
    const emotional1 = this.analyzer.modules.emotional?.timeline.get(person1)?.length || 0;
    const emotional2 = this.analyzer.modules.emotional?.timeline.get(person2)?.length || 0;
    
    return Math.min(10, (debt1 + debt2 + emotional1 + emotional2) / 4);
  }

  // removed renderConnections() - moved to GraphRenderer
  // removed renderNodes() - moved to GraphRenderer
  // removed renderLegend() - moved to GraphRenderer
  // removed showNodeDetails() - moved to NodeDetailsModal

  getPersonData(person) {
    return {
      name: person,
      debt: this.analyzer.modules.debt?.analyses.find(a => a.person === person),
      emotional: this.analyzer.modules.emotional?.analyses.find(a => a.person === person),
      network: this.analyzer.modules.network?.people.find(p => p.name === person),
      boundary: this.analyzer.modules.boundary?.scans.find(s => s.person === person),
      status: this.analyzer.modules.status?.analyses.find(a => a.person === person),
      intimacy: this.analyzer.modules.intimacy?.alerts.find(a => a.person === person)
    };
  }
}