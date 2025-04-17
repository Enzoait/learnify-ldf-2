import { View } from "react-native";

import { router } from "expo-router";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";

export default function Home() {

	const decks : string[] = [];

	return (
		<View className="flex-1 items-center justify-center bg-background p-4 gap-y-4">
			<H1 className="text-center">Decks</H1>
			<Muted className="text-center mb-2">
				Bienvenue sur la page des decks {"\n"} Ici vous pouvez retrouver vos
				decks et les gerer en cliquant dessus.
			</Muted>

			<Button
				className="w-full"
				onPress={() => router.push("/(app)/cardspage")}
			>
				<Text>Toutes les cartes</Text>
			</Button>

			<View className="flex-1 w-full items-center justify-center relative">
				{decks.length === 0 ? (
					<Text className="text-center">
						Vous n'avez pas encore créé de decks. {"\n"} Appuyez sur "Créer un nouveau deck" pour créer votre 1er deck.
					</Text>
				) : (
					<Text className="text-center">
						Vous n'avez pas encore créé de decks. {"\n"} Appuyez sur le bouton
						ci-dessous pour créer votre 1ère carte.
					</Text>
				)}
			</View>

			<Button className="w-full" onPress={() => router.push("/(app)/modal")}>
				<Text>Créer une nouvelle carte</Text>
			</Button>
			<Button
				className="w-full"
				onPress={() => router.push("/(app)/createdeck")}
			>
				<Text>Créer un nouveau deck</Text>
			</Button>
		</View>
	);
}
