import * as React from 'react';
import styles from './Input.module.scss';
import classNames from 'classnames';
import { CrossIcon } from '@/assets';
import type { InputProps } from '@/types';

const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { disabled = false, value = '', error, helperText, handleClear, ...rest } = props;

  const handleClearValue = (event: React.MouseEvent<SVGSVGElement>) => {
    event.stopPropagation();
    handleClear?.();
  };

  return (
    <div className={styles.input_wrapper}>
      <input
        {...rest}
        ref={ref}
        disabled={disabled}
        type="text"
        value={value}
        className={classNames(styles.input, disabled && styles.disabled, error && styles.error)}
      />
      {value && (
        <div className={styles.adornment}>
          <CrossIcon onClick={handleClearValue} />
        </div>
      )}
      {error && <p className={styles.errorText}>{helperText}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
