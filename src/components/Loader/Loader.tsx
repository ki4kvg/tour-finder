import styles from './Loader.module.scss';

type Props = {
  text?: string;
};

function Loader(props: Props) {
  return (
    <div className={styles.loader_container}>
      <div className={styles.loader_spinner} />
      <p className={styles.text}>{props.text}</p>
    </div>
  );
}

export default Loader;
