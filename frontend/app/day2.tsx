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

const { width, height } = Dimensions.get("window");

const CARD_PAIRS = [
  { id: 1, emoji: "💕" },
  { id: 2, emoji: "💖" },
  { id: 3, emoji: "💗" },
  { id: 4, emoji: "💘" },
  { id: 5, emoji: "💝" },
  { id: 6, emoji: "💞" },
];

interface Card {
  id: number;
  emoji: string;
  uniqueId: number;
  flipped: boolean;
  matched: boolean;
}

export default function Day2() {
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
      const firstCard = cards.find(c => c.uniqueId === first);
      const secondCard = cards.find(c => c.uniqueId === second);

      if (firstCard && secondCard && firstCard.id === secondCard.id) {
        // Match found!
        setTimeout(() => {
          setCards(cards.map(c => 
            c.uniqueId === first || c.uniqueId === second
              ? { ...c, matched: true }
              : c
          ));
          setMatchedPairs(prev => prev + 1);
          setSelectedCards([]);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(cards.map(c => 
            c.uniqueId === first || c.uniqueId === second
              ? { ...c, flipped: false }
              : c
          ));
          setSelectedCards([]);
        }, 1000);
      }
    }
  }, [selectedCards]);

  useEffect(() => {
    if (matchedPairs === CARD_PAIRS.length) {
      setTimeout(() => {
        completeDay();
      }, 500);
    }
  }, [matchedPairs]);

  const initializeGame = () => {
    const doubled = [...CARD_PAIRS, ...CARD_PAIRS];
    const shuffled = doubled
      .map((card, index) => ({
        ...card,
        uniqueId: index,
        flipped: false,
        matched: false,
      }))
      .sort(() => Math.random() - 0.5);
    setCards(shuffled);
  };

  const handleCardPress = (uniqueId: number) => {
    if (selectedCards.length >= 2) return;
    
    const card = cards.find(c => c.uniqueId === uniqueId);
    if (!card || card.flipped || card.matched) return;

    setCards(cards.map(c => 
      c.uniqueId === uniqueId ? { ...c, flipped: true } : c
    ));
    setSelectedCards([...selectedCards, uniqueId]);
  };

  const completeDay = async () => {
    try {
      await api.completeDay(2);
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
        <Text style={styles.headerTitle}>💘 Propose Day</Text>
        <Text style={styles.progress}>Pairs: {matchedPairs} / {CARD_PAIRS.length}</Text>
      </LinearGradient>

      <View style={styles.gameContainer}>
        <Text style={styles.instructions}>Match the heart pairs! 💕</Text>
        
        <View style={styles.gridContainer}>
          {cards.map((card) => (
            <TouchableOpacity
              key={card.uniqueId}
              style={[
                styles.card,
                card.matched && styles.cardMatched,
              ]}
              onPress={() => handleCardPress(card.uniqueId)}
              disabled={card.flipped || card.matched}
            >
              <LinearGradient
                colors={card.flipped || card.matched ? ["#FF69B4", "#FF1493"] : ["#FFFFFF", "#FFE5F0"]}
                style={styles.cardInner}
              >
                <Text style={styles.cardEmoji}>
                  {card.flipped || card.matched ? card.emoji : "💝"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Result Modal */}
      <Modal
        visible={showResult}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={["#FF1493", "#C71585"]}
            style={styles.resultContainer}
          >
            <Text style={styles.resultEmoji}>💘✨</Text>
            <Text style={styles.resultTitle}>Propose Day Complete!</Text>
            <Text style={styles.quoteText}>
              arre yeh toh already kar liya hai 😏, but happy propose day anyways!
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
    color: "#FF1493",
  },
  progress: {
    fontSize: 18,
    color: "#FFB6D9",
    fontWeight: "600",
    marginTop: 8,
  },
  gameContainer: {
    flex: 1,
    padding: 20,
  },
  instructions: {
    fontSize: 18,
    color: "#FF1493",
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
    fontSize: 40,
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