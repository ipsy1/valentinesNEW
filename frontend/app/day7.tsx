import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  Modal,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../utils/api";

const { width } = Dimensions.get("window");

const QUESTIONS = [
  {
    question: "What's my favorite thing about you?",
    options: ["Your smile", "Your humor", "Everything", "Your kindness"],
    correct: 2,
  },
  {
    question: "What makes us special?",
    options: ["Our love", "Our bond", "Our connection", "All of the above"],
    correct: 3,
  },
  {
    question: "What's the best part of our relationship?",
    options: ["Trust", "Understanding", "Love", "All together"],
    correct: 3,
  },
];

export default function Day7() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (selectedIndex: number) => {
    if (selectedIndex === QUESTIONS[currentQuestion].correct) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < QUESTIONS.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setTimeout(() => {
        completeDay();
      }, 500);
    }
  };

  const completeDay = async () => {
    try {
      await api.completeDay(7);
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
        <Text style={styles.headerTitle}>💋 Kiss Day</Text>
        <Text style={styles.progress}>
          Question {currentQuestion + 1} / {QUESTIONS.length}
        </Text>
      </LinearGradient>

      <ScrollView style={styles.gameContainer}>
        <Text style={styles.instructions}>Answer these love questions! 💕</Text>

        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>
            {QUESTIONS[currentQuestion].question}
          </Text>

          <View style={styles.optionsContainer}>
            {QUESTIONS[currentQuestion].options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionButton}
                onPress={() => handleAnswer(index)}
              >
                <LinearGradient
                  colors={["#FFFFFF", "#FFE5F0"]}
                  style={styles.optionGradient}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Result Modal */}
      <Modal visible={showResult} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={["#FF69B4", "#FF1493"]}
            style={styles.resultContainer}
          >
            <Text style={styles.resultEmoji}>💋✨</Text>
            <Text style={styles.resultTitle}>Kiss Day Complete!</Text>
            <Text style={styles.quoteText}>
              hersheys kisses chahiye ya mere? wink wink 😉
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
    marginBottom: 30,
  },
  questionContainer: {
    marginBottom: 30,
  },
  questionText: {
    fontSize: 22,
    color: "#8B0040",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 32,
  },
  optionsContainer: {
    gap: 16,
  },
  optionButton: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  optionGradient: {
    padding: 20,
    alignItems: "center",
  },
  optionText: {
    fontSize: 18,
    color: "#C71585",
    fontWeight: "600",
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