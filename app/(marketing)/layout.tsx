import styles from "./landing.module.css";

export default function MarketingLayout({ children }: LayoutProps<"/">) {
  return <div className={styles.page}>{children}</div>;
}
