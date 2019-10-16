import React from 'react';

function useMemo<MemoResult = unknown, Condition = unknown>(
  callback: () => MemoResult,
  condition: Condition,
  isEqual: (prev: Condition, next: Condition) => boolean,
) {
  const resultRef = React.useRef<MemoResult>(null);
  const conditionRef = React.useRef<Condition>(null);

  // Refresh memo result if condition changed
  if (conditionRef.current === null || !isEqual(conditionRef.current, condition)) {
    resultRef.current = callback();
  }
  conditionRef.current = condition;

  return resultRef.current;
}

export default useMemo;
