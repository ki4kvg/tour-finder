import * as React from 'react';
import styles from './IconLabel.module.scss';
import classNames from 'classnames';

type Props = {
  icon?: React.ReactNode;
  label?: string;
  iconPosition?: 'start' | 'end';
  onClick?: () => void;
};

function IconLabel(props: Props) {
  const { icon, label, iconPosition = 'start', onClick, ...rest } = props;

  const handleClick = () => {
    if (!label) return;
    onClick?.();
  };
  return (
    <div {...rest} onClick={handleClick} className={classNames(styles.icon_label_wrapper, styles[iconPosition])}>
      {icon}
      {label}
    </div>
  );
}

export default IconLabel;
