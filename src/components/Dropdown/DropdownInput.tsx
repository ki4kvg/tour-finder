import * as React from 'react';
import styles from './DropdownInput.module.scss';
import classNames from 'classnames';
import Input from '@/components/Input/Input.tsx';
import type { InputProps } from '@/types';

type Props = {
  children?: React.ReactNode;
  isShown?: boolean;
} & InputProps;

function DropdownInput(props: Props) {
  const { children, isShown, ...rest } = props;
  return (
    <div className={styles.main_wrapper}>
      <Input {...rest} />
      <div className={classNames(styles.dropdown_wrapper, isShown && styles.visible)}>{children}</div>
    </div>
  );
}

export default DropdownInput;
