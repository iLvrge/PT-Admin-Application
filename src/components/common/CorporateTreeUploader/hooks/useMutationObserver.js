import { useEffect, useMemo } from 'react';

const observerConfig = {
  attributes: true,
  characterData: true,
  attributeOldValue: true,
  subtree: true
};

export default function useMutationObserver (isActive, callback) {
  const observer = useMemo(() => new MutationObserver(callback), [callback]);

  useEffect(
    () => {
      if (isActive) {
        const targetNode = document.getElementById('observedNode');
        observer.observe(targetNode, observerConfig);
      } else {
        observer.disconnect();
      }

      return () => observer.disconnect();
    },
    [isActive, observer]
  );
}