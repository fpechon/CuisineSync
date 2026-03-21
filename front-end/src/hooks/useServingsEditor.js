import { useEffect, useRef, useState } from "react";
import useMealPlanStore from "../store/mealPlanStore";

function useServingsEditor(recipeId) {
  const getServings = useMealPlanStore((state) => state.getServings);
  const updateServings = useMealPlanStore((state) => state.updateServings);
  const storeValue = getServings(recipeId);

  const [localValue, setLocalValue] = useState(storeValue);
  const timeoutRef = useRef(null);

  // Sync local value when store rolls back (e.g. after API error)
  useEffect(() => {
    setLocalValue(storeValue);
  }, [storeValue]);

  function handleChange(e) {
    const next = Number(e.target.value);
    setLocalValue(next);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      updateServings(recipeId, next);
    }, 600);
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { localValue, handleChange };
}

export default useServingsEditor;
