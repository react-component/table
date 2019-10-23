import { useState, AllHTMLAttributes } from 'react';

export function useCheckbox(
  defaultChecked: boolean = false,
): [boolean, AllHTMLAttributes<HTMLInputElement>] {
  const [checked, setChecked] = useState(defaultChecked);

  return [
    checked,
    {
      type: 'checkbox',
      checked,
      onChange() {
        setChecked(!checked);
      },
    },
  ];
}
