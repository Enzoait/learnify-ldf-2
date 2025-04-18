import { Tabs } from "expo-router";
import React from "react";
import { usePathname } from "expo-router";

import { colors } from "@/constants/colors";
import { useColorScheme } from "@/lib/useColorScheme";
import { Image } from "@/components/image";

export default function ProtectedLayout() {
	const { colorScheme } = useColorScheme();
	const currentPath = usePathname();
	const pagesToHideTabBar = ["/qcm/create"];

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarStyle: {
					backgroundColor:
						colorScheme === "dark"
							? colors.dark.background
							: colors.light.background,
					display: pagesToHideTabBar.some((page) => currentPath.includes(page))
						? "none"
						: "flex",
				},
				tabBarActiveTintColor:
					colorScheme === "dark"
						? colors.dark.foreground
						: colors.light.foreground,
				tabBarShowLabel: false,
			}}
		>
			<Tabs.Screen
				name="deck"
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
				name="qcm"
				options={{
					title: "Quiz",
					tabBarIcon: ({ color, size }) => (
						<Image
							source={require("@/assets/quiz.png")}
							style={{
								width: size,
								height: size,
								tintColor: color,
							}}
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
