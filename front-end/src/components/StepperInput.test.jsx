import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StepperInput from './StepperInput';

function renderStepper(props) {
  const onChange = vi.fn();
  const utils = render(
    <StepperInput name="qty" onChange={onChange} {...props} />
  );
  return { ...utils, onChange };
}

describe('StepperInput', () => {
  it('affiche la valeur initiale', () => {
    renderStepper({ value: '3' });
    expect(screen.getByRole('spinbutton')).toHaveValue(3);
  });

  it('incremente la valeur au clic sur +', async () => {
    const user = userEvent.setup();
    const { onChange } = renderStepper({ value: '3', min: 1, max: 10 });
    await user.click(screen.getByRole('button', { name: '+' }));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ target: expect.objectContaining({ value: '4' }) })
    );
  });

  it('decremente la valeur au clic sur -', async () => {
    const user = userEvent.setup();
    const { onChange } = renderStepper({ value: '3', min: 1, max: 10 });
    await user.click(screen.getByRole('button', { name: '−' }));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ target: expect.objectContaining({ value: '2' }) })
    );
  });

  it('ne descend pas en dessous du min', async () => {
    const user = userEvent.setup();
    const { onChange } = renderStepper({ value: '1', min: 1, max: 10 });
    const decrementBtn = screen.getByRole('button', { name: '−' });
    expect(decrementBtn).toBeDisabled();
    await user.click(decrementBtn);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('ne monte pas au dessus du max', async () => {
    const user = userEvent.setup();
    const { onChange } = renderStepper({ value: '10', min: 1, max: 10 });
    const incrementBtn = screen.getByRole('button', { name: '+' });
    expect(incrementBtn).toBeDisabled();
    await user.click(incrementBtn);
    expect(onChange).not.toHaveBeenCalled();
  });
});
