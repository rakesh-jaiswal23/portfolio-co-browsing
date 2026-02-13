"use client";

class Highlighter {
  static highlight(element) {
    if (!element) return;

    this.removeHighlights();

    element.classList.add("ai-highlight");

    // Element ko view mein lao
    element.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });

    setTimeout(() => {
      element.classList.remove("ai-highlight");
    }, 4000); // 4 seconds tak highlighted rahega
  }

  static flash(element) {
    if (!element) return;

    element.classList.add("ai-highlight");
    setTimeout(() => {
      element.classList.remove("ai-highlight");
    }, 1500);
  }

  static removeHighlights() {
    document.querySelectorAll(".ai-highlight").forEach((el) => {
      el.classList.remove("ai-highlight");
    });
  }

  static highlightMultiple(elements) {
    elements.forEach((el) => this.highlight(el));
  }
}

export default Highlighter;
