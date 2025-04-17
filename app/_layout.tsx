import "../global.css";

import { Slot } from "expo-router";
import { View } from "react-native";

import { SupabaseProvider, useSupabase } from "@/context/supabase-provider";
import { GestureHandlerRootView } from "react-native-gesture-handler";

function RootLayoutNav() {
	const { onLayoutRootView } = useSupabase();

	return (
		<View style={{ flex: 1 }} onLayout={onLayoutRootView}>
			<Slot />
		</View>
	);
}

export default function AppLayout() {
	return (
		<SupabaseProvider>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<RootLayoutNav />
			</GestureHandlerRootView>
		</SupabaseProvider>
	);
}
