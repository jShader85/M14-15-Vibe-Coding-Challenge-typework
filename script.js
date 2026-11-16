'use strict';

function initializePlayground() {
  const ids = ['text-input', 'font', 'size', 'weight', 'leading', 'tracking', 'ink', 'paper'];
  const controls = Object.fromEntries(ids.map(id => [id, document.getElementById(id)]));
  const preview = document.getElementById('preview');
  const canvas = document.getElementById('canvas');
  const buttons = [...document.querySelectorAll('[data-align]')];
  // Use original markup values rather than values restored by the browser.
  const defaults = Object.fromEntries(ids.map(id => {
    const control = controls[id];
    const value = control.tagName === 'SELECT'
      ? ([...control.options].find(option => option.defaultSelected) || control.options[0]).value
      : control.defaultValue;
    return [id, value];
  }));
  const defaultAlignment = buttons.find(button => button.getAttribute('aria-pressed') === 'true')?.dataset.align || 'left';
  let alignment = defaultAlignment;

  function updatePreview() {
    // Plain text preserves line breaks and never executes user-entered HTML.
    preview.textContent = controls['text-input'].value;
    Object.assign(preview.style, {
      fontFamily: controls.font.value === 'system-ui' ? 'system-ui, sans-serif' : `"${controls.font.value}", serif`,
      fontSize: `${controls.size.value}px`,
      fontWeight: controls.weight.value,
      lineHeight: controls.leading.value,
      letterSpacing: `${controls.tracking.value}px`,
      textAlign: alignment,
      color: controls.ink.value
    });
    canvas.style.backgroundColor = controls.paper.value;
    for (const [id, suffix] of [['size', ' px'], ['weight', ''], ['leading', ''], ['tracking', ' px']]) {
      document.getElementById(`${id}-value`).textContent = controls[id].value + suffix;
    }
    document.getElementById('font-caption').textContent = `${controls.font.selectedOptions[0].textContent} / ${controls.weight.value === '700' ? 'Bold' : 'Regular'}`;
    const count = Array.from(controls['text-input'].value).length;
    document.getElementById('character-count').textContent = `${count} character${count === 1 ? '' : 's'}`;
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.align === alignment)));
  }

  Object.values(controls).forEach(control => {
    control.addEventListener('input', updatePreview);
    control.addEventListener('change', updatePreview);
  });
  buttons.forEach(button => button.addEventListener('click', () => {
    alignment = button.dataset.align;
    updatePreview();
  }));
  document.getElementById('reset').addEventListener('click', () => {
    ids.forEach(id => { controls[id].value = defaults[id]; });
    alignment = defaultAlignment;
    updatePreview();
  });
  updatePreview();
}

// Initialize after the HTML is available, regardless of script placement.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePlayground, { once: true });
} else {
  initializePlayground();
}
