import React from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useColorScheme } from 'react-native';

interface Question {
  question: string;
  options: string[];
  correctOptions: number[];
}

interface QuestionCardProps {
  index: number;
  question: Question;
  handleSaveQuestion: (index: number, field: keyof Question, value: any) => void;
  handleDeleteQuestion: (index: number) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ index, question, handleSaveQuestion, handleDeleteQuestion }) => {
  const colorScheme = useColorScheme(); // Obtenir le mode clair ou sombre actuel

  const handleOptionChange = (optionIndex: number, value: string) => {
    const updatedOptions = [...question.options];
    updatedOptions[optionIndex] = value;
    handleSaveQuestion(index, 'options', updatedOptions);
  };

  const handleCorrectOptionChange = (optionIndex: number) => {
    const updatedCorrectOptions = question.correctOptions.includes(optionIndex)
      ? question.correctOptions.filter(i => i !== optionIndex)
      : [...question.correctOptions, optionIndex];
    handleSaveQuestion(index, 'correctOptions', updatedCorrectOptions);
  };

  const handleAddOption = () => {
    if (question.options.length < 10) {
      const updatedOptions = [...question.options, ''];
      handleSaveQuestion(index, 'options', updatedOptions);
    }
  };

  const handleRemoveOption = () => {
    if (question.options.length > 2) {
      const updatedOptions = question.options.slice(0, -1);
      handleSaveQuestion(index, 'options', updatedOptions);
    }
  };

  const backgroundColor = colorScheme === 'dark' ? '#1a1a1a' : '#fff';
  const textColor = colorScheme === 'dark' ? '#fff' : '#000';
  const borderColor = colorScheme === 'dark' ? '#333' : '#ccc';
  const buttonBackground = colorScheme === 'dark' ? '#15803d' : '#14532d';
  const buttonTextColor = colorScheme === 'dark' ? '#d1fae5' : '#fff';
  const deleteButtonBackground = colorScheme === 'dark' ? '#991b1b' : '#e11d48';

  return (
    <View style={[styles.card, { backgroundColor }]}>
      <Text style={[styles.cardTitle, { color: textColor }]}>Question {index + 1}</Text>
      <TextInput
        value={question.question}
        onChangeText={(text) => handleSaveQuestion(index, 'question', text)}
        placeholder="Entrez la question"
        placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#666'}
        style={[styles.input, { backgroundColor, color: textColor, borderColor }]}
      />

      {question.options.map((option, optionIndex) => (
        <View key={optionIndex} style={styles.optionContainer}>
          <TextInput
            value={option}
            onChangeText={(text) => handleOptionChange(optionIndex, text)}
            placeholder={`Option ${optionIndex + 1}`}
            placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#666'}
            style={[styles.optionInput, { backgroundColor, color: textColor, borderColor }]}
          />
          <TouchableOpacity
            onPress={() => handleCorrectOptionChange(optionIndex)}
            style={[
              styles.correctOptionButton,
              question.correctOptions.includes(optionIndex)
                ? styles.optionSelected
                : styles.optionUnselected,
            ]}
          >
            <Text style={styles.correctOptionText}>✔</Text>
          </TouchableOpacity>
        </View>
      ))}

      <View style={styles.optionButtonsContainer}>
        <TouchableOpacity onPress={handleRemoveOption} style={[styles.removeButton, { backgroundColor: '#991b1b' }]}>
          <Text style={styles.removeButtonText}>-</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleAddOption} style={[styles.addButton, { backgroundColor: buttonBackground }]}>
          <Text style={[styles.addButtonText, { color: buttonTextColor }]}>+</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => handleDeleteQuestion(index)} style={[styles.deleteButton, { backgroundColor: deleteButtonBackground }]}>
        <Text style={styles.deleteButtonText}>Supprimer cette question</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  optionInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },
  correctOptionButton: {
    padding: 10,
    borderRadius: 8,
  },
  optionSelected: {
    backgroundColor: "#15803d",
  },
  optionUnselected: {
    backgroundColor: "#374151",
  },
  correctOptionText: {
    color: "#fff",
    fontSize: 16,
  },
  optionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  addButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  removeButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  deleteButton: {
    padding: 12,
    marginTop: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default QuestionCard;
