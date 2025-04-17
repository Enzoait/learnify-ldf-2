import * as Notifications from "expo-notifications";
import { supabase } from "@/config/supabase";

export async function registerForPushNotifications() {
	const { status } = await Notifications.requestPermissionsAsync();
	if (status !== "granted") {
		console.log("Permission refusée pour les notifications");
		return;
	}

	const token = (await Notifications.getExpoPushTokenAsync()).data;

	const { data, error } = await supabase.auth.getUser();
	if (data && data.user) {
		const userId = data.user.id;

		const { error: updateError } = await supabase
			.from("auth.users")
			.update({ app_metadata: { expo_push_token: token } })
			.eq("id", userId);

		if (updateError) {
			console.error(
				"Erreur lors de l'enregistrement du token:",
				updateError.message,
			);
		}
	}
}
