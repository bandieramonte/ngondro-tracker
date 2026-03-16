import { useFocusEffect } from "@react-navigation/native";
import * as Localization from "expo-localization";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, Button, Dimensions, FlatList, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import Svg, { Line, Rect, Text as SvgText } from "react-native-svg";
import * as practiceService from "../../services/practiceService";
import * as sessionService from "../../services/sessionService";

type Session = {
    id: string;
    count: number;
    createdAt: number;
};

export default function PracticeDetail() {

    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [practiceName, setPracticeName] = useState("");
    const [sessions, setSessions] = useState<Session[]>([]);
    const [total, setTotal] = useState(0);
    const [customValue, setCustomValue] = useState("");
    const [viewMode, setViewMode] = useState<"chart" | "table">("chart");
    const [rangeDays, setRangeDays] = useState(10);
    const [dailyData, setDailyData] = useState<
        { date: string; total: number }[]
    >([]);

    useFocusEffect(
        useCallback(() => {

            const name = practiceService.getPracticeName(id as string);

            if (name) {
                setPracticeName(name);
            }

            loadSessions();
            loadDailyData(rangeDays);
        }, [rangeDays])
    );

    useEffect(() => {
        loadSessions();
    }, []);

    function loadSessions() {

        const rows = sessionService.getSessionsForPractice(id as string) as Session[];
        setSessions(rows);

        const total = rows.reduce((sum, s) => sum + s.count, 0);
        setTotal(total);
    }

    function addSession(count: number) {
        sessionService.addSession(id as string, count);
        loadSessions();
        loadDailyData(rangeDays);
    }

    function confirmDelete() {

        Alert.alert(
            "Delete practice?",
            "All sessions for this practice will also be deleted.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: deletePractice
                }
            ]
        );

    }

    function deletePractice() {

        practiceService.deletePractice(id as string);
        router.replace("/");

    }

    function loadDailyData(days: number) {

        const data = sessionService.getDailyPracticeData(
            id as string,
            days
        );
        setDailyData(data);

    }


    function formatShortDate(dateString: string) {

        const d = new Date(dateString + "T00:00:00");
        const locale = Localization.getLocales()[0];

        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");

        // If locale region is US → month/day
        if (locale.regionCode === "US") {
            return `${month}/${day}`;
        }

        // Everywhere else → day/month
        return `${day}/${month}`;
    }

    function renderChart() {

        const width = Dimensions.get("window").width - 40;
        const height = 220;

        const padding = { top: 10, bottom: 30, left: 30, right: 10 };

        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;

        const values = dailyData.map(d => d.total);
        const maxValue = Math.max(...values, 1);

        const barWidth = chartWidth / dailyData.length;

        const labelCount = 4;
        const step = Math.max(1, Math.ceil(dailyData.length / labelCount));

        const yScale = (value: number) =>
            (value / maxValue) * chartHeight;

        return (
            <Svg width={width} height={height}>

                {/* grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
                    const y = padding.top + chartHeight * (1 - p);

                    return (
                        <Line
                            key={i}
                            x1={padding.left}
                            x2={width - padding.right}
                            y1={y}
                            y2={y}
                            stroke="#ddd"
                            strokeDasharray="3,3"
                        />
                    );
                })}

                {/* bars */}
                {dailyData.map((d, i) => {

                    const barHeight = yScale(d.total);

                    const x = padding.left + i * barWidth;
                    const y = padding.top + chartHeight - barHeight;

                    return (
                        <Rect
                            key={d.date}
                            x={x}
                            y={y}
                            width={barWidth * 0.7}
                            height={barHeight}
                            fill="#3b82f6"
                        />
                    );
                })}

                {/* x-axis labels */}
                {dailyData.map((d, i) => {

                    if (i % step !== 0 && i !== dailyData.length - 1) return null;

                    const x = padding.left + i * barWidth + barWidth * 0.35;

                    return (
                        <SvgText
                            key={`label-${i}`}
                            x={x}
                            y={height - 10}
                            fontSize="10"
                            textAnchor="middle"
                            fill="#444"
                        >
                            {formatShortDate(d.date)}
                        </SvgText>
                    );
                })}

            </Svg>
        );
    }

    function renderTable() {
        return (
            <FlatList
                data={dailyData}
                keyExtractor={(item) => item.date}
                renderItem={({ item }) => (
                    <View style={styles.row}>
                        <Text>
                            {new Date(item.date + "T00:00:00").toLocaleDateString()}
                        </Text>
                        <Text>{item.total}</Text>
                    </View>
                )}
                scrollEnabled={false}
            />
        );
    }

    return (

        <ScrollView
            style={styles.container}
            contentContainerStyle={{ paddingBottom: 40 }}
        >
            <Text style={styles.title}>
                {practiceName}
            </Text>

            <Text style={styles.total}>
                Total: {total}
            </Text>

            <View style={{ flexDirection: "row", gap: 10, marginBottom: 20 }}>

                <Button
                    title="Edit"
                    onPress={() =>
                        router.push({
                            pathname: "/edit-practice",
                            params: {
                                id,
                                practiceName
                            }
                        })
                    }
                />

                <Button
                    title="Delete"
                    color="red"
                    onPress={confirmDelete}
                />

            </View>

            <View style={styles.addSection}>

                <Text style={styles.sectionTitle}>
                    Add repetitions
                </Text>

                <View style={styles.buttonRow}>
                    <Button title="+1" onPress={() => addSession(1)} />
                    <Button title="+27" onPress={() => addSession(27)} />
                    <Button title="+108" onPress={() => addSession(108)} />
                </View>

                <TextInput
                    placeholder="Custom count"
                    keyboardType="numeric"
                    value={customValue}
                    onChangeText={setCustomValue}
                    style={styles.input}
                />

                <Button
                    title="Add custom"
                    onPress={() => addSession(Number(customValue))}
                />

            </View>

            <Text style={styles.total}>
                Practice History
            </Text>
            <View style={{ flexDirection: "row", gap: 10, marginBottom: 20 }}>

                <Button
                    title="Chart"
                    onPress={() => setViewMode("chart")}
                />

                <Button
                    title="Table"
                    onPress={() => setViewMode("table")}
                />

            </View>

            <View style={{ flexDirection: "row", gap: 10, marginBottom: 20 }}>
                <Button title="10d" onPress={() => { setRangeDays(10); loadDailyData(10); }} />
                <Button title="30d" onPress={() => { setRangeDays(30); loadDailyData(30); }} />
                <Button title="90d" onPress={() => { setRangeDays(90); loadDailyData(90); }} />
            </View>

            {dailyData.every(d => d.total === 0)
                ? <Text>No practice recorded in this period.</Text>
                : (
                    <View key={dailyData.length}>
                        {viewMode === "chart"
                            ? renderChart()
                            : renderTable()
                        }
                    </View>
                )
            }

        </ScrollView>
    );
}

const styles = StyleSheet.create({

    container: {
        padding: 20,
        marginTop: 60
    },

    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20
    },

    total: {
        fontSize: 18,
        marginBottom: 20
    },

    sectionTitle: {
        fontSize: 16,
        marginBottom: 10
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 6
    },

    addSection: {
        marginBottom: 30
    },

    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10
    },

    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 8,
        marginBottom: 10
    },

});