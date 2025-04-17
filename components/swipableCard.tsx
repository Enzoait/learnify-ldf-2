import {
	useSharedValue,
	useAnimatedStyle,
	withSpring,
	runOnJS,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, { useAnimatedGestureHandler } from "react-native-reanimated";
import { Dimensions } from "react-native";
import FlippableCard from "@/components/flippableCard";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

interface Card {
	id: string;
	category: string;
	question: string;
	answer: string;
	created_at: string;
}

interface SwipeableCardProps {
	card: Card;
	onSwipeOff: () => void;
}

export default function SwipeableCard({
	card,
	onSwipeOff,
}: SwipeableCardProps) {
	const translateX = useSharedValue(0);
	const translateY = useSharedValue(0);

	const gestureHandler = useAnimatedGestureHandler({
		onActive: (event) => {
			translateX.value = event.translationX;
			translateY.value = event.translationY;
		},
		onEnd: () => {
			if (Math.abs(translateX.value) > SWIPE_THRESHOLD) {
				translateX.value = withSpring(
					Math.sign(translateX.value) * SCREEN_WIDTH,
					{},
					() => runOnJS(onSwipeOff)(),
				);
			} else {
				translateX.value = withSpring(0);
				translateY.value = withSpring(0);
			}
		},
	});

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [
			{ translateX: translateX.value },
			{ translateY: translateY.value },
			{ rotateZ: `${translateX.value * 0.001}rad` },
		],
	}));

	return (
		<PanGestureHandler onGestureEvent={gestureHandler}>
			<Animated.View className="absolute w-full" style={animatedStyle}>
				<FlippableCard
					category={card.category}
					question={card.question}
					answer={card.answer}
				/>
			</Animated.View>
		</PanGestureHandler>
	);
}
