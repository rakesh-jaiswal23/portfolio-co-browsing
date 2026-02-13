// lib/tools.js - UPDATED

export const tools = [
  {
    name: "scroll",
    description: "Scroll the page up or down",
    parameters: {
      type: "object",
      properties: {
        direction: { type: "string", enum: ["up", "down"] },
        target: { type: "string" }
      }
    }
  },
  {
    name: "highlight",
    description: "Highlight elements containing specific text",
    parameters: {
      type: "object",
      properties: {
        text: { type: "string" }
      },
      required: ["text"]
    }
  },
  {
    name: "click",
    description: "Click on an element",
    parameters: {
      type: "object",
      properties: {
        selector: { type: "string" },
        text: { type: "string" }
      }
    }
  },
  {
    name: "navigate",
    description: "Navigate to a specific section",
    parameters: {
      type: "object",
      properties: {
        section: { type: "string" }
      },
      required: ["section"]
    }
  },
  {
    name: "fillForm",
    description: "Fill a specific field in a form",
    parameters: {
      type: "object",
      properties: {
        field: { 
          type: "string", 
          description: "Field name (name, email, message, etc.)" 
        },
        value: { 
          type: "string", 
          description: "Value to fill in the field" 
        }
      },
      required: ["field", "value"]
    }
  },
  {
    name: "focus",
    description: "Focus on a specific section",
    parameters: {
      type: "object",
      properties: {
        section: { type: "string" }
      }
    }
  }
];