export const tools = [
  {
    name: "scroll",
    description: "Scroll the page up, down, or to a specific section",
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
    description: "Highlight an element on the page",
    parameters: {
      type: "object",
      properties: {
        selector: { type: "string" },
        text: { type: "string" }
      }
    }
  },
  {
    name: "click",
    description: "Click on a button or link",
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
    description: "Fill contact form fields",
    parameters: {
      type: "object",
      properties: {
        formSelector: { type: "string" },
        fields: { 
          type: "object",
          properties: {
            name: { type: "string" },
            email: { type: "string" },
            message: { type: "string" }
          }
        }
      }
    }
  }
];