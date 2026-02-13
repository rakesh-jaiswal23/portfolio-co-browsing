'use client';

class DOMExtractor {
  static extractVisibleContent() {
    const content = {
      sections: [],
      projects: [],
      skills: [],
      buttons: [],
      forms: [],
      headings: [],
      summary: ''
    };

    // Extract sections
    document.querySelectorAll('section[id]').forEach(section => {
      content.sections.push({
        id: section.id,
        title: section.querySelector('h1, h2, h3')?.innerText || section.id,
        text: section.innerText.substring(0, 200)
      });
    });

    // Extract projects
    document.querySelectorAll('[data-project-id], .project-card').forEach(project => {
      content.projects.push({
        id: project.dataset.projectId,
        title: project.querySelector('h3')?.innerText || 'Project',
        description: project.querySelector('p')?.innerText || '',
        tech: Array.from(project.querySelectorAll('.tech-tag')).map(t => t.innerText)
      });
    });

    // Extract skills
    document.querySelectorAll('[data-skill], .skill-item').forEach(skill => {
      content.skills.push(skill.innerText.trim());
    });

    // Extract forms
    document.querySelectorAll('form').forEach(form => {
      const fields = Array.from(form.querySelectorAll('input, textarea')).map(input => ({
        name: input.name || input.dataset.field,
        type: input.type || 'text',
        placeholder: input.placeholder
      }));
      
      content.forms.push({
        id: form.id,
        fields
      });
    });

    // Page summary
    content.summary = `This portfolio belongs to Rakeshjaiswal, a Full Stack Developer. 
      It contains ${content.projects.length} projects, ${content.skills.length} skills, 
      and sections: ${content.sections.map(s => s.id).join(', ')}.`;

    return content;
  }

  static findElementByUserIntent(intent) {
    const lowerIntent = intent.toLowerCase();
    
    // Check sections
    if (lowerIntent.includes('project')) {
      return document.querySelector('[data-project-id="1"], .project-card:first-child');
    }
    if (lowerIntent.includes('skill')) {
      return document.querySelector('#skills');
    }
    if (lowerIntent.includes('contact')) {
      return document.querySelector('#contact');
    }
    
    return null;
  }
}

export default DOMExtractor;