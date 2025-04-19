import { View, TextInput, Text, ActivityIndicator } from "react-native";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

import { H1, Muted } from "@/components/ui/typography";
import { StyleSheet } from "react-native";
import { useSupabase } from "@/context/supabase-provider";
import { Form, FormField, FormInput } from "@/components/ui/form";
import { useState } from "react";
import { useColorScheme } from "@/lib/useColorScheme";
import { TouchableOpacity } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";

const formSchema = z.object({
	title: z.string().nonempty("This field is required"),
});

interface Decks {
	id: string;
	title: string;
	category: string;
	created_at: string;
}

export default function CreateDeck() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();
	const colorScheme = useColorScheme();
	const { updateDecks, getDecks } = useSupabase();
	const [decks, setDecks] = useState<Decks[]>([]);

	const [category, setCategory] = useState(null);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
		},
	});

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

	async function onSubmit(data: z.infer<typeof formSchema>) {
		try {
			await updateDecks(parseInt(decks[0]?.id), data.title);

			form.reset();
		} catch (error: Error | any) {
			console.log(error.message);
		}
	}

	return (
		<View className="flex flex-1 justify-center bg-background p-4 gap-y-4">
			<TouchableOpacity onPress={() => router.back()}>
				<ArrowLeft color={"gray"} size={24} />
			</TouchableOpacity>
			<H1 className="text-center">
				Modification du deck "{decks.map((deck) => deck.title)}"
			</H1>
			<Muted className="text-center">
				Bienvenue dans l'outil de modification de decks. Ici, vous pouvez
				modifier les informations du deck sélectionné. Une fois les
				modifications effectuées, vous pouvez les enregistrer en appuyant sur le
				bouton "Enregister les changements".
			</Muted>
			<View className="flex flex-1 gap-4">
				<Form {...form}>
					<View className="gap-4">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormInput
									label="Titre"
									placeholder={decks[0]?.title}
									autoCapitalize="none"
									autoCorrect={false}
									{...field}
								/>
							)}
						/>
					</View>
				</Form>
				<Button
					size="default"
					variant="default"
					onPress={form.handleSubmit(onSubmit)}
					disabled={form.formState.isSubmitting}
					className="web:m-4"
				>
					{form.formState.isSubmitting ? (
						<ActivityIndicator size="small" />
					) : (
						<Text
							style={{
								color: colorScheme.colorScheme === "dark" ? "#000" : "#fff",
							}}
						>
							Enregistrer les changements
						</Text>
					)}
				</Button>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	input: {
		borderWidth: 1,
		borderColor: "gray",
		padding: 8,
		marginBottom: 8,
		width: 200,
	},
	errorText: {
		color: "red",
	},
});
