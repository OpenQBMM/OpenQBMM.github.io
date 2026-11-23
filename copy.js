// A button that copies the commands of a code block. The clipboard is open
// to a page served over https, as GitHub Pages serves it, or from localhost;
// elsewhere the button selects the commands for the reader to copy.
(function () {
  function text(pre) {
    return pre.textContent.replace(/\s+$/, "") + "\n";
  }

  function select(pre) {
    const range = document.createRange();
    range.selectNodeContents(pre);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  function add(pre) {
    if (pre.dataset.copy) return;
    pre.dataset.copy = "1";
    // The button sits in a frame around the block, outside what scrolls,
    // so that a long command passes under it and does not carry it along
    const frame = document.createElement("div");
    const cs = getComputedStyle(pre);
    frame.style.cssText = "position:relative;margin:" + cs.margin;
    pre.style.margin = "0";
    // A command stays on its line, and the block scrolls only when the
    // command does not fit it
    frame.className = "code-frame";
    pre.parentNode.insertBefore(frame, pre);
    frame.append(pre);
    const b = document.createElement("button");
    b.type = "button";
    b.className = "copy";
    b.textContent = "Copy";
    b.setAttribute("aria-label", "Copy the commands");
    b.style.cssText =
      "position:absolute;top:8px;right:8px;font:500 10px/1 ui-monospace,SFMono-Regular,Menlo,monospace;" +
      "letter-spacing:.1em;text-transform:uppercase;padding:6px 8px;cursor:pointer;" +
      "color:var(--color-code-fg);background:var(--color-code-bg);" +
      "border:1px solid color-mix(in srgb, var(--color-code-fg) 35%, transparent)";
    b.addEventListener("click", () => {
      const done = ok => {
        b.textContent = ok ? "Copied" : "Selected";
        setTimeout(() => { b.textContent = "Copy"; }, 1600);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text(pre)).then(() => done(true), () => { select(pre); done(false); });
      } else {
        select(pre);
        done(false);
      }
    });
    frame.append(b);
  }

  // The button shows while the pointer is over the block or the button has
  // the focus; where there is no pointer to hover, it always shows
  const sheet = document.createElement("style");
  sheet.textContent =
    ".code-frame .copy { opacity: 0; transition: opacity .15s; }" +
    ".code-frame:hover .copy, .code-frame:focus-within .copy { opacity: 1; }" +
    "@media (hover: none) { .code-frame .copy { opacity: 1; } }";
  document.head.append(sheet);

  function scan() { document.querySelectorAll("pre").forEach(add); }

  // A page drawn by support.js puts its content in place after loading
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", scan);
  else scan();
  new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true });
})();
