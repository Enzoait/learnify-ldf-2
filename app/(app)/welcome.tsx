import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";

import { Image } from "@/components/image";
import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";

export default function WelcomeScreen() {
	const router = useRouter();

	return (
		<SafeAreaView className="flex flex-1 bg-background p-4">
			<View className="flex flex-1 items-center justify-center gap-y-4 web:m-4">
				<Image
					source={require("@/assets/icon.png")}
					className="w-16 h-16 rounded-xl"
				/>
				<H1 className="text-center">Bienvenue sur learnify</H1>
				<Muted className="text-center">
					Une application pour apprendre et réviser vos cours de manière
					efficace et ludique.
					{"\n"}Créez un compte pour commencer à apprendre dès maintenant !
					{"\n"}Déjà un compte ? Connectez-vous pour retrouver vos progrès et
					vos cours.
				</Muted>
			</View>
			<View className="flex flex-col gap-y-4 web:m-4">
				<Button
					size="default"
					variant="default"
					onPress={() => {
						router.push("/sign-up");
					}}
				>
					<Text>S'inscrire</Text>
				</Button>
				<Button
					size="default"
					variant="secondary"
					onPress={() => {
						router.push("/sign-in");
					}}
				>
					<Text>se Connectez</Text>
				</Button>
			</View>
		</SafeAreaView>
	);
}
