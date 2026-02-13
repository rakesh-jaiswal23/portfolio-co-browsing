'use client';

import Highlighter from './Highlighter';

export class ActionHandler {
  static async handleToolCall(toolName, params) {
    console.log(` Executing tool: ${toolName}`, params);
    
    try {
      switch(toolName) {
        case 'scroll':
          return await this.scroll(params);
        case 'highlight':
          return await this.highlight(params);
        case 'click':
          return await this.click(params);
        case 'navigate':
          return await this.navigate(params);
        case 'fillForm':
          return await this.fillForm(params);
        case 'focus':
          return await this.focus(params);
        default:
          console.log(`Unknown tool: ${toolName}`);
          return { success: false, message: 'Unknown tool' };
      }
    } catch (error) {
      console.error(` Error executing ${toolName}:`, error);
      return { success: false, message: error.message };
    }
  }


  static async scroll(params) {
    console.log(' Scroll params:', params);
    
    try {
      // Case 1: Direction based scroll
      if (params.direction) {
        const direction = params.direction.toLowerCase();
        const scrollAmount = direction === 'up' ? -600 : 600;
        
        window.scrollBy({
          top: scrollAmount,
          behavior: 'smooth'
        });
        
        console.log(` Scrolled ${direction}`);
        return { 
          success: true, 
          message: `Scrolled ${direction}` 
        };
      }
      
      // Case 2: Target based scroll
      if (params.target) {
        const element = this.findElement(params.target);
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
          return { 
            success: true, 
            message: `Scrolled to ${params.target}` 
          };
        }
      }
      
      // Case 3: Default - scroll down
      window.scrollBy({
        top: 600,
        behavior: 'smooth'
      });
      
      return { 
        success: true, 
        message: 'Scrolled down' 
      };
      
    } catch (error) {
      console.error('Scroll error:', error);
      return { 
        success: false, 
        message: error.message 
      };
    }
  }

  static async highlight({ selector, text }) {
    console.log(' Highlight params:', { selector, text });
    
    try {
      const element = selector 
        ? document.querySelector(selector)
        : this.findElementByText(text);
      
      if (element) {
        Highlighter.highlight(element);
        return { 
          success: true, 
          message: `Highlighted element` 
        };
      }
      return { 
        success: false, 
        message: 'Element not found' 
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.message 
      };
    }
  }

  static async click({ selector, text }) {
    console.log(' Click params:', { selector, text });
    
    try {
      const element = selector
        ? document.querySelector(selector)
        : this.findElementByText(text);
      
      if (element) {
        element.click();
        Highlighter.flash(element);
        return { 
          success: true, 
          message: `Clicked on element` 
        };
      }
      return { 
        success: false, 
        message: 'Element not found' 
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.message 
      };
    }
  }

  static async navigate({ section }) {
    console.log(' Navigate params:', { section });
    
    try {
      const element = document.getElementById(section) || 
                     this.findElementByText(section);
      
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
        Highlighter.flash(element);
        return { 
          success: true, 
          message: `Navigated to ${section}` 
        };
      }
      return { 
        success: false, 
        message: `Section ${section} not found` 
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.message 
      };
    }
  }

  static async fillForm({ formSelector, fields }) {
    console.log(' Fill form params:', { formSelector, fields });
    
    try {
      const form = formSelector 
        ? document.querySelector(formSelector)
        : document.getElementById('contact-form');
      
      if (!form) {
        return { 
          success: false, 
          message: 'Form not found' 
        };
      }

      Object.entries(fields).forEach(([fieldName, value]) => {
        const input = form.querySelector(`[name="${fieldName}"], [data-field="${fieldName}"]`);
        if (input) {
          input.value = value;
          Highlighter.flash(input);
        }
      });

      return { 
        success: true, 
        message: 'Form filled successfully' 
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.message 
      };
    }
  }

  static async focus({ section }) {
    console.log(' Focus params:', { section });
    
    try {
      const element = document.getElementById(section) ||
                     this.findElementByText(section);
      
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        Highlighter.highlight(element);
        return { 
          success: true, 
          message: `Focused on ${section}` 
        };
      }
      return { 
        success: false, 
        message: 'Element not found' 
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.message 
      };
    }
  }

  static findElement(target) {
    return document.getElementById(target) ||
           document.querySelector(target) ||
           this.findElementByText(target);
  }

  static findElementByText(text) {
    if (!text) return null;
    
    const searchText = text.toLowerCase();
    const elements = document.querySelectorAll(
      'h1, h2, h3, h4, button, a, .project-card, section, [data-project-title]'
    );
    
    for (let el of elements) {
      if (el.innerText?.toLowerCase().includes(searchText)) {
        return el;
      }
    }
    return null;
  }
}