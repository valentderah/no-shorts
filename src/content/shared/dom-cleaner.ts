export interface Selectors {
  navigation: string[];
  feed: string[];
}

export function hideElements(selectors: string[]): void {
  selectors.forEach((selector) => {
    try {
      document.querySelectorAll(selector).forEach((element) => {
        (element as HTMLElement).style.display = 'none';
      });
    } catch {
    }
  });
}

export function observeAndClean(
  clean: () => void
): MutationObserver {
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
