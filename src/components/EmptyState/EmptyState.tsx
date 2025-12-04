import styles from './EmptyState.module.scss';

type Props = {
  text: string;
};

function EmptyState(props: Props) {
  return <div className={styles.wrapper}>{props.text}</div>;
}

export default EmptyState;
