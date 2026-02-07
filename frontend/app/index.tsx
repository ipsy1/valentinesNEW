import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { api } from "../utils/api";
import { UserProgress } from "../types";

const { width } = Dimensions.get("window");

const valentineDays = [
  { number: 1, name: "Rose Day", date: "Feb 7", icon: "rose", route: "/day1" },
  { number: 2, name: "Propose Day", date: "Feb 8", icon: "heart", route: "/day2" },
  { number: 3, name: "Chocolate Day", date: "Feb 9", icon: "cafe", route: "/day3" },
  { number: 4, name: "Teddy Day", date: "Feb 10", icon: "teddy-bear", route: "/day4" },
  { number: 5, name: "Promise Day", date: "Feb 11", icon: "hand-right", route: "/day5" },
  { number: 6, name: "Hug Day", date: "Feb 12", icon: "happy", route: "/day6" },
  { number: 7, name: "Kiss Day", date: "Feb 13", icon: "heart-circle", route: "/day7" },
  { number: 8, name: "Valentine's Day", date: "Feb 14", icon: "heart-circle-sharp", route: "/day8" },
];

export default function Index() {
  const router = useRouter();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const data = await api.getProgress();
      setProgress(data);
    } catch (error) {
      console.error("Failed to load progress:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDayPress = (dayNumber: number, route: string, isUnlocked: boolean) => {
    if (isUnlocked) {
      router.push(route);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFC0CB" />
        <Text style={styles.loadingText}>Loading Valentine's Week...</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={["#000000", "#1a1a1a", "#2d0a1f"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>💕 Valentine's Week 💕</Text>
          <Text style={styles.subtitle}>For My Love, Naman</Text>
          {progress?.replay_mode && (
            <View style={styles.replayBadge}>
              <Text style={styles.replayText}>🎮 Replay Mode Active!</Text>
            </View>
          )}
        </View>

        <View style={styles.daysContainer}>
          {valentineDays.map((day, index) => {
            const dayProgress = progress?.days[index];
            const isUnlocked = dayProgress?.is_unlocked || false;
            const isCompleted = dayProgress?.is_completed || false;

            return (
              <TouchableOpacity
                key={day.number}
                style={[
                  styles.dayCard,
                  !isUnlocked && styles.dayCardLocked,
                ]}
                onPress={() => handleDayPress(day.number, day.route, isUnlocked)}
                disabled={!isUnlocked}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={
                    !isUnlocked
                      ? ["#2a2a2a", "#1a1a1a"]
                      : isCompleted
                      ? ["#FFC0CB", "#FF85B3"]
                      : ["#3d1a2e", "#2d0a1f"]
                  }
                  style={styles.cardGradient}
                >
                  <View style={styles.cardContent}>
                    <View style={[
                      styles.iconContainer,
                      isUnlocked && styles.iconContainerUnlocked
                    ]}>
                      {!isUnlocked ? (
                        <Ionicons name="lock-closed" size={40} color="#555555" />
                      ) : (
                        <Ionicons name={day.icon as any} size={40} color="#FFC0CB" />
                      )}
                    </View>

                    <View style={styles.cardTextContainer}>
                      <Text style={[styles.dayName, !isUnlocked && styles.dayNameLocked]}>
                        {day.name}
                      </Text>
                      <Text style={[styles.dayDate, !isUnlocked && styles.dayDateLocked]}>
                        {day.date}
                      </Text>
                    </View>

                    {isCompleted && (
                      <View style={styles.completedBadge}>
                        <Ionicons name="checkmark-circle" size={24} color="#FFD700" />
                      </View>
                    )}
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Complete each day's puzzle to unlock the next! 🎁
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#FFC0CB",
    fontWeight: "600",
  },
  scrollContent: {
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFC0CB",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#FFB6D9",
    fontWeight: "600",
    fontStyle: "italic",
  },
  replayBadge: {
    marginTop: 16,
    backgroundColor: "#FFC0CB",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  replayText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  daysContainer: {
    gap: 16,
  },
  dayCard: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#FFC0CB",
  },
  dayCardLocked: {
    borderColor: "#333333",
  },
  cardGradient: {
    padding: 20,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  iconContainerUnlocked: {
    backgroundColor: "rgba(255, 20, 147, 0.2)",
  },
  cardTextContainer: {
    flex: 1,
  },
  dayName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  dayNameLocked: {
    color: "#666666",
  },
  dayDate: {
    fontSize: 16,
    color: "#FFB6D9",
  },
  dayDateLocked: {
    color: "#555555",
  },
  completedBadge: {
    marginLeft: 8,
  },
  footer: {
    marginTop: 32,
    padding: 16,
    backgroundColor: "rgba(255, 20, 147, 0.1)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FFC0CB",
  },
  footerText: {
    fontSize: 14,
    color: "#FFB6D9",
    textAlign: "center",
    fontWeight: "600",
  },
});
