import { getBookShelfCount, getCurrentlyReadingCount, getToReadCount } from "@/utils/stats";
import { useEffect, useState } from "react";

import { StyleSheet, Text, View } from "react-native";

export default function ReaderStats(){

    const [booksToRead, setBooksToRead] = useState(0);
    const [currentlyReading, setCurrentlyReading] = useState(0);
    const [read, setRead] = useState(0);

    useEffect(() => {
    const fetchCounts = async () => {
        const readingCount = await getCurrentlyReadingCount();
        const toreadCount = await getToReadCount();
        const shelfCount = await getBookShelfCount();

        // update state
        setBooksToRead(toreadCount);
        setCurrentlyReading(readingCount);
        setRead(shelfCount);

    };

    fetchCounts();
    }, []);

    return(
      <View style={styles.statsSection}>
        <Text style={styles.statsTitle}>Your Reading Stats</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{read}</Text>
            <Text style={styles.statLabel}>Books Read</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{currentlyReading}</Text>
            <Text style={styles.statLabel}>Currently Reading</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{booksToRead}</Text>
            <Text style={styles.statLabel}>Books To Read</Text>
          </View>
        </View>
      </View>

    )
}

const styles = StyleSheet.create({
    statsSection: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 10,
        marginBottom: 10,
        marginHorizontal: 16,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    statsTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#5d4037",
        marginBottom: 12,
        textAlign: "center",
    },
    statsRow: {
        flexDirection: "row",
        justifyContent: "space-around",
    },
    statItem: {
        alignItems: "center",
    },
    statNumber: {
        fontSize: 22,
        fontWeight: "800",
        color: "#85B79D",
    },
    statLabel: {
        fontSize: 12,
        color: "#3e2c22",
        marginTop: 4,
    }
})
