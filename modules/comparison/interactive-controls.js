// Interactive map controls (pan, zoom) for network visualization
export class InteractiveMapControls {
  constructor(mapDiv) {
    this.mapDiv = mapDiv;
    this.scale = 1;
    this.translateX = 0;
    this.translateY = 0;
    this.graphContainer = null;
  }

  setup() {
    const graphContainer = document.createElement('div');
    graphContainer.className = 'graph-container';
    graphContainer.style.cssText = `
      position: absolute;
      width: 100%;
      height: 100%;
      transform-origin: center;
    `;
    
    // Move existing content into container
    while (this.mapDiv.firstChild) {
      graphContainer.appendChild(this.mapDiv.firstChild);
    }
    this.mapDiv.appendChild(graphContainer);
    this.graphContainer = graphContainer;

    this.bindWheelZoom();
    this.bindPan();
    this.bindTouchControls();

    return graphContainer;
  }

  bindWheelZoom() {
    this.mapDiv.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      this.scale = Math.min(Math.max(0.5, this.scale * delta), 3);
      this.updateTransform();
    });
  }

  bindPan() {
    let isDragging = false;
    let startX = 0;
    let startY = 0;

    this.mapDiv.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX - this.translateX;
      startY = e.clientY - this.translateY;
    });

    this.mapDiv.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      this.translateX = e.clientX - startX;
      this.translateY = e.clientY - startY;
      this.updateTransform();
    });

    this.mapDiv.addEventListener('mouseup', () => {
      isDragging = false;
    });

    this.mapDiv.addEventListener('mouseleave', () => {
      isDragging = false;
    });
  }

  bindTouchControls() {
    let touchStartDist = 0;
    let isDragging = false;
    let startX = 0;
    let startY = 0;

    this.mapDiv.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        startX = e.touches[0].clientX - this.translateX;
        startY = e.touches[0].clientY - this.translateY;
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        touchStartDist = Math.sqrt(dx * dx + dy * dy);
      }
    });

    this.mapDiv.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (e.touches.length === 1 && isDragging) {
        this.translateX = e.touches[0].clientX - startX;
        this.translateY = e.touches[0].clientY - startY;
        this.updateTransform();
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (touchStartDist > 0) {
          const delta = dist / touchStartDist;
          this.scale = Math.min(Math.max(0.5, this.scale * delta), 3);
          touchStartDist = dist;
          this.updateTransform();
        }
      }
    });

    this.mapDiv.addEventListener('touchend', () => {
      isDragging = false;
      touchStartDist = 0;
    });
  }

  updateTransform() {
    if (this.graphContainer) {
      this.graphContainer.style.transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;
    }
  }

  getContainer() {
    return this.graphContainer;
  }
}