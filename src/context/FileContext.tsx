import React, { createContext, useState, useContext, ReactNode } from 'react';

interface FileContextType {
  filePath: string | null;
  setFilePath: (path: string) => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

interface FileProviderProps {
  children: ReactNode; // 型定義を追加
}

export const FileProvider: React.FC<FileProviderProps> = ({ children }) => {
  const [filePath, setFilePath] = useState<string | null>(null);

  return (
    <FileContext.Provider value={{ filePath, setFilePath }}>
      {children}
    </FileContext.Provider>
  );
};

export const useFileContext = (): FileContextType => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error('useFileContext must be used within a FileProvider');
  }
  return context;
};
