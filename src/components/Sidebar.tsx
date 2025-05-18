import { ChangeEvent } from 'react';
import styles from './Sidebar.module.css';

interface SidebarProps {
  onInputChange: (text: string) => void;
}

const Sidebar = ({ onInputChange }: SidebarProps) => {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onInputChange(e.target.value);
  };

  return (
    <div className={styles.sidebar}>
      <h2 className={styles.title}>Введите текст</h2>
      <p className={styles.description}>Каждая строка будет преобразована в отдельную ноду</p>
      <textarea 
        className={styles.textarea}
        onChange={handleChange}
        placeholder="Введите текст, каждая строка будет отдельной нодой"
      />
    </div>
  );
};

export default Sidebar;
