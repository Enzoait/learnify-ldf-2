import { View, TextInput, Text, ActivityIndicator } from "react-native";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

import { H1, Muted } from "@/components/ui/typography";
import { StyleSheet } from "react-native";
import Dropdown from "@/components/ui/dropdown";
import { useSupabase } from "@/context/supabase-provider";
import { Form, FormField, FormInput } from "@/components/ui/form";
import { useState } from "react";
import { useColorScheme } from "@/lib/useColorScheme";

const formSchema = z.object({
	categorie: z.string().nonempty("This field is required"),
	title: z.string().nonempty("This field is required"),
});

export default function CreateDeck() {
	const colorScheme = useColorScheme();
	const { createDecks } = useSupabase();

	const [category, setCategory] = useState(null);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			categorie: "",
			title: "",
		},
	});

	async function onSubmit(data: z.infer<typeof formSchema>) {
		try {
			await createDecks(data.categorie, data.title);

			form.reset();
		} catch (error: Error | any) {
			console.log(error.message);
		}
	}

	return (
		<View className="flex flex-1 justify-center bg-background p-4 gap-y-4">
			<H1 className="text-center">Création d'un nouveau deck</H1>
			<Muted className="text-center">
				Bienvenue dans l'outil de création de decks. Ici, vous pouvez créer vos
				propres decks en remplissant les champs. Séléctionnez ensuite des cartes
				à ajouter à votre deck.
			</Muted>
			<View className="flex flex-1 gap-4">
				<Dropdown
					sendValue={(value) => form.setValue("categorie", value)}
					type="categorie"
				/>
				{form.formState.errors.categorie && (
					<Text style={{ color: "red" }}>
						{form.formState.errors.categorie.message}
					</Text>
				)}
				<Form {...form}>
					<View className="gap-4">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormInput
									label="Titre"
									placeholder="Titre"
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
							Créer
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
