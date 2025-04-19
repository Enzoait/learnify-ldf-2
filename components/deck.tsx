import { View, StyleSheet, Text, Pressable, Alert } from "react-native";

import { cardColors } from "@/constants/cardColors";
import { H3 } from "@/components/ui/typography";
import { useColorScheme } from "@/lib/useColorScheme";
import { useRouter } from "expo-router";
import { Image } from "react-native";
import { useSupabase } from "@/context/supabase-provider";

export default function Deck({
	id,
	category,
	title,
}: {
	id: string;
	category: string;
	title: string;
}) {
    const { deleteDecks } = useSupabase();
	const colorScheme = useColorScheme();
	const router = useRouter();

	const createTwoButtonAlert = () =>
		Alert.alert(
			`Supprimer ${title} ?`,
			`Êtes vous sûr de vouloir supprimer ${title} ?`,
			[
				{
					text: "Cancel",
					onPress: () => console.log("Cancel Pressed"),
					style: "cancel",
				},
				{ text: "OK", onPress: () => {handleDelete(id)} },
			],
		);

    async function handleDelete(id: string) {
        try {
            await deleteDecks(parseInt(id));
            router.push(`/(app)/(protected)/deck/`);
        } catch (error: Error | any) {
            console.log(error.message);
        }
    }

	return (
		<View style={{ width: "100%", height: 225, marginBottom: 16 }}>
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
					<Pressable
						style={styles.pressablePen}
						onPress={() => {
							console.log("Edit icon pressed");
							router.push(`/(app)/(protected)/deck/${id}`);
						}}
					>
						<Image
							source={require("../assets/pen.png")}
							style={styles.iconPen}
						/>
					</Pressable>
					<Pressable
						style={styles.pressableTrash}
						onPress={() => {
							console.log("Trash icon pressed");
                            createTwoButtonAlert();
						}}
					>
						<Image
							source={require("../assets/trash.png")}
							style={styles.iconTrash}
						/>
					</Pressable>
					<H3 style={styles.category}>{category}</H3>
					<Text style={styles.question}>{title}</Text>
					<Pressable
						onPress={() => {
							router.push(`/(app)/(protected)/deck/card/${id}`);
						}}
					>
						<Text>Ouvrir le deck</Text>
					</Pressable>
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
	pressablePen: {
		position: "absolute",
		top: 22.5,
		left: 310,
		right: 0,
		bottom: 0,
		justifyContent: "center",
		alignItems: "center",
		width: 25,
		height: 25,
	},
	pressableTrash: {
		position: "absolute",
		top: 2,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: "center",
		alignItems: "center",
		width: 25,
		height: 25,
	},
	iconPen: {
		width: 25,
		height: 25,
	},
	iconTrash: {
		position: "absolute",
		top: 20,
		left: 340,
		right: 0,
		bottom: 0,
		justifyContent: "center",
		alignItems: "center",
		width: 25,
		height: 25,
	},
});
