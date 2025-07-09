import React, { useEffect, useRef } from 'react';

interface InViewProps {
  onInView: () => void;
}

const InViewComponent: React.FC<InViewProps> = ({ onInView }) => {
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onInView();
        }
      },
      {
        threshold: 1.0,
      }
    );

    const currentElement = targetRef.current;

    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [onInView]);

  return (
    <div ref={targetRef} />
  );
};

export default InViewComponent;