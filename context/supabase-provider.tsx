import { Session, User } from "@supabase/supabase-js";
import { useRouter, useSegments, SplashScreen } from "expo-router";
import {
	createContext,
	useContext,
	useEffect,
	useState,
	useCallback,
} from "react";

import { supabase } from "@/config/supabase";

SplashScreen.preventAutoHideAsync();

type SupabaseContextProps = {
	user: User | null;
	session: Session | null;
	initialized?: boolean;
	signUp: (email: string, password: string) => Promise<void>;
	signInWithPassword: (email: string, password: string) => Promise<void>;
	signOut: () => Promise<void>;
	onLayoutRootView: () => Promise<void>;
	getCategories: () =>
		| Promise<{ success: boolean; data?: any[]; message?: string }>
		| undefined;
	createCard: (
		category: string,
		question: string,
		answer: string,
		deck_id: number,
	) => Promise<void>;
	createDecks: (category: string, title: string) => Promise<void>;
	getCards: () =>
		| Promise<{ success: boolean; data?: any[]; message?: string }>
		| undefined;
	getDecks: () =>
		| Promise<{ success: boolean; data?: any[]; message?: string }>
		| undefined;
	updateDecks: (id: number, title: string) => Promise<void>;
	deleteDecks: (id: number) => Promise<void>;
};

type SupabaseProviderProps = {
	children: React.ReactNode;
};

export const SupabaseContext = createContext<SupabaseContextProps>({
	user: null,
	session: null,
	initialized: false,
	signUp: async () => {},
	signInWithPassword: async () => {},
	signOut: async () => {},
	onLayoutRootView: async () => {},
	getCategories: async () => ({ success: false, message: "Not implemented" }),
	createCard: async () => {},
	createDecks: async () => {},
	updateDecks: async () => {},
	deleteDecks: async () => {},
	getCards: async () => ({ success: false, message: "Not implemented" }),
	getDecks: async () => ({ success: false, message: "Not implemented" }),
});

export const useSupabase = () => useContext(SupabaseContext);

export const SupabaseProvider = ({ children }: SupabaseProviderProps) => {
	const router = useRouter();
	const segments = useSegments();
	const [user, setUser] = useState<User | null>(null);
	const [session, setSession] = useState<Session | null>(null);
	const [initialized, setInitialized] = useState<boolean>(false);
	const [appIsReady, setAppIsReady] = useState<boolean>(false);

	const signUp = async (email: string, password: string) => {
		const { error } = await supabase.auth.signUp({
			email,
			password,
		});
		if (error) {
			throw error;
		}
	};

	const signInWithPassword = async (email: string, password: string) => {
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});
		if (error) {
			throw error;
		}
	};

	const signOut = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			throw error;
		}
	};

	const getCategories = async () => {
		try {
			const { data, error } = await supabase.from("Categories").select("*");
			if (error) {
				throw new Error(error.message);
			}

			return { success: true, data };
		} catch (err: unknown) {
			if (err instanceof Error) {
				console.error(
					"Erreur lors de la récupération des catégories:",
					err.message,
				);
				return { success: false, message: err.message };
			}

			console.error("Erreur inconnue");
			return { success: false, message: "Erreur inconnue" };
		}
	};

	const createCard = async (
		category: string,
		question: string,
		answer: string,
		deck_id: number,
	) => {
		const { data: userData, error: userError } = await supabase.auth.getUser();
		const user = userData.user;
		const { error } = await supabase.from("Cards").insert({
			category: category,
			question: question,
			answer: answer,
			user_id: user?.id,
			deck_id: deck_id,
		});
		if (error) {
			throw error;
		}
	};

	const createDecks = async (category: string, title: string) => {
		const { data: userData, error: userError } = await supabase.auth.getUser();
		const user = userData.user;
		const { error } = await supabase.from("Decks").insert({
			category: category,
			title: title,
			user_id: user?.id,
		});
		if (error) {
			throw error;
		}
	};

	const updateDecks = async (id: number, title: string) => {
		const { data: userData, error: userError } = await supabase.auth.getUser();
		const user = userData.user;
		const { error } = await supabase
			.from("Decks")
			.update({
				title: title,
			})
			.eq("id", id)
			.eq("user_id", user?.id);
		if (error) {
			throw error;
		}
	};

	const deleteDecks = async (id: number) => {
		const { data: userData, error: userError } = await supabase.auth.getUser();
		const user = userData.user;
		const { error } = await supabase
			.from("Decks")
			.delete()
			.eq("id", id)
			.eq("user_id", user?.id);
		if (error) {
			throw error;
		}
	};

	const getCards = async () => {
		try {
			const { data, error } = await supabase.from("Cards").select("*");
			if (error) {
				throw new Error(error.message);
			}

			return { success: true, data };
		} catch (err: unknown) {
			if (err instanceof Error) {
				console.error(
					"Erreur lors de la récupération des catégories:",
					err.message,
				);
				return { success: false, message: err.message };
			}

			console.error("Erreur inconnue");
			return { success: false, message: "Erreur inconnue" };
		}
	};

	const getDecks = async () => {
		try {
			const { data, error } = await supabase.from("Decks").select("*");
			if (error) {
				throw new Error(error.message);
			}

			return { success: true, data };
		} catch (err: unknown) {
			if (err instanceof Error) {
				console.error(
					"Erreur lors de la récupération des catégories:",
					err.message,
				);
				return { success: false, message: err.message };
			}

			console.error("Erreur inconnue");
			return { success: false, message: "Erreur inconnue" };
		}
	};

	useEffect(() => {
		async function prepare() {
			try {
				const {
					data: { session },
				} = await supabase.auth.getSession();
				setSession(session);
				setUser(session ? session.user : null);
				setInitialized(true);

				const {
					data: { subscription },
				} = supabase.auth.onAuthStateChange((_event, session) => {
					setSession(session);
					setUser(session ? session.user : null);
				});

				await new Promise((resolve) => setTimeout(resolve, 100));
			} catch (e) {
				console.warn(e);
			} finally {
				setAppIsReady(true);
			}
		}
		prepare();
	}, []);

	useEffect(() => {
		if (!initialized || !appIsReady) return;

		const inProtectedGroup = segments[1] === "(protected)";

		if (session && !inProtectedGroup) {
			router.replace("/(app)/(protected)/deck/");
		} else if (!session) {
			router.replace("/(app)/welcome");
		}
	}, [initialized, appIsReady, session]);

	const onLayoutRootView = useCallback(async () => {
		if (appIsReady) {
			await SplashScreen.hideAsync();
		}
	}, [appIsReady]);

	if (!initialized || !appIsReady) {
		return null;
	}

	return (
		<SupabaseContext.Provider
			value={{
				user,
				session,
				initialized,
				signUp,
				signInWithPassword,
				signOut,
				onLayoutRootView,
				getCategories,
				createCard,
				createDecks,
				updateDecks,
				deleteDecks,
				getCards,
				getDecks,
			}}
		>
			{children}
		</SupabaseContext.Provider>
	);
};
