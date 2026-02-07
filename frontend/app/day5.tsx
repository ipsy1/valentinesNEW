import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../utils/api";

const { width } = Dimensions.get("window");

const CARDS_DATA = [
  { id: 1, emoji: "💕" },
  { id: 2, emoji: "💖" },
  { id: 3, emoji: "💗" },
  { id: 4, emoji: "💘" },
  { id: 5, emoji: "💝" },
  { id: 6, emoji: "💞" },
  { id: 7, emoji: "💟" },
  { id: 8, emoji: "💓" },
];

interface Card {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

export default function Day5() {
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (selectedCards.length === 2) {
      const [first, second] = selectedCards;
      const firstCard = cards[first];
      const secondCard = cards[second];

      if (firstCard.id === secondCard.id) {
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card, index) =>
              index === first || index === second
                ? { ...card, matched: true }
                : card
            )
          );
          setMatchedPairs((prev) => prev + 1);
          setSelectedCards([]);
        }, 500);
      } else {
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card, index) =>
              index === first || index === second
                ? { ...card, flipped: false }
                : card
            )
          );
          setSelectedCards([]);
        }, 1000);
      }
    }
  }, [selectedCards]);

  useEffect(() => {
    if (matchedPairs === CARDS_DATA.length) {
      setTimeout(() => {
        completeDay();
      }, 500);
    }
  }, [matchedPairs]);

  const initializeGame = () => {
    const doubled = [...CARDS_DATA, ...CARDS_DATA];
    const shuffled = doubled
      .map((card) => ({
        ...card,
        flipped: false,
        matched: false,
      }))
      .sort(() => Math.random() - 0.5);
    setCards(shuffled);
  };

  const handleCardPress = (index: number) => {
    if (selectedCards.length >= 2) return;
    if (cards[index].flipped || cards[index].matched) return;

    setCards((prevCards) =>
      prevCards.map((card, i) =>
        i === index ? { ...card, flipped: true } : card
      )
    );
    setSelectedCards([...selectedCards, index]);
  };

  const completeDay = async () => {
    try {
      await api.completeDay(5);
      setShowResult(true);
    } catch (error) {
      console.error("Failed to complete day:", error);
      Alert.alert("Error", "Failed to save progress");
    }
  };

  const handleContinue = () => {
    router.push("/");
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#1a1a1a", "#2d0a1f"]} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#C71585" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🤝 Promise Day</Text>
        <Text style={styles.progress}>
          Pairs: {matchedPairs} / {CARDS_DATA.length}
        </Text>
      </LinearGradient>

      <View style={styles.gameContainer}>
        <Text style={styles.instructions}>Match all promise hearts! 💖</Text>

        <View style={styles.gridContainer}>
          {cards.map((card, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.card,
                card.matched && styles.cardMatched,
              ]}
              onPress={() => handleCardPress(index)}
              disabled={card.flipped || card.matched}
            >
              <LinearGradient
                colors={
                  card.flipped || card.matched
                    ? ["#FF69B4", "#FF1493"]
                    : ["#FFFFFF", "#FFE5F0"]
                }
                style={styles.cardInner}
              >
                <Text style={styles.cardEmoji}>
                  {card.flipped || card.matched ? card.emoji : "❓"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Result Modal */}
      <Modal visible={showResult} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={["#FF69B4", "#FF1493"]}
            style={styles.resultContainer}
          >
            <Text style={styles.resultEmoji}>🤝✨</Text>
            <Text style={styles.resultTitle}>Promise Day Complete!</Text>
            <Text style={styles.quoteText}>
              technically this day is about me, but i promise to also let the promises we have to made to each other shine forever ❤️
            </Text>
            <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: 50,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#C71585",
  },
  progress: {
    fontSize: 18,
    color: "#8B0040",
    fontWeight: "600",
    marginTop: 8,
  },
  gameContainer: {
    flex: 1,
    padding: 20,
  },
  instructions: {
    fontSize: 18,
    color: "#C71585",
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 20,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },
  card: {
    width: (width - 80) / 4,
    height: (width - 80) / 4,
    borderRadius: 12,
    overflow: "hidden",
  },
  cardMatched: {
    opacity: 0.6,
  },
  cardInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cardEmoji: {
    fontSize: 36,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  resultContainer: {
    width: width * 0.85,
    padding: 32,
    borderRadius: 24,
    alignItems: "center",
  },
  resultEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 20,
    textAlign: "center",
  },
  quoteText: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
    fontStyle: "italic",
  },
  continueButton: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 30,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF1493",
  },
});