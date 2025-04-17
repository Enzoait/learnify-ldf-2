import { supabase } from "@/config/supabase";

interface Quiz {
	id: number;
	title: string;
	questions: string;
	categ_id: number;
}

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

	const quizIds = data.map((quiz: any) => quiz.id);

	if (quizIds.length === 0) {
		return { success: true, data: [] };
	}

	const { data: statsData, error: statsError } = await supabase
		.from("stats")
		.select("quiz_id, score, try_number, updated_at")
		.in("quiz_id", quizIds)
		.eq("user_id", user.id);

	if (statsError) {
		return { success: false, message: statsError.message };
	}

	const quizzesWithStats = data.map((quiz: any) => {
		const stat = statsData.find((s: any) => s.quiz_id === quiz.id);
		return {
			...quiz,
			userStats: {
				progress: stat?.score ?? null,
				tryNumber: stat?.try_number ?? 0,
				lastTried: stat?.updated_at ?? null,
			},
		};
	});

	return { success: true, data: quizzesWithStats };
};

export const fetchQuizById = async (id: number) => {
	const { data, error } = await supabase
		.from("quizzes")
		.select("*")
		.eq("id", id)
		.single();

	if (error) {
		throw new Error(error.message);
	}

	return data as Quiz;
};

export const saveQuizStats = async (
	quizId: number,
	correctAnswers: number,
	totalQuestions: number,
) => {
	try {
		const { data: userData, error: userError } = await supabase.auth.getUser();
		if (userError || !userData) {
			throw new Error("Utilisateur non connecté.");
		}

		const user = userData.user;
		const score = Math.round((correctAnswers / totalQuestions) * 100);

		const { data: existingData, error: fetchError } = await supabase
			.from("stats")
			.select("try_number")
			.eq("quiz_id", quizId)
			.eq("user_id", user.id)
			.single();

		const tryNumber = existingData?.try_number ?? 0;

		const { data, error } = await supabase.from("stats").upsert(
			{
				quiz_id: quizId,
				score: score,
				user_id: user.id,
				try_number: tryNumber + 1,
				updated_at: new Date().toISOString(),
			},
			{
				onConflict: "quiz_id,user_id",
			},
		);

		if (error) {
			throw new Error(error.message);
		}

		return { success: true, data };
	} catch (err: unknown) {
		if (err instanceof Error) {
			console.error(
				"Erreur lors de l'enregistrement des statistiques:",
				err.message,
			);
			return { success: false, message: err.message };
		}

		console.error("Erreur inconnue");
		return { success: false, message: "Erreur inconnue" };
	}
};

export const updateQuizInDB = async (
	quizId: number,
	updatedQuiz: { title: string; questions: any[]; category: number },
) => {
	try {
		const { data: userData, error: userError } = await supabase.auth.getUser();
		if (userError || !userData) {
			throw new Error("Utilisateur non connecté.");
		}

		const { data, error } = await supabase
			.from("quizzes")
			.update({
				title: updatedQuiz.title,
				questions: JSON.stringify(updatedQuiz.questions),
				categ_id: updatedQuiz.category,
			})
			.eq("id", quizId);

		if (error) {
			throw new Error(error.message);
		}

		return { success: true, data };
	} catch (err: unknown) {
		if (err instanceof Error) {
			console.error("Erreur lors de la mise à jour du quiz:", err.message);
			return { success: false, message: err.message };
		}

		return { success: false, message: "Erreur inconnue" };
	}
};

export const deleteQuizFromDB = async (quizId: number) => {
	try {
		const { data: userData, error: userError } = await supabase.auth.getUser();
		if (userError || !userData) {
			throw new Error("Utilisateur non connecté.");
		}

		const { data, error } = await supabase
			.from("quizzes")
			.delete()
			.eq("id", quizId)
			.eq("user_id", userData.user.id);

		if (error) {
			throw new Error(error.message);
		}

		return { success: true, data };
	} catch (err: unknown) {
		if (err instanceof Error) {
			console.error("Erreur lors de la suppression du quiz:", err.message);
			return { success: false, message: err.message };
		}

		return { success: false, message: "Erreur inconnue" };
	}
};
