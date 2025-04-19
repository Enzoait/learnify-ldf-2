import { View, ScrollView } from "react-native";

import { router } from "expo-router";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
import Deck from "@/components/deck";
import { useSupabase } from "@/context/supabase-provider";
import { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { BlurView } from "expo-blur";

interface Decks {
	id: string;
	title: string;
	category: string;
	created_at: string;
}

export default function Home() {
	const { getDecks } = useSupabase();

	const [decks, setDecks] = useState<Decks[]>([]);

	useEffect(() => {
		async function fetchDecks() {
			const result = await getDecks();
			if (result?.success && result.data) {
				setDecks(result.data);
			}
		}
		fetchDecks();
	}, [getDecks]);

	return (
		<View className="flex-1 bg-background p-4">
			<View className="h-[50]"></View>
			<H1 className="text-center">Decks</H1>
			<Muted className="text-center mb-2">
				Bienvenue sur la page des decks {"\n"} Ici vous pouvez retrouver vos
				decks et les gerer en cliquant dessus.
			</Muted>

			{/* Ce bouton sert à afficher toutes les cartes, peu importe le deck auxquelles elles appartiennent. Décommentez pour tester. 
			<Button
				className="w-full"
				onPress={() => router.push("/(app)/cardspage")}
			>
				<Text>Toutes les cartes</Text>
			</Button> */}

			<View className="flex-1 w-full">
				<ScrollView
					contentContainerStyle={{ paddingBottom: 16 }}
					showsVerticalScrollIndicator={false}
				>
					{decks.length === 0 ? (
						<Text className="text-center">
							Vous n'avez pas encore créé de decks. {"\n"} Appuyez sur "Créer un
							nouveau deck" pour créer votre 1er deck.
						</Text>
					) : decks.length > 2 ? (
						<>
							{decks.map((deck) => (
								<Deck
									key={deck.id}
									id={deck.id}
									category={deck.category}
									title={deck.title}
								/>
							))}
							<View className="h-[110]"></View>
						</>
					) : (
						decks.map((deck) => (
							<Deck
								key={deck.id}
								id={deck.id}
								category={deck.category}
								title={deck.title}
							/>
						))
					)}
				</ScrollView>
			</View>
			<BlurView intensity={40} tint="light" style={styles.blurContainer}>
				{decks.length > 0 && (
					<Button
						className="w-full"
						onPress={() => router.push("/(app)/modal")}
					>
						<Text>Créer une nouvelle carte</Text>
					</Button>
				)}

				<Button
					className="w-full"
					onPress={() => router.push("/(app)/createdeck")}
				>
					<Text>Créer un nouveau deck</Text>
				</Button>
			</BlurView>
		</View>
	);
}

const styles = StyleSheet.create({
	blurContainer: {
		gap: 8,
		position: "absolute",
		bottom: 16,
		left: 16,
		right: 16,
		padding: 16,
		borderRadius: 12,
		overflow: "hidden",
		backgroundColor: "rgba(255, 255, 255, 0.2)",
	},
});
