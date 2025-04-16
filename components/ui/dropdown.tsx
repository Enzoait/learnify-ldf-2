import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { useSupabase } from "@/context/supabase-provider";

interface Category {
    created_at: string;
    title: string;
    id: string;
}

export default function Dropdown() {
	const [value, setValue] = useState(null);
	const [categories, setCategories] = useState<Category[]>([]);
	const { getCategories } = useSupabase();

	useEffect(() => {
		async function fetchCategories() {
			const result = await getCategories();
            if (result === undefined) {
                throw new Error("getCategories is not defined");
            }
			if (result?.success && result.data) {
				setCategories(
					result.data
				);
			}
		}
		fetchCategories();
	}, [getCategories]);

	return (
		<View style={styles.container}>
			<RNPickerSelect
				onValueChange={(value) => setValue(value)}
				items={categories.map((category) => ({
                    label: category.title,
                    value: category.id,
                }))}
				placeholder={{ label: "Catégorie", value: null }}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		justifyContent: "center",
	},
});
