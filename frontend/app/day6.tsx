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
import Svg, { Path } from "react-native-svg";
import { api } from "../utils/api";

const { width, height } = Dimensions.get("window");

interface Point {
  x: number;
  y: number;
}

export default function Day6() {
  const router = useRouter();
  const [points, setPoints] = useState<Point[]>([]);
  const [showResult, setShowResult] = useState(false);

  const handleTouch = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    const newPoints = [...points, { x: locationX, y: locationY }];
    setPoints(newPoints);

    if (newPoints.length >= 20) {
      setTimeout(() => {
        completeDay();
      }, 500);
    }
  };

  const resetDrawing = () => {
    setPoints([]);
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

  const createPath = () => {
    if (points.length === 0) return "";
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }
    return path;
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#FFE5F0", "#FFB6D9"]} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#C71585" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🤗 Hug Day</Text>
        <Text style={styles.progress}>Points: {points.length} / 20</Text>
      </LinearGradient>

      <View style={styles.gameContainer}>
        <Text style={styles.instructions}>Draw a big hug! Draw anywhere to create a pattern! 🤗</Text>

        <View style={styles.canvasContainer} onTouchMove={handleTouch}>
          <Svg height="100%" width="100%">
            <Path
              d={createPath()}
              stroke="#FF1493"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>

        <TouchableOpacity style={styles.resetButton} onPress={resetDrawing}>
          <Text style={styles.resetButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>

      {/* Result Modal */}
      <Modal visible={showResult} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={["#FF69B4", "#FF1493"]}
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
  canvasContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 3,
    borderColor: "#FF69B4",
    overflow: "hidden",
  },
  resetButton: {
    marginTop: 16,
    backgroundColor: "#FF1493",
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
  },
  resetButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
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