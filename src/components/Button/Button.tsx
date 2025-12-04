import * as React from 'react';
import styles from './Button.module.scss';
import classNames from 'classnames';

type Props = {
  children: React.ReactNode;
  color?: 'secondary' | 'primary';
  adornment?: React.ReactNode;
  adornmentPosition?: 'start' | 'end';
  disabled?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

function Button(props: Props) {
  const { color = 'secondary', disabled = false, ...rest } = props;

  return (
    <button
      {...rest}
      disabled={disabled}
      className={classNames(styles.button, styles[color], disabled && styles.disabled)}
    >
      {props.children}
    </button>
  );
}

export default Button;
