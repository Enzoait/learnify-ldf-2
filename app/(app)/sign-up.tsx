import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ActivityIndicator, View } from "react-native";
import * as z from "zod";

import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormInput } from "@/components/ui/form";
import { Text } from "@/components/ui/text";
import { H1 } from "@/components/ui/typography";
import { useSupabase } from "@/context/supabase-provider";

const formSchema = z
	.object({
		email: z.string().email("Veuillez entrer une adresse e-mail valide."),
		password: z
			.string()
			.min(8, "Veuillez entrer au moins 8 caractères.")
			.max(64, "Veuillez entrer moins de 64 caractères.")
			.regex(
				/^(?=.*[a-z])/,
				"Votre mot de passe doit contenir au moins une lettre minuscule.",
			)
			.regex(
				/^(?=.*[A-Z])/,
				"Votre mot de passe doit contenir au moins une lettre majuscule.",
			)
			.regex(/^(?=.*[0-9])/, "Votre mot de passe doit contenir au moins un chiffre.")
			.regex(
				/^(?=.*[!@#$%^&*])/,
				"Votre mot de passe doit contenir au moins un caractère spécial.",
			),
		confirmPassword: z.string().min(8, "Veuillez entrer au moins 8 caractères."),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Vos mots de passe ne correspondent pas.",
		path: ["confirmPassword"],
	});

export default function SignUp() {
	const { signUp } = useSupabase();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	async function onSubmit(data: z.infer<typeof formSchema>) {
		try {
			await signUp(data.email, data.password);

			form.reset();
		} catch (error: Error | any) {
			console.log(error.message);
		}
	}

	return (
		<SafeAreaView className="flex-1 bg-background p-4" edges={["bottom"]}>
			<View className="flex-1 gap-4 web:m-4">
				<H1 className="self-start">Inscription</H1>

				<Form {...form}>
					<View className="gap-4">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormInput
									label="Email"
									placeholder="Email"
									autoCapitalize="none"
									autoComplete="email"
									autoCorrect={false}
									keyboardType="email-address"
									{...field}
								/>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormInput
									label="Mot de passe"
									placeholder="Mot de passe"
									autoCapitalize="none"
									autoCorrect={false}
									secureTextEntry
									{...field}
								/>
							)}
						/>
						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormInput
									label="Confirmer le mot de passe"
									placeholder="Confirmer le mot de passe"
									autoCapitalize="none"
									autoCorrect={false}
									secureTextEntry
									{...field}
								/>
							)}
						/>
					</View>
				</Form>
			</View>
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
					<Text>S'inscrire</Text>
				)}
			</Button>
		</SafeAreaView>
	);
}
