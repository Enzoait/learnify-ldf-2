import { View } from "react-native";

import { router } from "expo-router";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";

import SwipeableCard from "../../../../../components/swipableCard";
import { useSupabase } from "@/context/supabase-provider";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

interface Card {
	id: string;
	category: string;
	question: string;
	answer: string;
	created_at: string;
	deck_id: string;
}

interface Decks {
	id: string;
	title: string;
	category: string;
	created_at: string;
}

export default function CardsPage() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { getCards, getDecks } = useSupabase();
	const [cards, setCards] = useState<Card[]>([]);
	const [decks, setDecks] = useState<Decks[]>([]);

	useEffect(() => {
		async function fetchCards() {
			const resultCards = await getCards();
			if (resultCards?.success && resultCards.data) {
				const filtered = resultCards.data.filter(
					(card) => card.deck_id === Number(id),
				);
				setCards(filtered);
			}
		}
		fetchCards();
	}, [getCards]);

	useEffect(() => {
		async function fetchDecks() {
			const resultDecks = await getDecks();
			if (resultDecks?.success && resultDecks.data) {
				const filtered = resultDecks.data.filter(
					(deck) => deck.id === Number(id),
				);
				setDecks(filtered);
			}
		}
		fetchDecks();
	}, [getDecks]);

	const handleSwipeOff = () => {
		setCards((prev) => prev.slice(1));
	};

	return (
		<View className="flex-1 items-center justify-center bg-background p-4 gap-y-4">
			<TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
				<ArrowLeft color={"gray"} size={24} />
			</TouchableOpacity>
			<H1 className="text-center">Cartes {decks.map((deck) => deck.title)}</H1>
			<Muted className="text-center mb-2">
				Bienvenue sur la page des cartes. {"\n"} Swipez pour les faire défiler.
			</Muted>

			<View className="flex-1 w-full items-center justify-center relative">
				{cards.length === 0 ? (
					<Text className="text-center">
						Vous n'avez pas encore créé de cartes. {"\n"} Appuyez sur le bouton
						ci-dessous pour créer votre 1ère carte.
					</Text>
				) : (
					[...cards]
						.reverse()
						.map((card, index) => (
							<SwipeableCard
								key={card.id}
								card={card}
								onSwipeOff={handleSwipeOff}
							/>
						))
				)}
			</View>

			<Button className="w-full" onPress={() => router.push("/(app)/modal")}>
				<Text>Créer une nouvelle carte</Text>
			</Button>
		</View>
	);
}

const styles = StyleSheet.create({
	backIcon: {
		position: "relative",
		top: 0,
		left: -180,
		padding: 10,
	},
});
