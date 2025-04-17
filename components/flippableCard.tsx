import { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
	interpolate,
	runOnJS,
} from "react-native-reanimated";

import { Button } from "./ui/button";

import { cardColors } from "@/constants/cardColors";
import { H3 } from "@/components/ui/typography";
import { useColorScheme } from "@/lib/useColorScheme";

export default function FlippableCard({
	category,
	question,
	answer,
}: {
	category: string;
	question: string;
	answer: string;
}) {
	const colorScheme = useColorScheme();
	const [flipped, setFlipped] = useState(false);
	const rotate = useSharedValue(0);

	const toggleFlip = () => {
		rotate.value = withTiming(flipped ? 0 : 180, { duration: 500 }, () => {
			runOnJS(setFlipped)(!flipped);
		});
	};

	const frontAnimatedStyle = useAnimatedStyle(() => {
		const rotateY = interpolate(rotate.value, [0, 180], [0, 180]);
		return {
			transform: [{ rotateY: `${rotateY}deg` }],
			backfaceVisibility: "hidden",
			position: "absolute",
			width: "100%",
		};
	});

	const backAnimatedStyle = useAnimatedStyle(() => {
		const rotateY = interpolate(rotate.value, [0, 180], [180, 360]);
		return {
			transform: [{ rotateY: `${rotateY}deg` }],
			backfaceVisibility: "hidden",
			position: "absolute",
			width: "100%",
		};
	});

	return (
		<View style={{ width: "100%", height: 225, marginBottom: 16 }}>
			<View style={styles.cardContainer}>
				<Animated.View
					style={[
						styles.card,
						{
							backgroundColor:
								colorScheme.colorScheme === "dark"
									? cardColors.dark[
											category.replaceAll(
												" ",
												"",
											) as keyof typeof cardColors.dark
										]
									: cardColors.light[
											category.replaceAll(
												" ",
												"",
											) as keyof typeof cardColors.light
										],
						},
						frontAnimatedStyle,
					]}
				>
					<H3 style={styles.category}>{category}</H3>
					<Text style={styles.question}>{question}</Text>
					<Button
						size="default"
						variant="default"
						onPress={toggleFlip}
						className="bg-transparent"
					>
						<Text className="" style={styles.buttonText}>
							See answer
						</Text>
					</Button>
				</Animated.View>

				<Animated.View
					style={[
						styles.card,
						{
							backgroundColor:
								colorScheme.colorScheme === "dark" ? "#000" : "#fff",
							borderColor:
								colorScheme.colorScheme === "dark"
									? cardColors.dark[
											category.replaceAll(
												" ",
												"",
											) as keyof typeof cardColors.dark
										]
									: cardColors.light[
											category.replaceAll(
												" ",
												"",
											) as keyof typeof cardColors.light
										],
							borderStyle: "solid",
							borderWidth: 2,
						},
						backAnimatedStyle,
					]}
				>
					<H3
						style={[
							styles.category,
							{
								color:
									colorScheme.colorScheme === "dark"
										? cardColors.dark[
												category.replaceAll(
													" ",
													"",
												) as keyof typeof cardColors.dark
											]
										: cardColors.light[
												category.replaceAll(
													" ",
													"",
												) as keyof typeof cardColors.light
											],
							},
						]}
					>
						{category}
					</H3>
					<Text
						style={[
							styles.question,
							{ color: colorScheme.colorScheme === "dark" ? "#fff" : "#000" },
						]}
					>
						{answer}
					</Text>
					<Button
						size="default"
						variant="default"
						onPress={toggleFlip}
						className="bg-transparent"
					>
						<Text className="" style={styles.buttonText}>
							Hide answer
						</Text>
					</Button>
				</Animated.View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	cardContainer: {
		width: "100%",
		height: "100%",
		position: "relative",
		perspective: "1000",
	},
	card: {
		gap: 32,
		alignItems: "center",
		borderRadius: 8,
		padding: 32,
		width: "100%",
		height: "100%",
		justifyContent: "center",
	},
	category: {
		fontSize: 26,
		fontWeight: "bold",
	},
	question: {
		fontSize: 20,
		textAlign: "center",
	},
	button: {
		backgroundColor: "rgba(0, 0, 0, 0.1)",
	},
	buttonText: {
		fontSize: 18,
		fontStyle: "italic",
	},
});
