import React from 'react';
import { Modal, View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

type FileSelectionDialogProps = {
  visible: boolean;
  files: string[];
  onSelect: (file: string) => void;
  onCancel: () => void;
  onCreateNew: () => void;
};

const extractFileName = (filePath: string): string => {
  return filePath.split('/').pop() || filePath;
};

const FileSelectionDialog: React.FC<FileSelectionDialogProps> = ({
  visible,
  files,
  onSelect,
  onCancel,
  onCreateNew,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalBackground}>
        <View style={styles.dialogContainer}>
          <Text style={styles.title}>ファイル選択</Text>
          <FlatList
            data={files}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => onSelect(item)}>
                <Text style={styles.fileItem}>{extractFileName(item)}</Text>
              </TouchableOpacity>
            )}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onCreateNew}>
              <Text style={styles.buttonText}>新規作成</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onCancel}>
              <Text style={styles.buttonText}>キャンセル</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dialogContainer: {
    width: width * 0.8,
    maxHeight: height * 0.8,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  fileItem: {
    padding: 8,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    padding: 8,
    backgroundColor: '#007bff',
    borderRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default FileSelectionDialog;
