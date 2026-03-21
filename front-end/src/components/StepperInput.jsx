function StepperInput({ name, value, onChange, onBlur, min = 1, max = 99, className }) {
  const num = Number(value) || min;

  function change(next) {
    const clamped = Math.max(min, Math.min(max, next));
    onChange({ target: { name, value: String(clamped) } });
  }

  return (
    <div className={`stepper ${className || ""}`}>
      <button type="button" className="stepper-btn" onClick={() => change(num - 1)} disabled={num <= min}>−</button>
      <input
        name={name}
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={e => change(Number(e.target.value))}
        onBlur={onBlur}
        className="stepper-input"
      />
      <button type="button" className="stepper-btn" onClick={() => change(num + 1)} disabled={num >= max}>+</button>
    </div>
  );
}

export default StepperInput;
