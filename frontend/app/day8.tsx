import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Modal,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../utils/api";

const { width, height } = Dimensions.get("window");

export default function Day8() {
  const router = useRouter();
  const [showResult, setShowResult] = useState(false);

  const handleReveal = async () => {
    try {
      await api.completeDay(8);
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
      <LinearGradient
        colors={["#FFE5F0", "#FFB6D9", "#FF85B3"]}
        style={styles.content}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#C71585" />
        </TouchableOpacity>

        <View style={styles.mainContent}>
          <Text style={styles.headerTitle}>💖 Valentine's Day 💖</Text>
          <Text style={styles.subtitle}>The Final Day</Text>

          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: "https://customer-assets.emergentagent.com/job_8ffa4a81-fe77-48cf-a350-8087a11b91ca/artifacts/oea67exi_WhatsApp%20Image%202026-02-07%20at%2011.35.35%20AM%20%281%29.jpeg",
              }}
              style={styles.coupleImage}
              resizeMode="cover"
            />
          </View>

          <TouchableOpacity style={styles.revealButton} onPress={handleReveal}>
            <LinearGradient
              colors={["#FF1493", "#C71585"]}
              style={styles.buttonGradient}
            >
              <Text style={styles.revealButtonText}>Reveal My Gift 🎁</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Result Modal */}
      <Modal visible={showResult} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={["#FF1493", "#C71585", "#8B0040"]}
            style={styles.resultContainer}
          >
            <Text style={styles.resultEmoji}>💖✨💕</Text>
            <Text style={styles.resultTitle}>Happy Valentine's Day, Naman!</Text>
            <View style={styles.finalQuoteContainer}>
              <Text style={styles.finalQuoteText}>
                I hope to forever and always love you, with immense depth and joy. I love you to the moon and back, Naman 🌙✨
              </Text>
            </View>
            <Text style={styles.completionText}>
              ✨ You've completed all 8 days! ✨
            </Text>
            <Text style={styles.replayText}>
              You can now replay any day anytime! 😊
            </Text>
            <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
              <Text style={styles.continueButtonText}>Back to Home</Text>
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
  },
  content: {
    flex: 1,
    paddingTop: 50,
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: 50,
    zIndex: 10,
  },
  mainContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#C71585",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    color: "#8B0040",
    fontWeight: "600",
    marginBottom: 40,
  },
  imageContainer: {
    width: width * 0.85,
    height: width * 0.85,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 4,
    borderColor: "#FFFFFF",
    marginBottom: 40,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  coupleImage: {
    width: "100%",
    height: "100%",
  },
  revealButton: {
    borderRadius: 30,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  buttonGradient: {
    paddingHorizontal: 40,
    paddingVertical: 16,
  },
  revealButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    alignItems: "center",
    justifyContent: "center",
  },
  resultContainer: {
    width: width * 0.9,
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
    marginBottom: 24,
    textAlign: "center",
  },
  finalQuoteContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  finalQuoteText: {
    fontSize: 18,
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 28,
    fontStyle: "italic",
  },
  completionText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  replayText: {
    fontSize: 14,
    color: "#FFE5F0",
    marginBottom: 24,
    textAlign: "center",
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