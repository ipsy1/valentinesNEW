import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  Modal,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../utils/api";

const { width } = Dimensions.get("window");

const PIECE_SIZE = (width - 60) / 3;

const PUZZLE_IMAGE = "https://customer-assets.emergentagent.com/job_8ffa4a81-fe77-48cf-a350-8087a11b91ca/artifacts/m8p866wx_WhatsApp%20Image%202026-02-07%20at%2011.35.33%20AM.jpeg";

const SOLUTION = [0, 1, 2, 3, 4, 5, 6, 7, 8];

export default function Day4() {
  const router = useRouter();
  const [pieces, setPieces] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8].sort(() => Math.random() - 0.5));
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handlePiecePress = (index: number) => {
    if (selectedIndex === null) {
      setSelectedIndex(index);
    } else {
      // Swap pieces
      const newPieces = [...pieces];
      [newPieces[selectedIndex], newPieces[index]] = [newPieces[index], newPieces[selectedIndex]];
      setPieces(newPieces);
      setSelectedIndex(null);

      // Check if solved
      if (JSON.stringify(newPieces) === JSON.stringify(SOLUTION)) {
        setTimeout(() => {
          completeDay();
        }, 500);
      }
    }
  };

  const completeDay = async () => {
    try {
      await api.completeDay(4);
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
        <Text style={styles.headerTitle}>🧸 Teddy Day</Text>
      </LinearGradient>

      <View style={styles.gameContainer}>
        <Text style={styles.instructions}>Solve the jigsaw puzzle! 🧩</Text>
        
        <View style={styles.puzzleContainer}>
          {pieces.map((pieceNumber, index) => {
            const pieceRow = Math.floor(pieceNumber / 3);
            const pieceCol = pieceNumber % 3;

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.puzzlePiece,
                  selectedIndex === index && styles.selectedPiece,
                ]}
                onPress={() => handlePiecePress(index)}
              >
                <Image
                  source={{ uri: PUZZLE_IMAGE }}
                  style={[
                    styles.pieceImage,
                    {
                      width: PIECE_SIZE * 3,
                      height: PIECE_SIZE * 3,
                      left: -pieceCol * PIECE_SIZE,
                      top: -pieceRow * PIECE_SIZE,
                    },
                  ]}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.hint}>Tap two pieces to swap them!</Text>
      </View>

      {/* Result Modal */}
      <Modal visible={showResult} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={["#FF69B4", "#FF1493"]}
            style={styles.resultContainer}
          >
            <Text style={styles.resultEmoji}>🧸✨</Text>
            <Text style={styles.resultTitle}>Teddy Day Complete!</Text>
            <Text style={styles.quoteText}>
              happy teddy day to my living, breathing, tall, musuclar, charming teddy :)
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
    backgroundColor: "#FFE5F0",
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
  gameContainer: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  instructions: {
    fontSize: 18,
    color: "#C71585",
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 20,
  },
  puzzleContainer: {
    width: PIECE_SIZE * 3,
    height: PIECE_SIZE * 3,
    flexDirection: "row",
    flexWrap: "wrap",
    borderWidth: 2,
    borderColor: "#C71585",
    borderRadius: 12,
    overflow: "hidden",
  },
  puzzlePiece: {
    width: PIECE_SIZE,
    height: PIECE_SIZE,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#FFB6D9",
  },
  selectedPiece: {
    borderWidth: 3,
    borderColor: "#FF1493",
  },
  pieceImage: {
    position: "absolute",
  },
  hint: {
    fontSize: 14,
    color: "#8B0040",
    marginTop: 20,
    textAlign: "center",
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