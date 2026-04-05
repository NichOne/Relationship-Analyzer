import { RelationshipMetrics } from './metrics.js';

// Renders nodes, connections, and legend for the network graph
export class GraphRenderer {
  constructor(analyzer) {
    this.analyzer = analyzer;
  }

  renderConnections(container, mapDiv, nodes, connections) {
    const centerX = mapDiv.offsetWidth / 2;
    const centerY = mapDiv.offsetHeight / 2;
    const radius = Math.min(centerX, centerY) - 60;

    connections.forEach(conn => {
      const fromNode = nodes.find(n => n.name === conn.from);
      const toNode = nodes.find(n => n.name === conn.to);
      if (!fromNode || !toNode) return;

      const fromIdx = nodes.indexOf(fromNode);
      const toIdx = nodes.indexOf(toNode);
      
      const fromAngle = (fromIdx / nodes.length) * Math.PI * 2;
      const toAngle = (toIdx / nodes.length) * Math.PI * 2;
      
      const fromX = centerX + Math.cos(fromAngle) * radius;
      const fromY = centerY + Math.sin(fromAngle) * radius;
      const toX = centerX + Math.cos(toAngle) * radius;
      const toY = centerY + Math.sin(toAngle) * radius;

      const dx = toX - fromX;
      const dy = toY - fromY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      const thickness = 1 + (conn.frequency / 10) * 3;

      const line = document.createElement('div');
      line.style.cssText = `
        position: absolute;
        left: ${fromX}px;
        top: ${fromY}px;
        width: ${distance}px;
        height: ${thickness}px;
        background: rgba(255, 255, 255, 0.1);
        transform-origin: 0 50%;
        transform: rotate(${angle}deg);
        pointer-events: none;
      `;
      container.appendChild(line);
    });
  }

  renderNodes(container, mapDiv, nodes, onNodeClick) {
    const centerX = mapDiv.offsetWidth / 2;
    const centerY = mapDiv.offsetHeight / 2;
    
    // Sort by hierarchy to position them in rings
    const sortedByHierarchy = [...nodes].sort((a, b) => b.hierarchy - a.hierarchy);
    
    // Group by hierarchy level
    const hierarchyGroups = { 1: [], 2: [], 3: [], 4: [] };
    sortedByHierarchy.forEach(node => {
      hierarchyGroups[node.hierarchy].push(node);
    });

    // Render in concentric rings based on hierarchy
    Object.entries(hierarchyGroups).forEach(([level, groupNodes]) => {
      if (groupNodes.length === 0) return;
      
      const ringRadius = (parseInt(level) * 70) + 30; // Inner rings for higher hierarchy
      
      groupNodes.forEach((node, i) => {
        const angle = (i / groupNodes.length) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * Math.min(ringRadius, Math.min(centerX, centerY) - 60);
        const y = centerY + Math.sin(angle) * Math.min(ringRadius, Math.min(centerY, centerY) - 60);
        
        const size = 20 + (node.influence / 100) * 60;
        const glowStyle = node.isHighLeverage ? 'box-shadow: 0 0 20px rgba(255, 68, 68, 0.8);' : '';
        
        let badges = '';
        if (node.hasEmotionalBait) badges += '<div style="position: absolute; top: -4px; right: -4px; width: 16px; height: 16px; background: #ff4444; border-radius: 50%; font-size: 10px; display: flex; align-items: center; justify-content: center; border: 1px solid #000;">⚠</div>';
        if (node.hasBoundaryViolation) badges += '<div style="position: absolute; bottom: -4px; right: -4px; width: 16px; height: 16px; background: #ff8800; border-radius: 50%; font-size: 10px; display: flex; align-items: center; justify-content: center; border: 1px solid #000;">!</div>';
        if (node.hasReputationControl) badges += '<div style="position: absolute; top: -4px; left: -4px; width: 16px; height: 16px; background: #8800ff; border-radius: 50%; font-size: 10px; display: flex; align-items: center; justify-content: center; border: 1px solid #000;">👑</div>';
        if (node.isManeuvering) badges += '<div style="position: absolute; bottom: -4px; left: -4px; width: 16px; height: 16px; background: #00ff88; border-radius: 50%; font-size: 10px; display: flex; align-items: center; justify-content: center; border: 1px solid #000;">♟</div>';
        
        const nodeEl = document.createElement('div');
        nodeEl.className = 'node';
        nodeEl.dataset.nodeName = node.name;
        nodeEl.style.cssText = `
          position: absolute;
          left: ${x - size/2}px;
          top: ${y - size/2}px;
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          border: 2px solid ${RelationshipMetrics.getTrustColor(node.trust)};
          background: ${RelationshipMetrics.getNodeBackground(node.type)};
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: ${Math.max(8, size/6)}px;
          text-align: center;
          cursor: grab;
          transition: transform 0.2s;
          padding: 4px;
          overflow: hidden;
          word-break: break-word;
          ${glowStyle}
        `;
        nodeEl.innerHTML = `${badges}<span style="line-height: 1.1; pointer-events: none;">${node.name}</span>`;
        
        // Drag functionality
        let isDragging = false;
        let startX, startY, offsetX, offsetY;
        
        nodeEl.addEventListener('mousedown', (e) => {
          isDragging = true;
          nodeEl.style.cursor = 'grabbing';
          const rect = nodeEl.getBoundingClientRect();
          const parentRect = container.getBoundingClientRect();
          startX = e.clientX;
          startY = e.clientY;
          offsetX = rect.left - parentRect.left;
          offsetY = rect.top - parentRect.top;
          e.stopPropagation();
        });
        
        const handleMove = (e) => {
          if (!isDragging) return;
          const parentRect = container.getBoundingClientRect();
          const newX = offsetX + (e.clientX - startX);
          const newY = offsetY + (e.clientY - startY);
          nodeEl.style.left = `${newX}px`;
          nodeEl.style.top = `${newY}px`;
        };
        
        const handleUp = () => {
          if (isDragging) {
            isDragging = false;
            nodeEl.style.cursor = 'grab';
          }
        };
        
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleUp);
        
        nodeEl.addEventListener('click', (e) => {
          if (Math.abs(e.clientX - startX) < 5 && Math.abs(e.clientY - startY) < 5) {
            onNodeClick(node);
          }
        });
        
        nodeEl.addEventListener('mouseenter', () => {
          if (!isDragging) nodeEl.style.transform = 'scale(1.1)';
        });
        
        nodeEl.addEventListener('mouseleave', () => {
          if (!isDragging) nodeEl.style.transform = 'scale(1)';
        });

        // Add tooltip
        nodeEl.setAttribute('data-tooltip', `${node.name} - Influence: ${Math.round(node.influence)}`);
        nodeEl.classList.add('tooltip');
        
        container.appendChild(nodeEl);
      });
    });
  }

  renderLegend(legendDiv) {
    legendDiv.innerHTML = `
      <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center;">
        <div>Size = Influence | Position = Hierarchy</div>
        <div style="display: flex; gap: 6px; align-items: center;">
          <span style="width: 12px; height: 12px; border: 2px solid #44ff44; border-radius: 50%;"></span>
          High Trust
        </div>
        <div style="display: flex; gap: 6px; align-items: center;">
          <span style="width: 12px; height: 12px; border: 2px solid #ffaa00; border-radius: 50%;"></span>
          Low Trust
        </div>
        <div style="display: flex; gap: 6px; align-items: center;">
          <span style="width: 12px; height: 12px; border: 2px solid #ff4444; border-radius: 50%;"></span>
          No Trust
        </div>
        <div style="display: flex; gap: 6px; align-items: center;">
          <span style="width: 16px; height: 16px; background: #ff4444; border-radius: 50%; font-size: 8px; display: flex; align-items: center; justify-content: center;">⚠</span>
          Emotional Bait
        </div>
        <div style="display: flex; gap: 6px; align-items: center;">
          <span style="width: 16px; height: 16px; background: #ff8800; border-radius: 50%; font-size: 8px; display: flex; align-items: center; justify-content: center;">!</span>
          Boundary Violation
        </div>
        <div style="display: flex; gap: 6px; align-items: center;">
          <span style="width: 16px; height: 16px; background: #8800ff; border-radius: 50%; font-size: 8px; display: flex; align-items: center; justify-content: center;">👑</span>
          Reputation Control
        </div>
        <div style="display: flex; gap: 6px; align-items: center;">
          <span style="width: 16px; height: 16px; background: #00ff88; border-radius: 50%; font-size: 8px; display: flex; align-items: center; justify-content: center;">♟</span>
          Political Maneuvering
        </div>
        <div style="display: flex; gap: 6px; align-items: center;">
          <span style="width: 20px; height: 20px; border-radius: 50%; box-shadow: 0 0 10px rgba(255, 68, 68, 0.8); background: rgba(255,68,68,0.2); border: 1px solid #ff4444;"></span>
          High Leverage
        </div>
      </div>
    `;
  }
}