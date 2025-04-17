import { View } from "react-native";

import { router } from "expo-router";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";

import SwipeableCard from "../../components/swipableCard";
import { useSupabase } from "@/context/supabase-provider";
import { useState, useEffect } from "react";

interface Card {
    id: string;
    category: string;
    question: string;
    answer: string;
    created_at: string;
}

export default function CardsPage() {
    const { getCards } = useSupabase();
    const [cards, setCards] = useState<Card[]>([]);

    useEffect(() => {
        async function fetchCards() {
            const result = await getCards();
            if (result?.success && result.data) {
                setCards(result.data);
            }
        }
        fetchCards();
    }, [getCards]);

    const handleSwipeOff = () => {
        setCards((prev) => prev.slice(1));
    };

    return (
        <View className="flex-1 items-center justify-center bg-background p-4 gap-y-4">
            <H1 className="text-center">Cartes</H1>
            <Muted className="text-center mb-2">
                Bienvenue sur la page des cartes. {"\n"} Swipez pour les faire défiler.
            </Muted>

            <View className="flex-1 w-full items-center justify-center relative">
                {cards.length === 0 ? (
                    <Text className="text-center">
                        Vous n'avez pas encore créé de cartes. {"\n"} Appuyez sur le bouton
                        ci-dessous pour créer votre 1ère carte.
                    </Text>
                ) : (
                    [...cards]
                        .reverse()
                        .map((card, index) => (
                            <SwipeableCard
                                key={card.id}
                                card={card}
                                onSwipeOff={handleSwipeOff}
                            />
                        ))
                )}
            </View>

            <Button className="w-full" onPress={() => router.push("/(app)/modal")}>
                <Text>Créer une nouvelle carte</Text>
            </Button>
        </View>
    );
}
