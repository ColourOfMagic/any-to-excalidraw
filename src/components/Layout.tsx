import { useState } from 'react';
import Sidebar from './Sidebar';
import ExcalidrawWrapper from './ExcalidrawWrapper';
import styles from './Layout.module.css';

const Layout = () => {
  const [inputText, setInputText] = useState<string>('');

  const handleInputChange = (text: string) => {
    setInputText(text);
  };

  return (
    <div className={styles.container}>
      <Sidebar onInputChange={handleInputChange} />
      <ExcalidrawWrapper inputText={inputText} />
    </div>
  );
};

export default Layout;
