import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Dimensions,
} from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { H1 } from "@/components/ui/typography";
import { getUserQuizzesWithCategories } from "@/services/supabaseQuizService";
import { Image } from "@/components/image";

interface Quiz {
  id: number;
  title: string;
  questions: { options: string[] }[];
  category_id: number;
  Categories: {
    id: number;
    title: string;
  };
}

export default function QCM(): JSX.Element {
  const [quizzesByCategory, setQuizzesByCategory] = useState<{
    [key: string]: Quiz[];
  }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const fetchData = async () => {
      const result = await getUserQuizzesWithCategories();
      if (result.success) {
        const grouped: { [key: string]: Quiz[] } = {};
        result?.data?.forEach((quiz: Quiz) => {
          const category = quiz.Categories?.title || "Sans catégorie";
          if (!grouped[category]) grouped[category] = [];
          grouped[category].push(quiz);
        });
        setQuizzesByCategory(grouped);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  interface Question {
    question: string;
    options: string[];
    correctOptions: number[];
  }

  const getTotalOptions = (questions: Question[] | undefined): number => {
    console.log(typeof questions);
    questions = jsondecode(questions);
    if (!Array.isArray(questions)) return 0;
    return questions.reduce((sum, q) => sum + (q.options?.length || 0), 0);
  };



  const renderQuizCard = (quiz: Quiz): JSX.Element => (
    <Animated.View
      entering={FadeInRight}
      style={styles.cardWrapper}
      key={quiz.id}
    >
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`/qcm/${quiz.id}`)}
      >
        <Text style={styles.cardTitle}>{quiz.title}</Text>
        <Text style={styles.cardMeta}>
          {getTotalOptions(quiz.questions)} options
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => router.push("/qcm/create")}
        style={[styles.floatingButton, { top: insets.top + 16 }]}
      >
        <Image source={require("@/assets/adQuiz.png")} style={styles.icon} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <H1 style={styles.title}>Mes Quiz</H1>
        {loading ? (
          <Text style={styles.loading}>Chargement...</Text>
        ) : (
          Object.entries(quizzesByCategory).map(([category, quizzes]) => (
            <View key={category} style={styles.section}>
              <Text style={styles.sectionTitle}>{category}</Text>
              <FlatList
                data={quizzes}
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
  scrollContent: {
    padding: 16,
    paddingTop: 80,
  },
  floatingButton: {
    position: "absolute",
    right: 16,
    backgroundColor: "#6366F1",
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
  cardWrapper: {
    marginRight: 12,
  },
  card: {
    backgroundColor: "#E0E7FF",
    padding: 16,
    borderRadius: 20,
    minWidth: width * 0.65,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
    color: "#1e40af",
  },
  cardMeta: {
    fontSize: 14,
    color: "#475569",
  },
});
