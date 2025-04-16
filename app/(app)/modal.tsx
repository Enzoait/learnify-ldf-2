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

const formSchema = z.object({
	categorie: z.string(),
	question: z.string().nonempty("This field is required"),
	answer: z.string().nonempty("This field is required"),
});

export default function Modal() {
	const { signUp } = useSupabase();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			categorie: "",
			question: "",
			answer: "",
		},
	});

	async function onSubmit(data: z.infer<typeof formSchema>) {
		try {
			//await signUp(data.email, data.password);

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
				<Dropdown />
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
						<Text className="text-gray-400">Créer</Text>
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
