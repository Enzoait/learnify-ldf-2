import React from "react";
import { Text, TouchableOpacity, StyleSheet, useColorScheme, Dimensions, View } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";
import { useRouter } from "expo-router";
import Svg, { Circle } from "react-native-svg";

interface QuizCardProps {
  id: number;
  title: string;
  questionCount: number;
  progress?: number;
  tryNumber?: number;
  lastTried?: string | null;
  onEdit?: () => void;
  onDelete?: () => void;
}

const { width } = Dimensions.get("window");

export const QuizCard: React.FC<QuizCardProps> = ({
  id,
  title,
  questionCount,
  progress = 0,
  tryNumber,
  lastTried,
  onEdit,
  onDelete,
}) => {
  const isDark = useColorScheme() === "dark";
  const router = useRouter();

  const radius = 28;
  const strokeWidth = 6;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View style={styles.cardWrapper}>
      <Animated.View entering={FadeInRight}>
        <TouchableOpacity
          style={[
            styles.card,
            isDark ? styles.cardDark : styles.cardLight,
            styles.cardBorder,
            styles.cardShadow,
          ]}
          onPress={() => router.push(`/qcm/${id}`)}
        >
          <View style={styles.cardContent}>
            <View style={styles.cardTextWrapper}>
              <Text style={[styles.cardTitle, isDark ? styles.textDark : styles.textLight]} numberOfLines={2}>
                {title}
              </Text>
              <Text style={[styles.cardMeta, isDark ? styles.textDark : styles.textLight]}>
                {questionCount} questions
              </Text>
              <Text style={[styles.cardMeta, isDark ? styles.textDark : styles.textLight]}>
                {tryNumber ?? 0} essai{(tryNumber ?? 0) > 1 ? "s" : ""}
              </Text>
              <Text style={[styles.cardMeta, isDark ? styles.textDark : styles.textLight]}>
                {lastTried ? `Dernier essai : ${new Date(lastTried).toLocaleDateString()}` : "Jamais essayé"}
              </Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity onPress={onEdit} style={styles.editButton}>
                  <Text style={styles.buttonText}>Modifier</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
                  <Text style={styles.buttonText}>Supprimer</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.progressWrapper}>
              <Svg height={radius * 2} width={radius * 2}>
                <Circle
                  stroke="#e5e7eb"
                  fill="none"
                  cx={radius}
                  cy={radius}
                  r={normalizedRadius}
                  strokeWidth={strokeWidth}
                />
                <Circle
                  stroke="#22c55e"
                  fill="none"
                  cx={radius}
                  cy={radius}
                  r={normalizedRadius}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${circumference} ${circumference}`}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  rotation="-90"
                  origin={`${radius}, ${radius}`}
                />
              </Svg>
              <Text style={styles.progressText}>{Math.round(progress)}%</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    marginRight: 12,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    minWidth: width * 0.5,
    maxWidth: width * 0.5,
    height: 180,
    justifyContent: "center",
  },
  cardLight: {
    backgroundColor: "#ffffff",
  },
  cardDark: {
    backgroundColor: "#0f172a",
  },
  cardBorder: {
    borderWidth: 2,
    borderColor: "#22c55e",
  },
  cardShadow: {
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTextWrapper: {
    flex: 1,
    paddingRight: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  cardMeta: {
    fontSize: 12,
    marginBottom: 2,
  },
  textLight: {
    color: "#111827",
  },
  textDark: {
    color: "#f8fafc",
  },
  progressWrapper: {
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  progressText: {
    position: "absolute",
    fontSize: 12,
    fontWeight: "bold",
    color: "#22c55e",
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 8,
    gap: 8,
  },
  editButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  deleteButton: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});
