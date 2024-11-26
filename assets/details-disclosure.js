class DetailsDisclosure extends HTMLElement {
  constructor() {
    super();
    this.mainDetailsToggle = this.querySelector('details');
    this.content = this.mainDetailsToggle.querySelector('summary').nextElementSibling;
    this.summary = this.mainDetailsToggle.querySelector('summary');

    this.mainDetailsToggle.addEventListener('focusout', this.onFocusOut.bind(this));
    this.mainDetailsToggle.addEventListener('toggle', this.onToggle.bind(this));

    this.addEventListener('mouseenter', this.onMouseEnter.bind(this));
    this.addEventListener('mouseleave', this.onMouseLeave.bind(this));

    this.hoverTimeout = null;
  }

  onFocusOut() {
    setTimeout(() => {
      if (!this.contains(document.activeElement)) this.close();
    });
  }

  onToggle() {
    if (!this.animations) this.animations = this.content.getAnimations();

    if (this.mainDetailsToggle.hasAttribute('open')) {
      this.animations.forEach((animation) => animation.play());
    } else {
      this.animations.forEach((animation) => animation.cancel());
    }
  }

  onMouseEnter() {
    clearTimeout(this.hoverTimeout);
    if (!this.mainDetailsToggle.hasAttribute('open')) {
      this.open();
    }
  }

  onMouseLeave() {
    this.hoverTimeout = setTimeout(() => {
      this.close();
    }, 100);
  }

  open() {
    this.mainDetailsToggle.setAttribute('open', '');
    this.summary.setAttribute('aria-expanded', 'true');
    this.onToggle();
  }

  close() {
    this.mainDetailsToggle.removeAttribute('open');
    this.summary.setAttribute('aria-expanded', 'false');
    this.onToggle();
  }
}
customElements.define('details-disclosure', DetailsDisclosure);

class HeaderMenu extends DetailsDisclosure {
  constructor() {
    super();
    this.header = document.querySelector('.header-wrapper');
  }

  onToggle() {
    if (!this.header) return;
    this.header.preventHide = this.mainDetailsToggle.open;

    if (document.documentElement.style.getPropertyValue('--header-bottom-position-desktop') !== '') return;
    document.documentElement.style.setProperty(
      '--header-bottom-position-desktop',
      `${Math.floor(this.header.getBoundingClientRect().bottom)}px`
    );
  }
}

customElements.define('header-menu', HeaderMenu);
