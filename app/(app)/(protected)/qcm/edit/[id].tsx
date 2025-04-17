import React, { useEffect, useState } from "react";
import { View, TextInput, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { fetchQuizById, updateQuizInDB, getCategories } from "@/services/supabaseQuizService";
import { ArrowLeft } from "lucide-react-native";
import { useColorScheme } from 'react-native';
import QuestionCard from '@/components/questionCard';

interface Question {
  question: string;
  options: string[];
  correctOptions: number[];
}

interface Category {
  id: number;
  title: string;
}

export default function EditQuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [quiz, setQuiz] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [category, setCategory] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [dropdownHeight] = useState(new Animated.Value(0));
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const result = await fetchQuizById(Number(id));
        if (result) {
          const parsedQuestions =
            typeof result.questions === "string"
              ? JSON.parse(result.questions)
              : result.questions;
          setQuiz(result);
          setTitle(result.title);
          setQuestions(parsedQuestions);
          setCategory(result.categ_id);
        }
      }

      const categoryResult = await getCategories();
      if (categoryResult.data) {
        setCategories(categoryResult.data);
      }
    };

    fetchData();
  }, [id]);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
    Animated.timing(dropdownHeight, {
      toValue: dropdownVisible ? 0 : 200,
      duration: 300,
      useNativeDriver: false,
    }).start();
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

  const handleSave = async () => {
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

    const updatedQuiz = {
      title,
      questions,
      category: category as number,
    };

    const result = await updateQuizInDB(Number(id), updatedQuiz);
    if (result.success) {
      router.back();
    } else {
      alert('Erreur lors de la mise à jour du quiz.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={[styles.container, isDarkMode && { backgroundColor: '#000' }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.content]}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
              <ArrowLeft color={isDarkMode ? '#fff' : '#000'} size={24} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, isDarkMode && { color: '#fff' }]}>Modifier le quiz</Text>
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

          <TouchableOpacity onPress={() => setQuestions([...questions, { question: '', options: ['', '', '', ''], correctOptions: [] }])} style={styles.addQuestionButton}>
            <Text style={styles.addQuestionText}>+ Ajouter une question</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.createButton, isDarkMode && { backgroundColor: '#14532d' }]}
            onPress={handleSave}
          >
            <Text style={styles.createButtonText}>Enregistrer les modifications</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 20, marginTop: 60 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20, position: 'relative' },
  backIcon: { position: 'absolute', left: 0, zIndex: 1 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  label: { fontSize: 16, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#2e2e2e', borderRadius: 8, padding: 10, marginBottom: 16 },
  picker: { height: 50, justifyContent: 'center', paddingLeft: 10, borderWidth: 1, borderColor: '#2e2e2e', borderRadius: 8, marginBottom: 16 },
  pickerTextLight: { fontSize: 16, color: '#333' },
  pickerTextDark: { fontSize: 16, color: '#fff' },
  dropdownContainer: { position: 'absolute', top: 230, left: 20, right: 20, zIndex: 2, backgroundColor: '#fff', borderRadius: 8, elevation: 5 },
  dropdownList: { maxHeight: 200 },
  dropdownItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  dropdownText: { fontSize: 16, color: '#333' },
  questionContainer: { marginBottom: 20 },
  addQuestionButton: { backgroundColor: '#14532d', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  addQuestionText: { color: '#a7f3d0', fontSize: 16, fontWeight: 'bold' },
  createButton: { backgroundColor: '#15803d', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  createButtonText: { color: '#d1fae5', fontSize: 18, fontWeight: 'bold' },
});
