// Shared tagging system for all relationship analyses
export class TagManager {
  constructor() {
    this.tags = new Map(); // personName -> Set of tags
    this.intensity = new Map(); // personName -> intensity level
    this.type = new Map(); // personName -> type
    this.notes = new Map(); // personName -> notes text
    this.privacy = new Map(); // personName -> privacy level
    
    this.availableTags = [
      'gaslighting', 'manipulation', 'genuine', 'toxic', 'healthy',
      'co-dependent', 'transactional', 'supportive', 'draining',
      'boundary-violator', 'emotional-vampire', 'love-bombing',
      'trauma-bonding', 'social-climber', 'authentic'
    ];
    
    this.intensityLevels = ['close', 'acquaintance', 'professional'];
    this.relationshipTypes = ['friend', 'partner', 'coworker', 'family', 'other'];
    this.privacyLevels = ['visible', 'private', 'hidden', 'archived'];
  }

  addTag(person, tag) {
    if (!this.tags.has(person)) {
      this.tags.set(person, new Set());
    }
    this.tags.get(person).add(tag);
  }

  removeTag(person, tag) {
    if (this.tags.has(person)) {
      this.tags.get(person).delete(tag);
    }
  }

  getTags(person) {
    return this.tags.get(person) || new Set();
  }

  setIntensity(person, intensity) {
    this.intensity.set(person, intensity);
  }

  getIntensity(person) {
    return this.intensity.get(person) || null;
  }

  setType(person, type) {
    this.type.set(person, type);
  }

  getType(person) {
    return this.type.get(person) || null;
  }

  setNotes(person, notes) {
    this.notes.set(person, notes);
  }

  getNotes(person) {
    return this.notes.get(person) || '';
  }

  setPrivacy(person, privacy) {
    this.privacy.set(person, privacy);
  }

  getPrivacy(person) {
    return this.privacy.get(person) || 'visible';
  }

  getAllPeople(includeHidden = true) {
    const allPeople = new Set([
      ...this.tags.keys(),
      ...this.intensity.keys(),
      ...this.type.keys(),
      ...this.notes.keys(),
      ...this.privacy.keys()
    ]);
    
    if (!includeHidden) {
      return Array.from(allPeople).filter(person => {
        const privacy = this.getPrivacy(person);
        return privacy !== 'hidden' && privacy !== 'archived';
      });
    }
    
    return Array.from(allPeople);
  }

  filterByTag(tag) {
    const results = [];
    for (const [person, tags] of this.tags.entries()) {
      if (tags.has(tag)) {
        results.push(person);
      }
    }
    return results;
  }

  renderTagSelector(person, onTagChange) {
    const container = document.createElement('div');
    container.style.marginTop = '12px';
    
    // Intensity selector
    const intensitySection = document.createElement('div');
    intensitySection.style.marginBottom = '8px';
    intensitySection.innerHTML = `<div style="font-size: 11px; color: #666; margin-bottom: 4px;">Intensity:</div>`;
    
    const intensityContainer = document.createElement('div');
    intensityContainer.style.cssText = 'display: flex; gap: 4px;';
    
    const currentIntensity = this.getIntensity(person);
    this.intensityLevels.forEach(level => {
      const btn = document.createElement('button');
      btn.textContent = level;
      btn.style.cssText = `
        padding: 4px 12px;
        font-size: 10px;
        border: 1px solid ${currentIntensity === level ? '#fff' : '#333'};
        background: ${currentIntensity === level ? '#fff' : '#111'};
        color: ${currentIntensity === level ? '#000' : '#666'};
        border-radius: 3px;
        cursor: pointer;
        font-family: inherit;
        transition: all 0.2s;
      `;
      btn.addEventListener('click', () => {
        this.setIntensity(person, level);
        if (onTagChange) onTagChange();
      });
      intensityContainer.appendChild(btn);
    });
    intensitySection.appendChild(intensityContainer);
    container.appendChild(intensitySection);
    
    // Type selector
    const typeSection = document.createElement('div');
    typeSection.style.marginBottom = '8px';
    typeSection.innerHTML = `<div style="font-size: 11px; color: #666; margin-bottom: 4px;">Type:</div>`;
    
    const typeContainer = document.createElement('div');
    typeContainer.style.cssText = 'display: flex; flex-wrap: wrap; gap: 4px;';
    
    const currentType = this.getType(person);
    this.relationshipTypes.forEach(type => {
      const btn = document.createElement('button');
      btn.textContent = type;
      btn.style.cssText = `
        padding: 4px 12px;
        font-size: 10px;
        border: 1px solid ${currentType === type ? '#fff' : '#333'};
        background: ${currentType === type ? '#fff' : '#111'};
        color: ${currentType === type ? '#000' : '#666'};
        border-radius: 3px;
        cursor: pointer;
        font-family: inherit;
        transition: all 0.2s;
      `;
      btn.addEventListener('click', () => {
        this.setType(person, type);
        if (onTagChange) onTagChange();
      });
      typeContainer.appendChild(btn);
    });
    typeSection.appendChild(typeContainer);
    container.appendChild(typeSection);
    
    // Pattern tags
    const tagsSection = document.createElement('div');
    tagsSection.style.marginBottom = '8px';
    tagsSection.innerHTML = `<div style="font-size: 11px; color: #666; margin-bottom: 4px;">Patterns:</div>`;
    
    const tagContainer = document.createElement('div');
    tagContainer.style.cssText = 'display: flex; flex-wrap: wrap; gap: 4px;';
    const currentTags = this.getTags(person);

    this.availableTags.forEach(tag => {
      const tagBtn = document.createElement('button');
      tagBtn.textContent = tag;
      tagBtn.style.cssText = `
        padding: 4px 8px;
        font-size: 10px;
        border: 1px solid ${currentTags.has(tag) ? '#fff' : '#333'};
        background: ${currentTags.has(tag) ? '#fff' : '#111'};
        color: ${currentTags.has(tag) ? '#000' : '#666'};
        border-radius: 3px;
        cursor: pointer;
        font-family: inherit;
        transition: all 0.2s;
      `;
      
      tagBtn.addEventListener('click', () => {
        if (currentTags.has(tag)) {
          this.removeTag(person, tag);
        } else {
          this.addTag(person, tag);
        }
        if (onTagChange) onTagChange();
      });

      tagContainer.appendChild(tagBtn);
    });
    tagsSection.appendChild(tagContainer);
    container.appendChild(tagsSection);
    
    // Notes section
    const notesSection = document.createElement('div');
    notesSection.style.marginTop = '8px';
    notesSection.innerHTML = `<div style="font-size: 11px; color: #666; margin-bottom: 4px;">Notes:</div>`;
    
    const notesInput = document.createElement('textarea');
    notesInput.value = this.getNotes(person);
    notesInput.placeholder = 'Add observations or notes...';
    notesInput.style.cssText = `
      width: 100%;
      min-height: 60px;
      padding: 8px;
      background: #0a0a0a;
      border: 1px solid #333;
      color: #fff;
      font-family: inherit;
      font-size: 11px;
      border-radius: 3px;
      resize: vertical;
    `;
    notesInput.addEventListener('input', () => {
      this.setNotes(person, notesInput.value);
      
      // Highlight critical incidents
      const criticalKeywords = ['weaponiz', 'manipulat', 'gasligh', 'abus', 'violat', 'threat', 'danger', 'exploit'];
      const text = notesInput.value.toLowerCase();
      const hasCritical = criticalKeywords.some(kw => text.includes(kw));
      
      if (hasCritical) {
        notesInput.style.borderColor = '#ff4444';
        notesInput.style.background = 'rgba(255, 68, 68, 0.05)';
      } else {
        notesInput.style.borderColor = '#333';
        notesInput.style.background = '#0a0a0a';
      }
      
      if (onTagChange) onTagChange();
    });
    notesSection.appendChild(notesInput);
    
    // Trigger highlighting on initial render
    const text = notesInput.value.toLowerCase();
    const criticalKeywords = ['weaponiz', 'manipulat', 'gasligh', 'abus', 'violat', 'threat', 'danger', 'exploit'];
    const hasCritical = criticalKeywords.some(kw => text.includes(kw));
    if (hasCritical) {
      notesInput.style.borderColor = '#ff4444';
      notesInput.style.background = 'rgba(255, 68, 68, 0.05)';
    }
    
    container.appendChild(notesSection);
    
    // Privacy settings section
    const privacySection = document.createElement('div');
    privacySection.style.marginTop = '8px';
    privacySection.innerHTML = `<div style="font-size: 11px; color: #666; margin-bottom: 4px;">Privacy:</div>`;
    
    const privacyContainer = document.createElement('div');
    privacyContainer.style.cssText = 'display: flex; flex-wrap: wrap; gap: 4px;';
    
    const currentPrivacy = this.getPrivacy(person);
    this.privacyLevels.forEach(level => {
      const btn = document.createElement('button');
      btn.textContent = level;
      btn.style.cssText = `
        padding: 4px 12px;
        font-size: 10px;
        border: 1px solid ${currentPrivacy === level ? '#fff' : '#333'};
        background: ${currentPrivacy === level ? '#fff' : '#111'};
        color: ${currentPrivacy === level ? '#000' : '#666'};
        border-radius: 3px;
        cursor: pointer;
        font-family: inherit;
        transition: all 0.2s;
      `;
      btn.addEventListener('click', () => {
        this.setPrivacy(person, level);
        if (onTagChange) onTagChange();
      });
      privacyContainer.appendChild(btn);
    });
    privacySection.appendChild(privacyContainer);
    
    // Privacy explanation
    const privacyHelp = document.createElement('div');
    privacyHelp.style.cssText = 'margin-top: 4px; font-size: 9px; color: #555;';
    const privacyDescriptions = {
      visible: 'Shown in all views and exports',
      private: 'Shown only to you, excluded from exports',
      hidden: 'Hidden from normal views',
      archived: 'Archived, excluded from active analysis'
    };
    privacyHelp.textContent = privacyDescriptions[currentPrivacy];
    privacySection.appendChild(privacyHelp);
    
    container.appendChild(privacySection);

    return container;
  }
}