import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Dimensions,
  useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { H1 } from "@/components/ui/typography";
import { getUserQuizzesWithCategories, updateQuizInDB, deleteQuizFromDB } from "@/services/supabaseQuizService";
import { Image } from "@/components/image";
import { useFocusEffect } from "@react-navigation/native";
import { QuizCard } from "@/components/quizCard";

interface Question {
  question: string;
  options: string[];
  correctOptions: number[];
}

interface Quiz {
  id: number;
  title: string;
  questions: Question[];
  categ_id: number;
  Categories: {
    id: number;
    title: string;
  };
  userStats?: {
    progress: number;
    tryNumber: number;
    lastTried: string | null;
  };
}

export default function QCM(): JSX.Element {
  const [quizzesByCategory, setQuizzesByCategory] = useState<{ [key: string]: Quiz[] }>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const fetchData = useCallback(async () => {
    setLoading(true);
    const result = await getUserQuizzesWithCategories();
    if (result.success && Array.isArray(result.data)) {
      const grouped: { [key: string]: Quiz[] } = {};
      result.data.forEach((rawQuiz: any) => {
        const categoryTitle = rawQuiz.Categories?.title || "Sans catégorie";
        const quiz: Quiz = {
          id: rawQuiz.id,
          title: rawQuiz.title,
          categ_id: rawQuiz.categ_id,
          questions: typeof rawQuiz.questions === "string"
            ? JSON.parse(rawQuiz.questions)
            : rawQuiz.questions || [],
          Categories: rawQuiz.Categories || { id: 0, title: "Sans catégorie" },
          userStats: rawQuiz.userStats,
        };
        if (!grouped[categoryTitle]) grouped[categoryTitle] = [];
        grouped[categoryTitle].push(quiz);
      });
      setQuizzesByCategory(grouped);
    }
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const getTotalQuestions = (questions: Question[]): number => {
    if (!Array.isArray(questions)) return 0;
    return questions.length;
  };

  const handleDelete = async (quizId: number) => {
    await deleteQuizFromDB(quizId);
    fetchData();
  };

  const renderQuizCard = (quiz: Quiz): JSX.Element => {
    const questionCount = getTotalQuestions(quiz.questions);
    const progress = quiz?.userStats?.progress || 0;
    const tryNumber = quiz?.userStats?.tryNumber || 0;
    const lastTried = quiz?.userStats?.lastTried;
    return (
      <QuizCard
        key={quiz.id}
        id={quiz.id}
        title={quiz.title}
        questionCount={questionCount}
        progress={progress}
        tryNumber={tryNumber}
        lastTried={lastTried}
        onDelete={() => handleDelete(quiz.id)}
        onEdit={() => router.push(`/qcm/edit/${quiz.id}`)}
      />
    );
  };

  const categories = Object.keys(quizzesByCategory);
  const displayedCategories = selectedCategory ? [selectedCategory] : categories;

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <TouchableOpacity
        onPress={() => router.push("/qcm/create")}
        style={[styles.floatingButton, { top: insets.top + 16 }]}
      >
        <Image source={require("@/assets/adQuiz.png")} style={styles.icon} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <H1 style={styles.title}>Mes Quiz</H1>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          <TouchableOpacity onPress={() => setSelectedCategory(null)} style={styles.categoryButton}>
            <Text style={styles.categoryButtonText}>Toutes</Text>
          </TouchableOpacity>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive,
              ]}
            >
              <Text style={styles.categoryButtonText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {loading ? (
          <Text style={styles.loading}>Chargement...</Text>
        ) : (
          displayedCategories.map((category) => (
            <View key={category} style={styles.section}>
              <Text style={[styles.sectionTitle, isDark && styles.cardTitleDark]}>{category}</Text>
              <FlatList
                data={quizzesByCategory[category] || []}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => renderQuizCard(item)}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 4 }}
              />
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  containerDark: {
    backgroundColor: "#0f172a",
  },
  scrollContent: {
    padding: 16,
    paddingTop: 80,
  },
  floatingButton: {
    position: "absolute",
    right: 16,
    backgroundColor: "#22c55e",
    borderRadius: 9999,
    padding: 10,
    zIndex: 10,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: "white",
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 26,
    fontWeight: "bold",
  },
  loading: {
    textAlign: "center",
    marginTop: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#1f2937",
  },
  cardTitleDark: {
    color: "#93c5fd",
  },
  categoryScroll: {
    flexDirection: "row",
    marginBottom: 16,
  },
  categoryButton: {
    backgroundColor: "#E0E7FF",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 9999,
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: "#22c55e",
  },
  categoryButtonText: {
    color: "#1e293b",
    fontWeight: "600",
  },
});
