import React from 'react';

function usePrevious<T>(prev: T) {
  const ref = React.useRef<T>();
  React.useEffect(() => {
    ref.current = prev;
  }, [prev]);

  return ref.current;
}

export default usePrevious;
