export default class DOMHelper {
  static displayElement(selector) {
    document.querySelector(selector).classList.remove('hidden');
  }

  static hideElement(selector) {
    document.querySelector(selector).classList.add('hidden');
  }

  static clearEventListeners(element) {
    const clonedElement = element.cloneNode(true);
    element.replaceWith(clonedElement);
    return clonedElement;
  }
}
