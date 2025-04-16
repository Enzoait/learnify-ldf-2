import React, { useState, useEffect } from 'react';
import { View, ScrollView, TextInput, Text, StyleSheet, TouchableOpacity, FlatList, Animated, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import QuestionCard from '@/components/questionCard';
import { createQuizInDB, getCategories } from '@/services/supabaseQuizService';
import { ArrowLeft } from "lucide-react-native";
import { useColorScheme } from 'react-native';

interface Question {
  question: string;
  options: string[];
  correctOptions: number[];
}

interface Category {
  id: number;
  title: string;
  created_at: string;
}

export const screenOptions = {
  tabBarStyle: { display: "none" },
};

export default function CreateQuizScreen() {
  const [title, setTitle] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([{ question: '', options: ['', '', '', ''], correctOptions: [] }]);
  const [category, setCategory] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [buttonPressed, setButtonPressed] = useState<boolean>(false);
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [dropdownHeight] = useState(new Animated.Value(0));
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();

  useEffect(() => {
    const fetchCategories = async () => {
      const result = await getCategories();
      if (result.success && result.data) {
        setCategories(result.data);
      } else {
        alert(result.message);
      }
    };
    fetchCategories();
  }, []);

  const handleCreateQuestion = () => {
    setQuestions([
      ...questions,
      { question: '', options: ['', '', '', ''], correctOptions: [] },
    ]);
  };

  const handleSaveQuestion = (index: number, field: keyof Question, value: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleDeleteQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      alert('Le titre du quiz ne peut pas être vide.');
      return;
    }

    for (const question of questions) {
      if (!question.question.trim() || question.options.some(option => !option.trim())) {
        alert('Veuillez remplir toutes les questions et options.');
        return;
      }
    }

    if (!category) {
      alert('Veuillez choisir une catégorie.');
      return;
    }
    console.log(category)

    const quizData = {
      title,
      questions,
      category: category as number,
    };

    const result = await createQuizInDB(quizData);
    if (result.success) {
      router.back();
    } else {
      alert('Erreur lors de la création du quiz.');
    }
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);

    Animated.timing(dropdownHeight, {
      toValue: dropdownVisible ? 0 : 200,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const isDarkMode = colorScheme === 'dark';

  return (
    <ScrollView style={[styles.container, isDarkMode && { backgroundColor: '#000' }]} contentContainerStyle={{ paddingBottom: insets.bottom }}>
      <View style={[styles.content, { marginTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
            <ArrowLeft color={isDarkMode ? '#fff' : '#000'} size={24} />
          </TouchableOpacity>
          <View style={styles.headerSpacer} />
          <Text style={[styles.headerTitle, isDarkMode && { color: '#fff' }]}>Créer un nouveau quiz</Text>
          <View style={styles.headerSpacer} />
        </View>

        <Text style={[styles.label, isDarkMode && { color: '#fff' }]}>Nom du quiz</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Ex: Histoire, JavaScript..."
          placeholderTextColor={isDarkMode ? '#aaa' : '#666'}
          style={[styles.input, isDarkMode && { backgroundColor: '#1a1a1a', color: '#fff' }]}
        />

        <Text style={[styles.label, isDarkMode && { color: '#fff' }]}>Catégorie</Text>

        <TouchableOpacity
          onPress={toggleDropdown}
          style={[styles.picker, isDarkMode && { backgroundColor: '#1a1a1a' }]}
        >
          <Text style={isDarkMode ? styles.pickerTextDark : styles.pickerTextLight}>
            {category !== null ? categories.find(cat => cat.id === category)?.title : 'Sélectionner une catégorie'}
          </Text>
        </TouchableOpacity>

        {dropdownVisible && (
          <Animated.View style={[styles.dropdownContainer]}>
            <ScrollView style={styles.dropdownList}>
              {categories.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setCategory(item.id);
                    toggleDropdown();
                  }}
                >
                  <Text style={styles.dropdownText}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        )}

        <Text style={[styles.label, isDarkMode && { color: '#fff' }]}>Questions</Text>

        {questions.map((question, index) => (
          <View key={index} style={styles.questionContainer}>
            <QuestionCard
              index={index}
              question={question}
              handleSaveQuestion={handleSaveQuestion}
              handleDeleteQuestion={handleDeleteQuestion}
            />
          </View>
        ))}

        <TouchableOpacity onPress={handleCreateQuestion} style={styles.addQuestionButton}>
          <Text style={styles.addQuestionText}>+ Ajouter une question</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.createButton, buttonPressed ? styles.buttonPressed : {}, isDarkMode && { backgroundColor: '#14532d' }]}
          onPress={() => {
            setButtonPressed(true);
            handleCreate();
          }}
        >
          <Text style={styles.createButtonText}>Créer le quiz</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    marginTop: 10,
    position: "relative",
  },
  backIcon: {
    position: "absolute",
    left: 0,
    zIndex: 1,
  },
  headerSpacer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#2e2e2e",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  picker: {
    height: 50,
    justifyContent: 'center',
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: '#2e2e2e',
    borderRadius: 8,
    marginBottom: 16,
  },
  pickerTextLight: {
    fontSize: 16,
    color: '#333',
  },
  pickerTextDark: {
    fontSize: 16,
    color: '#fff',
  },
  dropdownContainer: {
    position: 'absolute',
    top: 230,
    left: 20,
    right: 20,
    zIndex: 2,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  dropdownList: {
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  questionContainer: {
    marginBottom: 20,
  },
  addQuestionButton: {
    backgroundColor: "#14532d",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  addQuestionText: {
    color: "#a7f3d0",
    fontSize: 16,
    fontWeight: "bold",
  },
  createButton: {
    backgroundColor: "#15803d",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonPressed: {
    backgroundColor: "#166534",
  },
  createButtonText: {
    color: "#d1fae5",
    fontSize: 18,
    fontWeight: "bold",
  },
});
