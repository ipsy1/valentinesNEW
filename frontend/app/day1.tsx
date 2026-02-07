import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../utils/api";

const { width, height } = Dimensions.get("window");

// Rose positions (random spots on the image)
const ROSES = [
  { id: 1, x: 0.2, y: 0.3 },
  { id: 2, x: 0.7, y: 0.2 },
  { id: 3, x: 0.5, y: 0.5 },
  { id: 4, x: 0.15, y: 0.7 },
  { id: 5, x: 0.8, y: 0.6 },
  { id: 6, x: 0.4, y: 0.8 },
  { id: 7, x: 0.6, y: 0.35 },
  { id: 8, x: 0.3, y: 0.55 },
  { id: 9, x: 0.85, y: 0.4 },
  { id: 10, x: 0.25, y: 0.9 },
];

export default function Day1() {
  const router = useRouter();
  const [foundRoses, setFoundRoses] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  const handleRosePress = (roseId: number) => {
    if (!foundRoses.includes(roseId)) {
      setFoundRoses([...foundRoses, roseId]);
      
      if (foundRoses.length + 1 === ROSES.length) {
        // All roses found!
        setTimeout(() => {
          completeDay();
        }, 500);
      }
    }
  };

  const completeDay = async () => {
    try {
      await api.completeDay(1);
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
        <Text style={styles.headerTitle}>🌹 Rose Day</Text>
        <Text style={styles.progress}>{foundRoses.length} / {ROSES.length}</Text>
      </LinearGradient>

      <View style={styles.imageContainer}>
        <Image
          source={{ uri: "https://customer-assets.emergentagent.com/job_8ffa4a81-fe77-48cf-a350-8087a11b91ca/artifacts/krur4565_WhatsApp%20Image%202026-02-07%20at%2011.35.33%20AM%20%281%29.jpeg" }}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        
        {ROSES.map((rose) => (
          <TouchableOpacity
            key={rose.id}
            style={[
              styles.roseSpot,
              {
                left: rose.x * width - 30,
                top: rose.y * (height - 200) - 30,
              },
              foundRoses.includes(rose.id) && styles.foundRose,
            ]}
            onPress={() => handleRosePress(rose.id)}
          >
            {foundRoses.includes(rose.id) ? (
              <Text style={styles.roseEmoji}>🌹</Text>
            ) : (
              <View style={styles.hiddenRose} />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.instructions}>
        <Text style={styles.instructionText}>Tap to find all 10 hidden roses! 🌹</Text>
      </View>

      {/* Result Modal */}
      <Modal
        visible={showResult}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={["#FF69B4", "#FF1493"]}
            style={styles.resultContainer}
          >
            <Text style={styles.resultEmoji}>🌹✨</Text>
            <Text style={styles.resultTitle}>Rose Day Complete!</Text>
            <Text style={styles.quoteText}>
              i wish i could make this tulips day, so our "two lips" could meet hehe. happy rose day cutu! 😘
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
  imageContainer: {
    flex: 1,
    position: "relative",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
  },
  roseSpot: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  hiddenRose: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 2,
    borderColor: "rgba(255, 20, 147, 0.3)",
  },
  foundRose: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  roseEmoji: {
    fontSize: 40,
  },
  instructions: {
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  instructionText: {
    fontSize: 16,
    color: "#C71585",
    textAlign: "center",
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
