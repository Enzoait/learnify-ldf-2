import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { useSupabase } from "@/context/supabase-provider";

interface Category {
	created_at: string;
	title: string;
	id: string;
}

interface Decks {
	id: number;
	title: string;
	category: string;
	created_at: string;
}

export default function Dropdown({
	sendValue,
	type,
}: {
	sendValue: (value: any) => void;
	type: string;
}) {
	const [value, setValue] = useState<string | null>(null);
	const [categories, setCategories] = useState<Category[]>([]);
	const [decks, setDecks] = useState<Decks[]>([]);
	const { getCategories, getDecks } = useSupabase();

	function handleValueChange(selectedId: string | null ) {
		setValue(selectedId);
		if (selectedId === null) {
			sendValue("");
			return;
		}
		const selectedItem =
			type == "categorie"
				? categories.find((c) => c.id === selectedId)
				: decks.find((d) => d.id === parseInt(selectedId));
		const valueToSend =
			type == "categorie"
				? (selectedItem?.title ?? "")
				: (selectedItem?.id ?? "");

		sendValue(valueToSend);
	}

	useEffect(() => {
		async function fetchCategories() {
			const result = await getCategories();
			if (result === undefined) {
				throw new Error("getCategories is not defined");
			}
			if (result?.success && result.data) {
				setCategories(result.data);
			}
		}
		fetchCategories();
	}, [getCategories]);

	useEffect(() => {
		async function fetchDecks() {
			const result = await getDecks();
			if (result === undefined) {
				throw new Error("getDecks is not defined");
			}
			if (result?.success && result.data) {
				setDecks(result.data);
			}
		}
		fetchDecks();
	}, [getDecks]);

	return (
		<View style={styles.container}>
			{type === "categorie" ? (
				<RNPickerSelect
					onValueChange={(value) => handleValueChange(value)}
					items={categories.map((category) => ({
						label: category.title,
						value: category.id,
					}))}
					placeholder={{ label: "Catégorie", value: null }}
				/>
			) : (
				<RNPickerSelect
					onValueChange={(value) => handleValueChange(value)}
					items={decks.map((deck) => ({
						label: deck.title,
						value: deck.id,
					}))}
					placeholder={{ label: "Deck", value: null }}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		justifyContent: "center",
	},
});
