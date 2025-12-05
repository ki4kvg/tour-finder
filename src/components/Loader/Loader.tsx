import styles from './Loader.module.scss';

type Props = {
  text?: string;
  size?: number;
};

function Loader(props: Props) {
  return (
    <div className={styles.loader_container}>
      <div style={{ width: `${props.size}px`, height: `${props.size}px` }} className={styles.loader_spinner} />
      <p className={styles.text}>{props.text}</p>
    </div>
  );
}

export default Loader;
