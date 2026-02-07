import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  Modal,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../utils/api";

const { width, height } = Dimensions.get("window");

interface Chocolate {
  id: number;
  x: number;
  anim: Animated.Value;
}

export default function Day3() {
  const router = useRouter();
  const [chocolates, setChocolates] = useState<Chocolate[]>([]);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showResult, setShowResult] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    startGame();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (timeLeft === 0 && score >= 15) {
      completeDay();
    } else if (timeLeft === 0) {
      Alert.alert("Try Again!", "Catch at least 15 chocolates to complete!", [
        { text: "Retry", onPress: () => resetGame() },
      ]);
    }
  }, [timeLeft]);

  const startGame = () => {
    setGameActive(true);
    intervalRef.current = setInterval(() => {
      spawnChocolate();
    }, 1500);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (intervalRef.current) clearInterval(intervalRef.current);
          setGameActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const spawnChocolate = () => {
    const id = Date.now();
    const x = Math.random() * (width - 60);
    const anim = new Animated.Value(0);

    const newChocolate: Chocolate = { id, x, anim };
    setChocolates((prev) => [...prev, newChocolate]);

    Animated.timing(anim, {
      toValue: height - 200,
      duration: 3000,
      useNativeDriver: true,
    }).start(() => {
      setChocolates((prev) => prev.filter((c) => c.id !== id));
    });
  };

  const catchChocolate = (id: number) => {
    setChocolates((prev) => prev.filter((c) => c.id !== id));
    setScore((prev) => prev + 1);
  };

  const resetGame = () => {
    setChocolates([]);
    setScore(0);
    setTimeLeft(30);
    startGame();
  };

  const completeDay = async () => {
    try {
      await api.completeDay(3);
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
        <Text style={styles.headerTitle}>🍫 Chocolate Day</Text>
        <View style={styles.statsContainer}>
          <Text style={styles.statText}>Score: {score}</Text>
          <Text style={styles.statText}>Time: {timeLeft}s</Text>
        </View>
      </LinearGradient>

      <View style={styles.gameArea}>
        <Text style={styles.instructions}>Catch 15 chocolates! 🍫</Text>
        
        {chocolates.map((chocolate) => (
          <Animated.View
            key={chocolate.id}
            style={[
              styles.chocolate,
              {
                left: chocolate.x,
                transform: [{ translateY: chocolate.anim }],
              },
            ]}
          >
            <TouchableOpacity onPress={() => catchChocolate(chocolate.id)}>
              <Text style={styles.chocolateEmoji}>🍫</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      {/* Result Modal */}
      <Modal visible={showResult} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={["#FF69B4", "#FF1493"]}
            style={styles.resultContainer}
          >
            <Text style={styles.resultEmoji}>🍫✨</Text>
            <Text style={styles.resultTitle}>Chocolate Day Complete!</Text>
            <Text style={styles.quoteText}>
              where's my chocolate, you chocolate boy?
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
  statsContainer: {
    flexDirection: "row",
    gap: 20,
    marginTop: 8,
  },
  statText: {
    fontSize: 18,
    color: "#8B0040",
    fontWeight: "600",
  },
  gameArea: {
    flex: 1,
    position: "relative",
  },
  instructions: {
    fontSize: 18,
    color: "#C71585",
    textAlign: "center",
    fontWeight: "600",
    marginTop: 20,
  },
  chocolate: {
    position: "absolute",
    top: 0,
  },
  chocolateEmoji: {
    fontSize: 50,
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