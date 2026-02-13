"use client";

import Highlighter from "./Highlighter";

export class ActionHandler {
  static async handleToolCall(toolName, params) {
    console.log(` Executing tool: ${toolName}`, params);

    try {
      switch (toolName) {
        case "scroll":
          return await this.scroll(params);
        case "highlight":
          return await this.highlight(params);
        case "click":
          return await this.click(params);
        case "navigate":
          return await this.navigate(params);
        case "fillForm": 
          return await this.fillForm(params);
        case "focus":
          return await this.focus(params);
        default:
          console.log(`Unknown tool: ${toolName}`);
          return { success: false, message: "Unknown tool" };
      }
    } catch (error) {
      console.error(` Error executing ${toolName}:`, error);
      return { success: false, message: error.message };
    }
  }

  //   FUNCTION 
  static async fillForm(params) {
    console.log(" Fill form params:", params);

    try {
      // Case 1: { field: "name", value: "Rakesh" }
      if (params.field && params.value !== undefined) {
        return await this.fillSingleField(params.field, params.value);
      }

      // Case 2: { formSelector: "#contact-form", fields: { name: "Rakesh" } }
      else if (params.fields) {
        const results = [];
        for (const [fieldName, value] of Object.entries(params.fields)) {
          const result = await this.fillSingleField(fieldName, value);
          results.push(result);
        }
        return {
          success: results.every((r) => r.success),
          message: `Filled ${results.length} field(s)`,
        };
      } else {
        return {
          success: false,
          message: "Invalid parameters for fillForm",
        };
      }
    } catch (error) {
      console.error("Form fill error:", error);
      return { success: false, message: error.message };
    }
  }

  static async fillSingleField(field, value) {
    console.log(`Filling field "${field}" with "${value}"`);

    try {
      // Field mappings
      const fieldMappings = {
        name: ["name", "fullname", "full-name", "user_name", "username"],
        email: ["email", "e-mail", "mail", "email_address", "user_email"],
        message: ["message", "msg", "comments", "description", "content"],
        phone: ["phone", "mobile", "contact", "tel", "telephone"],
        subject: ["subject", "title", "topic"],
      };

      // Sab possible selectors
      const possibleSelectors = [
        `[name="${field}"]`,
        `[name="${field.toLowerCase()}"]`,
        `[id="${field}"]`,
        `[id="${field.toLowerCase()}"]`,
        `[data-field="${field}"]`,
        `[data-field="${field.toLowerCase()}"]`,
        `[placeholder*="${field}" i]`,
        `[placeholder*="${field.toLowerCase()}" i]`,
        `input[type="text"]`,
        `input[type="email"]`,
        `textarea`,
        `.${field}`,
        `#${field}`,
      ];

      // Add mapped fields
      for (const [key, aliases] of Object.entries(fieldMappings)) {
        if (key === field || aliases.includes(field.toLowerCase())) {
          for (const alias of aliases) {
            possibleSelectors.push(`[name="${alias}"]`);
            possibleSelectors.push(`[id="${alias}"]`);
            possibleSelectors.push(`[data-field="${alias}"]`);
          }
        }
      }

      let input = null;

      // Sab selectors try karo
      for (const selector of possibleSelectors) {
        const element = document.querySelector(selector);
        if (
          element &&
          (element.tagName === "INPUT" ||
            element.tagName === "TEXTAREA" ||
            element.tagName === "SELECT")
        ) {
          input = element;
          break;
        }
      }

      // Agar nahi mila toh form mein search karo
      if (!input) {
        const form =
          document.getElementById("contact-form") ||
          document.querySelector("form");
        if (form) {
          const inputs = form.querySelectorAll("input, textarea, select");
          for (const inp of inputs) {
            const name = inp.name?.toLowerCase() || "";
            const placeholder = inp.placeholder?.toLowerCase() || "";
            const id = inp.id?.toLowerCase() || "";
            const dataField =
              inp.getAttribute("data-field")?.toLowerCase() || "";

            if (
              name.includes(field.toLowerCase()) ||
              placeholder.includes(field.toLowerCase()) ||
              id.includes(field.toLowerCase()) ||
              dataField.includes(field.toLowerCase())
            ) {
              input = inp;
              break;
            }
          }
        }
      }

      if (input) {
        // Value set kiya 
        input.value = value;

        // Events trigger kiya
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
        input.dispatchEvent(new Event("blur", { bubbles: true }));

        // Highlight effect
        Highlighter.flash(input);

        console.log(` Field "${field}" filled with "${value}"`);
        return {
          success: true,
          message: ` Filled "${field}" with "${value}"`,
        };
      } else {
        console.log(` Field "${field}" not found`);
        return {
          success: false,
          message: ` Could not find field: ${field}`,
        };
      }
    } catch (error) {
      console.error("Field fill error:", error);
      return { success: false, message: error.message };
    }
  }

 
  static async scroll(params) {
    try {
      if (params.direction) {
        const direction = params.direction.toLowerCase();
        const scrollAmount = direction === "up" ? -600 : 600;
        window.scrollBy({ top: scrollAmount, behavior: "smooth" });
        return { success: true, message: `Scrolled ${direction}` };
      }

      if (params.target) {
        const element = this.findElement(params.target);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          return { success: true, message: `Scrolled to ${params.target}` };
        }
      }

      window.scrollBy({ top: 600, behavior: "smooth" });
      return { success: true, message: "Scrolled down" };
    } catch (error) {
      console.error("Scroll error:", error);
      return { success: false, message: error.message };
    }
  }

  static async highlight({ text }) {
    console.log("Highlighting text:", text);

    try {
      if (!text) {
        return { success: false, message: "No text provided to highlight" };
      }

      const elements = document.querySelectorAll(
        "h1, h2, h3, h4, h5, h6, p, span, div, button, a, li, td, th, .skill-item, .project-card, .tech-tag, label, input, textarea",
      );

      const matchedElements = [];
      const searchText = text.toLowerCase();

      elements.forEach((el) => {
        const elementText =
          el.innerText?.toLowerCase() || el.value?.toLowerCase() || "";
        if (elementText.includes(searchText)) {
          Highlighter.highlight(el);
          matchedElements.push(el);
        }
      });

      const attributeElements = document.querySelectorAll(
        "[data-skill], [data-project-title], [placeholder]",
      );
      attributeElements.forEach((el) => {
        const attrValue =
          el.getAttribute("data-skill")?.toLowerCase() ||
          el.getAttribute("data-project-title")?.toLowerCase() ||
          el.getAttribute("placeholder")?.toLowerCase() ||
          "";

        if (attrValue.includes(searchText)) {
          Highlighter.highlight(el);
          matchedElements.push(el);
        }
      });

      if (matchedElements.length > 0) {
        return {
          success: true,
          message: ` Highlighted ${matchedElements.length} element(s) containing "${text}"`,
        };
      } else {
        return {
          success: false,
          message: ` No elements found containing "${text}"`,
        };
      }
    } catch (error) {
      console.error("Highlight error:", error);
      return { success: false, message: error.message };
    }
  }

  static async click({ selector, text }) {
    try {
      const element = selector
        ? document.querySelector(selector)
        : this.findElementByText(text);

      if (element) {
        element.click();
        Highlighter.flash(element);
        return { success: true, message: `Clicked on element` };
      }
      return { success: false, message: "Element not found" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  static async navigate({ section }) {
    try {
      const element =
        document.getElementById(section) || this.findElementByText(section);

      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        Highlighter.flash(element);
        return { success: true, message: `Navigated to ${section}` };
      }
      return { success: false, message: `Section ${section} not found` };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  static async focus({ section }) {
    try {
      const element =
        document.getElementById(section) || this.findElementByText(section);

      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        Highlighter.highlight(element);
        return { success: true, message: `Focused on ${section}` };
      }
      return { success: false, message: "Element not found" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  static findElement(target) {
    return (
      document.getElementById(target) ||
      document.querySelector(target) ||
      this.findElementByText(target)
    );
  }

  static findElementByText(text) {
    if (!text) return null;

    const searchText = text.toLowerCase();
    const elements = document.querySelectorAll(
      "h1, h2, h3, h4, button, a, .project-card, section, [data-project-title], [data-skill]",
    );

    for (let el of elements) {
      if (el.innerText?.toLowerCase().includes(searchText)) {
        return el;
      }
    }
    return null;
  }
}
