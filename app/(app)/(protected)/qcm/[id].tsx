import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { supabase } from "@/config/supabase";
import { H1, Muted } from "@/components/ui/typography";

interface Quiz {
  id: number;
  title: string;
  questions: string;
  category_id: number;
}

export default function QuizDetails(): JSX.Element {
  const { id } = useLocalSearchParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      fetchQuiz();
    }
  }, [id]);

  const fetchQuiz = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("quizzes")
      .select("*")
      .eq("id", id)
      .single();

    if (!error) {
      setQuiz(data);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  if (!quiz) {
    return (
      <View style={styles.center}>
        <Text>Quiz introuvable.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <H1 style={styles.title}>{quiz.title}</H1>
      <Muted style={styles.subtitle}>ID: {quiz.id}</Muted>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Questions JSON :</Text>
        <Text style={styles.codeBlock}>{quiz.questions}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  codeBlock: {
    fontFamily: "Courier",
    backgroundColor: "#f3f4f6",
    padding: 12,
    borderRadius: 8,
    color: "#1f2937",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
