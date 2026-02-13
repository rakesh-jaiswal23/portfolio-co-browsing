'use client';

class Highlighter {
  static highlight(element) {
    if (!element) return;
    
    // Remove existing highlights
    this.removeHighlights();
    
    // Add highlight class
    element.classList.add('ai-highlight');
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      element.classList.remove('ai-highlight');
    }, 3000);
  }

  static flash(element) {
    if (!element) return;
    
    element.classList.add('ai-highlight');
    setTimeout(() => {
      element.classList.remove('ai-highlight');
    }, 1000);
  }

  static removeHighlights() {
    document.querySelectorAll('.ai-highlight').forEach(el => {
      el.classList.remove('ai-highlight');
    });
  }

  static highlightMultiple(elements) {
    elements.forEach(el => this.highlight(el));
  }

  static highlightByText(text) {
    const elements = document.querySelectorAll('h1, h2, h3, h4, p, button, a, .project-card');
    const matched = [];
    
    elements.forEach(el => {
      if (el.innerText?.toLowerCase().includes(text.toLowerCase())) {
        this.highlight(el);
        matched.push(el);
      }
    });
    
    return matched;
  }
}

export default Highlighter;