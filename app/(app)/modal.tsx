import { View, TextInput, Text, ActivityIndicator } from "react-native";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

import { H1, Muted, P } from "@/components/ui/typography";
import { StyleSheet } from "react-native";
import Dropdown from "@/components/ui/dropdown";
import { useSupabase } from "@/context/supabase-provider";
import { Form, FormField, FormInput } from "@/components/ui/form";
import { useState } from "react";
import { useColorScheme } from "@/lib/useColorScheme";

const formSchema = z.object({
	categorie: z.string().nonempty("This field is required"),
	question: z.string().nonempty("This field is required"),
	answer: z.string().nonempty("This field is required"),
	deck_id: z.number().min(1, "This field is required"),
});

export default function Modal() {
	const colorScheme = useColorScheme();
	const { createCard } = useSupabase();

	const [category, setCategory] = useState(null);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			categorie: "",
			question: "",
			answer: "",
			deck_id: 0,
		},
	});

	async function onSubmit(data: z.infer<typeof formSchema>) {
		try {
			await createCard(
				data.categorie,
				data.question,
				data.answer,
				data.deck_id,
			);

			form.reset();
		} catch (error: Error | any) {
			console.log(error.message);
		}
	}

	return (
		<View className="flex flex-1 justify-center bg-background p-4 gap-y-4">
			<H1 className="text-center">Création d'une nouvelle carte</H1>
			<Muted className="text-center">
				Bienvenue dans l'outil de création de cartes. Ici, vous pouvez créer vos
				propres cartes en remplissant les champs.
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
							name="question"
							render={({ field }) => (
								<FormInput
									label="Question"
									placeholder="Question"
									autoCapitalize="none"
									autoCorrect={false}
									{...field}
								/>
							)}
						/>
						<FormField
							control={form.control}
							name="answer"
							render={({ field }) => (
								<FormInput
									label="Answer"
									placeholder="Answer"
									autoCapitalize="none"
									autoCorrect={false}
									{...field}
								/>
							)}
						/>
					</View>
				</Form>
				<Dropdown
					sendValue={(value) => form.setValue("deck_id", value)}
					type="deck"
				/>
				{form.formState.errors.deck_id && (
					<Text style={{ color: "red" }}>
						{form.formState.errors.deck_id.message}
					</Text>
				)}
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
