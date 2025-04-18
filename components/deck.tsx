import { View, StyleSheet, Text } from "react-native";

import { cardColors } from "@/constants/cardColors";
import { H3 } from "@/components/ui/typography";
import { useColorScheme } from "@/lib/useColorScheme";
import { useRouter } from "expo-router";

export default function Deck({
    id,
    category,
    title,
}: {
    id: string;
    category: string;
    title: string;
}) {
    const colorScheme = useColorScheme();
    const router = useRouter();

    function handleCardClick() {
        router.push(`/(app)/(protected)/deck/card/${id}`);
    }

    return (
        <View
            style={{ width: "100%", height: 225, marginBottom: 16 }}
            onTouchEnd={() => {
            handleCardClick();
            }}
        >
            <View style={styles.cardContainer}>
            <View
                style={[
                styles.card,
                {
                    backgroundColor:
                    colorScheme.colorScheme === "dark"
                        ? cardColors.dark[
                          category?.replaceAll(
                              " ",
                              "",
                          ) as keyof typeof cardColors.dark
                          ]
                        : cardColors.light[
                          category?.replaceAll(
                              " ",
                              "",
                          ) as keyof typeof cardColors.light
                          ],
                },
                ]}
            >
                <H3 style={styles.category}>{category}</H3>
                <Text style={styles.question}>{title}</Text>
            </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        width: "100%",
        height: "100%",
        position: "relative",
    },
    card: {
        gap: 32,
        alignItems: "center",
        borderRadius: 8,
        padding: 32,
        width: "100%",
        height: "100%",
        justifyContent: "center",
    },
    category: {
        fontSize: 26,
        fontWeight: "bold",
    },
    question: {
        fontSize: 20,
        textAlign: "center",
    },
    button: {
        backgroundColor: "rgba(0, 0, 0, 0.1)",
    },
    buttonText: {
        fontSize: 18,
        fontStyle: "italic",
    },
});
