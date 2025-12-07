export interface Selectors {
  navigation: string[];
  feed: string[];
}

export function hideElements(selectors: string[]): void {
  selectors.forEach((selector) => {
    try {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        (element as HTMLElement).style.display = 'none';
      });
    } catch (error) {
      console.debug(`Selector error: ${selector}`, error);
    }
  });
}

export function hideElementsByText(selectors: string[], text: string): void {
  selectors.forEach((selector) => {
    try {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        const titleElement = element.querySelector('yt-formatted-string.title');
        if (titleElement && titleElement.textContent?.trim() === text) {
          (element as HTMLElement).style.display = 'none';
        }
      });
    } catch (error) {
      console.debug(`Selector error: ${selector}`, error);
    }
  });
}

export function observeAndClean(
  selectors: Selectors,
  onClean: () => void = () => {}
): MutationObserver {
  const clean = () => {
    hideElements(selectors.navigation);
    hideElements(selectors.feed);
    
    const guideEntries = document.querySelectorAll('ytd-guide-entry-renderer');
    guideEntries.forEach((entry) => {
      const titleElement = entry.querySelector('yt-formatted-string.title');
      if (titleElement && titleElement.textContent?.trim() === 'Shorts') {
        (entry as HTMLElement).style.display = 'none';
      }
    });
    
    const richShelves = document.querySelectorAll('ytd-rich-shelf-renderer');
    richShelves.forEach((shelf) => {
      const titleElement = shelf.querySelector('span#title');
      if (titleElement && titleElement.textContent?.trim() === 'Shorts') {
        (shelf as HTMLElement).style.display = 'none';
      }
      if (shelf.hasAttribute('is-shorts')) {
        (shelf as HTMLElement).style.display = 'none';
      }
    });
    
    onClean();
  };

  clean();

  const observer = new MutationObserver((mutations) => {
    let shouldClean = false;

    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length > 0) {
        shouldClean = true;
      }
    });

    if (shouldClean) {
      setTimeout(clean, 100);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  return observer;
}

export function removeElements(selectors: string[]): void {
  selectors.forEach((selector) => {
    try {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        element.remove();
      });
    } catch (error) {
      console.debug(`Selector error: ${selector}`, error);
    }
  });
}

