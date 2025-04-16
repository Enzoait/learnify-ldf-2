import { supabase } from "@/config/supabase";

export const createQuizInDB = async (quizData: {
	title: string;
	questions: any[];
	category: number;
}) => {
	try {
		const { data: userData, error: userError } = await supabase.auth.getUser();
		if (userError || !userData) {
			throw new Error("Utilisateur non connecté.");
		}

		const user = userData.user;

		const categoriesResult = await getCategories();
		if (!categoriesResult.success) {
			throw new Error(categoriesResult.message);
		}

		const categories = categoriesResult.data;

		const categoryExists = categories?.some(
			(cat) => cat.id === quizData.category,
		);
		if (!categoryExists) {
			throw new Error("La catégorie sélectionnée n'existe pas.");
		}

		const { data, error } = await supabase.from("quizzes").insert([
			{
				title: quizData.title,
				questions: JSON.stringify(quizData.questions),
				categ_id: quizData.category,
				user_id: user.id,
			},
		]);

		if (error) {
			throw new Error(error.message);
		}

		return { success: true, data };
	} catch (err: unknown) {
		if (err instanceof Error) {
			console.error("Erreur lors de la création du quiz:", err.message);
			return { success: false, message: err.message };
		}

		console.error("Erreur inconnue");
		return { success: false, message: "Erreur inconnue" };
	}
};

export const getCategories = async () => {
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

export const getUserQuizzesWithCategories = async () => {
	const { data: userData, error: userError } = await supabase.auth.getUser();
	if (userError || !userData) {
		return { success: false, message: "Utilisateur non connecté." };
	}

	const user = userData.user;

	const { data, error } = await supabase
		.from("quizzes")
		.select("id, title, categ_id, questions, Categories(id, title)")
		.eq("user_id", user.id);

	if (error) {
		return { success: false, message: error.message };
	}

	return { success: true, data };
};
