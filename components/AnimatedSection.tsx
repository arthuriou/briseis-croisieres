"use client";
import { useEffect, useRef, ReactNode, CSSProperties } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animation?: 'fade-in' | 'slide-left' | 'slide-right' | 'zoom-in';
  delay?: number;
  style?: CSSProperties;
}

const AnimatedSection = ({ 
  children, 
  className = '', 
  animation = 'fade-in',
  delay = 0,
  style = {}
}: AnimatedSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            let animationClass = 'animate-fade-in';
            
            switch (animation) {
              case 'slide-left':
                animationClass = 'animate-slide-left';
                break;
              case 'slide-right':
                animationClass = 'animate-slide-right';
                break;
              case 'zoom-in':
                animationClass = 'animate-zoom-in';
                break;
              default:
                animationClass = 'animate-fade-in';
            }
            
            // Ajouter la classe d'animation après un délai
            setTimeout(() => {
              if (entry.target instanceof HTMLElement) {
                entry.target.classList.add(animationClass);
              }
            }, delay);
            
            // Arrêter d'observer une fois que l'animation est déclenchée
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 } // Déclencher quand au moins 10% de l'élément est visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [animation, delay]);

  return (
    <div 
      ref={sectionRef} 
      className={`opacity-0 ${className}`}
      style={{ 
        animationDelay: `${delay}ms`, 
        animationFillMode: 'forwards',
        ...style 
      }}
    >
      {children}
    </div>
  );
};

export default AnimatedSection; 