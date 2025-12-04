import * as React from 'react';
import styles from './Button.module.scss';
import classNames from 'classnames';

type Props = {
  children: React.ReactNode;
  color?: 'secondary' | 'primary';
  adornment?: React.ReactNode;
  adornmentPosition?: 'start' | 'end';
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

function Button(props: Props) {
  const { color = 'secondary', ...rest } = props;

  return (
    <button {...rest} className={classNames(styles.button, styles[color])}>
      {props.children}
    </button>
  );
}

export default Button;
