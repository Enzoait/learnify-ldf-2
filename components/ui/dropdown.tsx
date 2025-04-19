import React, { useState, useEffect } from "react";
import {
	View,
	StyleSheet,
	Text,
	Animated,
	ScrollView,
	TouchableOpacity,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { useSupabase } from "@/context/supabase-provider";
import { useColorScheme } from "react-native";

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
	const colorScheme = useColorScheme();
	const isDarkMode = colorScheme === "dark";
	const [value, setValue] = useState<string | null>(null);
	const [categories, setCategories] = useState<Category[]>([]);
	const [decks, setDecks] = useState<Decks[]>([]);
	const { getCategories, getDecks } = useSupabase();
	const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
	const [dropdownHeight] = useState(new Animated.Value(0));

	function handleValueChange(selectedId: string | null) {
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

	const toggleDropdown = () => {
		setDropdownVisible(!dropdownVisible);

		Animated.timing(dropdownHeight, {
			toValue: dropdownVisible ? 0 : 200,
			duration: 300,
			useNativeDriver: false,
		}).start();
	};

	return (
		<View style={styles.container}>
			{type === "categorie" ? (
				<>
					<TouchableOpacity
						onPress={toggleDropdown}
						style={[
							styles.picker,
							isDarkMode ? { backgroundColor: "#1a1a1a" } : {},
						]}
					>
						<Text style={isDarkMode ? styles.darkText : styles.lightText}>
							{value !== null
								? categories.find((cat) => cat.id === value)?.title
								: "Sélectionner une catégorie"}
						</Text>
					</TouchableOpacity>
					{dropdownVisible && (
						<Animated.View style={[styles.dropdownContainer]}>
							<ScrollView style={styles.dropdownList}>
								{categories.map((item) => (
									<TouchableOpacity
										key={item.id}
										style={styles.dropdownItem}
										onPress={() => {
											setValue(item.id);
											handleValueChange(item.id);
											toggleDropdown();
										}}
									>
										<Text style={styles.dropdownText}>{item.title}</Text>
									</TouchableOpacity>
								))}
							</ScrollView>
						</Animated.View>
					)}
				</>
			) : (
				<>
					<TouchableOpacity
						onPress={toggleDropdown}
						style={[
							styles.picker,
							isDarkMode ? { backgroundColor: "#1a1a1a" } : {},
						]}
					>
						<Text style={isDarkMode ? styles.darkText : styles.lightText}>
							{value !== null
								? decks.find((deck) => deck.id.toString() === value)?.title
								: "Sélectionner un deck"}
						</Text>
					</TouchableOpacity>
					{dropdownVisible && (
						<Animated.View style={[styles.dropdownContainer]}>
							<ScrollView style={styles.dropdownList}>
								{decks.map((item) => (
									<TouchableOpacity
										key={item.id}
										style={styles.dropdownItem}
										onPress={() => {
											setValue(item.id.toString());
											handleValueChange(item.id.toString());
											toggleDropdown();
										}}
									>
										<Text style={styles.dropdownText}>{item.title}</Text>
									</TouchableOpacity>
								))}
							</ScrollView>
						</Animated.View>
					)}
				</>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	picker: {
		padding: 10,
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 5,
	},
	lightText: {
		color: "#000",
	},
	darkText: {
		color: "#fff",
	},
	container: {
		justifyContent: "center",
	},
	dropdownContainer: {
		backgroundColor: "#fff",
		borderRadius: 5,
		elevation: 5,
		padding: 10,
	},
	dropdownList: {
		maxHeight: 200,
	},
	dropdownItem: {
		padding: 10,
		borderBottomWidth: 1,
		borderBottomColor: "#ccc",
	},
	dropdownText: {
		fontSize: 16,
	},
});
