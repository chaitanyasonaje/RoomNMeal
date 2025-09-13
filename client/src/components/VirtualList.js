import React, { useState, useEffect, useRef, useMemo } from 'react';
import { getVisibleItems } from '../utils/performance';

const VirtualList = ({ 
  items, 
  itemHeight = 60, 
  containerHeight = 400,
  renderItem,
  className = '',
  overscan = 5
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);

  const visibleData = useMemo(() => {
    return getVisibleItems(items, containerHeight, itemHeight, scrollTop);
  }, [items, containerHeight, itemHeight, scrollTop]);

  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
    >
      <div style={{ height: visibleData.totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${visibleData.offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0
          }}
        >
          {visibleData.visibleItems.map((item, index) => (
            <div
              key={visibleData.startIndex + index}
              style={{ height: itemHeight }}
            >
              {renderItem(item, visibleData.startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VirtualList;
