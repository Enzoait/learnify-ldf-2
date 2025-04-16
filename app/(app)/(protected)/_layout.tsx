import { Tabs } from "expo-router";
import React from "react";
import { Image } from "react-native";

import { colors } from "@/constants/colors";
import { useColorScheme } from "@/lib/useColorScheme";

export default function ProtectedLayout() {
	const { colorScheme } = useColorScheme();

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarStyle: {
					backgroundColor:
						colorScheme === "dark"
							? colors.dark.background
							: colors.light.background,
				},
				tabBarActiveTintColor:
					colorScheme === "dark"
						? colors.dark.foreground
						: colors.light.foreground,
				tabBarShowLabel: false,
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ color, size }) => (
						<Image
							source={require("@/assets/card.png")}
							style={{ width: size, height: size, tintColor: color }}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="settings"
				options={{
					title: "Settings",
					tabBarIcon: ({ color, size }) => (
						<Image
							source={require("@/assets/profile.png")}
							style={{ width: size, height: size, tintColor: color }}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
