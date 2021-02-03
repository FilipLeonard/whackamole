export default class DOMHelper {
  static displayElement(elementOrSelector) {
    let element;
    if (typeof elementOrSelector === 'string')
      element = document.querySelector(elementOrSelector);
    if (typeof elementOrSelector === 'object') element = elementOrSelector;
    element.classList.remove('hidden');
  }

  static hideElement(elementOrSelector) {
    let element;
    if (typeof elementOrSelector === 'string')
      element = document.querySelector(elementOrSelector);
    if (typeof elementOrSelector === 'object') element = elementOrSelector;
    element.classList.add('hidden');
  }

  static displaySection(sectionClass) {
    const sections = document.querySelectorAll('section');
    for (const section of sections) {
      if (section.classList.contains(sectionClass)) {
        DOMHelper.displayElement(section);
      } else {
        DOMHelper.hideElement(section);
      }
    }
  }

  static clearEventListeners(element) {
    const clonedElement = element.cloneNode(true);
    element.replaceWith(clonedElement);
    return clonedElement;
  }
}
