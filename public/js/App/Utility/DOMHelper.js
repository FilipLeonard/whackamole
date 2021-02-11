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
    if (sectionClass === 'join') {
      DOMHelper.hideElement('.header-main');
      DOMHelper.displayElement('.header');
    } else {
      DOMHelper.hideElement('.header');
      DOMHelper.displayElement('.header-main');
    }
    const sections = document.querySelectorAll('section');
    for (const section of sections) {
      if (section.classList.contains(sectionClass)) {
        DOMHelper.displayElement(section);
      } else {
        DOMHelper.hideElement(section);
      }
    }
  }

  static getVisibleSection() {
    const visibleSection = document.querySelector('section:not(.hidden)')
      .className;
    if (!visibleSection) throw new Error('No section is visible');
    return visibleSection;
  }

  static clearEventListeners(element) {
    const clonedElement = element.cloneNode(true);
    element.replaceWith(clonedElement);
    return clonedElement;
  }

  static addClass(elementOrSelector, className) {
    const element = DOMHelper._getElement(elementOrSelector);
    element.classList.add(className);
  }

  static removeClass(elementOrSelector, className) {
    const element = DOMHelper._getElement(elementOrSelector);
    element.classList.remove(className);
  }

  static _getElement(elementOrSelector) {
    let element;
    if (typeof elementOrSelector === 'string')
      element = document.querySelector(elementOrSelector);
    if (typeof elementOrSelector === 'object') element = elementOrSelector;
    return element;
  }
}
