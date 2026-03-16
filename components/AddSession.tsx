import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import * as sessionService from "../services/sessionService";

type Props = {
    practiceId: string;
    onSaved: () => void;
};

export default function AddSession({ practiceId, onSaved }: Props) {

    const [customValue, setCustomValue] = useState("");

    function addSession(count: number) {
        sessionService.addSession(practiceId, count);
        onSaved();
    }

    return (

        <View style={styles.container}>

            <Text style={styles.title}>Add repetitions</Text>

            <View style={styles.buttons}>
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
    );
}

const styles = StyleSheet.create({

    container: {
        marginTop: 30,
        padding: 10,
        borderTopWidth: 1,
        borderColor: "#ddd",
    },

    title: {
        fontSize: 18,
        marginBottom: 10,
    },

    buttons: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },

    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 8,
        marginBottom: 10,
    }

});