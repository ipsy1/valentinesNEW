import React, { useState } from "react";
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

// Generate random heart positions
const generateHearts = () => {
  const hearts = [];
  for (let i = 0; i < 10; i++) {
    hearts.push({
      id: i,
      x: Math.random() * (width - 100) + 20,
      y: Math.random() * 400 + 50,
      collected: false,
    });
  }
  return hearts;
};

export default function Day6() {
  const router = useRouter();
  const [hearts, setHearts] = useState(generateHearts());
  const [collectedCount, setCollectedCount] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleHeartPress = (id: number) => {
    const heart = hearts.find((h) => h.id === id);
    if (heart && !heart.collected) {
      const updatedHearts = hearts.map((h) =>
        h.id === id ? { ...h, collected: true } : h
      );
      setHearts(updatedHearts);
      const newCount = collectedCount + 1;
      setCollectedCount(newCount);

      if (newCount === 10) {
        setTimeout(() => {
          completeDay();
        }, 500);
      }
    }
  };

  const completeDay = async () => {
    try {
      await api.completeDay(6);
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
          <Ionicons name="arrow-back" size={28} color="#FF1493" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🤗 Hug Day</Text>
        <Text style={styles.progress}>Hearts: {collectedCount} / 10</Text>
      </LinearGradient>

      <View style={styles.gameContainer}>
        <Text style={styles.instructions}>Collect all the hug hearts! 🤗💕</Text>

        <View style={styles.heartsContainer}>
          {hearts.map((heart) => (
            <TouchableOpacity
              key={heart.id}
              style={[
                styles.heart,
                {
                  left: heart.x,
                  top: heart.y,
                },
                heart.collected && styles.heartCollected,
              ]}
              onPress={() => handleHeartPress(heart.id)}
              disabled={heart.collected}
            >
              <Text style={styles.heartEmoji}>
                {heart.collected ? "✨" : "🤗"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Result Modal */}
      <Modal visible={showResult} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={["#FF1493", "#C71585"]}
            style={styles.resultContainer}
          >
            <Text style={styles.resultEmoji}>🤗✨</Text>
            <Text style={styles.resultTitle}>Hug Day Complete!</Text>
            <Text style={styles.quoteText}>
              BADAAAA SA HUG FOR YOU, MY HANDSOME BOY
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
    color: "#FF69B4",
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 20,
  },
  heartsContainer: {
    flex: 1,
    position: "relative",
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    borderWidth: 3,
    borderColor: "#FF1493",
  },
  heart: {
    position: "absolute",
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 20, 147, 0.2)",
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#FF1493",
  },
  heartCollected: {
    backgroundColor: "rgba(255, 215, 0, 0.3)",
    borderColor: "#FFD700",
  },
  heartEmoji: {
    fontSize: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
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