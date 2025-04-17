import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  SafeAreaView,
  Pressable,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { fetchQuizById, saveQuizStats } from "@/services/supabaseQuizService";
import { Ionicons } from "@expo/vector-icons";

interface Question {
  question: string;
  options: string[];
  correctOptions: number[];
}

interface Quiz {
  id: number;
  title: string;
  questions: Question[];
}

export default function QuizInteractivePage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: number[] }>({});
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      fetchQuiz();
    }
  }, [id]);

  const fetchQuiz = async () => {
    try {
      const quizData = await fetchQuizById(Number(id));
      const parsedQuestions =
        typeof quizData.questions === "string"
          ? JSON.parse(quizData.questions)
          : quizData.questions;

      setQuiz({
        ...quizData,
        questions: parsedQuestions,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération du quiz:", error);
    }
  };

  const toggleOption = (questionIndex: number, optionIndex: number, multi: boolean) => {
    setAnswers((prev) => {
      const current = prev[questionIndex] || [];
      if (multi) {
        return {
          ...prev,
          [questionIndex]: current.includes(optionIndex)
            ? current.filter((i) => i !== optionIndex)
            : [...current, optionIndex],
        };
      } else {
        return {
          ...prev,
          [questionIndex]: [optionIndex],
        };
      }
    });
  };

  const handleSubmit = async () => {
    let correctAnswers = 0;

    if (Array.isArray(quiz?.questions)) {
      quiz.questions.forEach((question, index) => {
        const selected = answers[index] || [];
        const correct = question.correctOptions;

        const allCorrectSelected =
          correct.length === selected.length &&
          selected.every((opt) => correct.includes(opt));

        if (allCorrectSelected) {
          correctAnswers++;
        }
      });

      setScore(correctAnswers);
      await saveQuizStats(Number(id), correctAnswers, quiz.questions.length);

      setTimeout(() => {
        router.back();
      }, 100);
    }
  };

  const isDark = colorScheme === "dark";
  const bgColor = isDark ? "#121212" : "#f9f9f9";
  const textColor = isDark ? "#fff" : "#000";
  const cardBg = isDark ? "#1e1e1e" : "#fff";
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = quiz?.questions?.length || 0;

  if (!quiz) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.center]}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgColor }]}>
      <View style={styles.headerContainer}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={26} color={textColor} />
        </Pressable>
        <View style={styles.headerTextBlock}>
          <Text style={[styles.headerTitle, { color: textColor }]}>{quiz.title}</Text>
          <Text style={[styles.progressText, { color: isDark ? "#ccc" : "#666" }]}>
            Progression : {answeredCount} / {totalQuestions}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {quiz.questions.map((question, qIndex) => {
          const multi = question.correctOptions.length > 1;
          const selectedOptions = answers[qIndex] || [];

          return (
            <View key={qIndex} style={[styles.questionCard, { backgroundColor: cardBg }]}>
              <Text style={[styles.questionText, { color: textColor }]}>
                {qIndex + 1}. {question.question}
              </Text>
              {multi && (
                <Text style={[styles.multiNote, { color: isDark ? "#ccc" : "#666" }]}>
                  Plusieurs réponses possibles
                </Text>
              )}
              {question.options.map((option, oIndex) => {
                const selected = selectedOptions.includes(oIndex);
                return (
                  <Pressable
                    key={oIndex}
                    onPress={() => toggleOption(qIndex, oIndex, multi)}
                    style={[
                      styles.optionButton,
                      {
                        backgroundColor: selected ? "#2ecc71" : isDark ? "#2a2a2a" : "#f1f1f1",
                        borderColor: selected ? "#27ae60" : "#ddd",
                      },
                    ]}
                  >
                    <Text style={{ color: selected ? "#fff" : textColor }}>{option}</Text>
                  </Pressable>
                );
              })}
            </View>
          );
        })}

        <Pressable style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>✅ Soumettre</Text>
        </Pressable>

        {score !== null && (
          <Text style={[styles.scoreText, { color: "#27ae60" }]}>
            🎉 Score final : {score} / {quiz.questions.length}
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: "#333",
  },
  backButton: {
    padding: 6,
    marginRight: 12,
  },
  headerTextBlock: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  progressText: {
    fontSize: 14,
    marginTop: 4,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 60,
  },
  questionCard: {
    width: "100%",
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  multiNote: {
    fontSize: 12,
    marginBottom: 6,
    fontStyle: "italic",
  },
  optionButton: {
    padding: 14,
    marginVertical: 6,
    borderRadius: 10,
    borderWidth: 1.2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  submitButton: {
    backgroundColor: "#2ecc71",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  submitText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
  scoreText: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 30,
    textAlign: "center",
  },
  loadingText: {
    color: "#888",
    fontSize: 18,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
});
