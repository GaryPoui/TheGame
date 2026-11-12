/** Keep punctuation in explanations while giving every heading the same treatment. */
export function cleanHeadingPeriods(root: ParentNode): void {
  for (const heading of root.querySelectorAll('h1,h2,h3,h4,h5,h6')) {
    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      node.textContent = node.textContent?.replace(/\./g, '') ?? '';
    }
  }
}
