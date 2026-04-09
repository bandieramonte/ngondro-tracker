import Constants from "expo-constants";
import { Stack } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function AboutScreen() {
    const version = Constants.expoConfig?.version ?? "1.0.0";

    return (
        <>
            <Stack.Screen options={{ title: "About" }} />

            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Ngöndro Tracker</Text>

                <Text style={styles.version}>Version {version}</Text>

                <Text style={styles.section}>
                    An app to track Ngöndro practice progress.
                </Text>

                <Text style={styles.section}>
                    This app is not affiliated with any official organization.
                </Text>

                <View style={styles.separator} />

                <Text style={styles.label}>Developer</Text>
                <Text style={styles.value}>
                    Gian Piero Bandieramonte
                </Text>

                <Text style={styles.label}>Contact</Text>
                <Text style={styles.value}>
                    gian@bandieramonte.com
                </Text>

            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        maxWidth: 700,
        alignSelf: "center",
        width: "100%",
    },

    title: {
        fontSize: 28,
        fontWeight: "700",
        marginBottom: 4,
    },

    version: {
        color: "#666",
        marginBottom: 20,
    },

    section: {
        marginBottom: 16,
        lineHeight: 20,
    },

    separator: {
        height: 1,
        backgroundColor: "#eee",
        marginVertical: 20,
    },

    label: {
        fontWeight: "600",
        marginTop: 12,
    },

    value: {
        color: "#444",
        marginTop: 4,
    },
});