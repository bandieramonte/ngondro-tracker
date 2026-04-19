import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

type Anchor = {
    x: number;
    y: number;
    width: number;
    height: number;
};

type Props = {
    visible: boolean;
    anchor: Anchor | null;
    onClose: () => void;
    onEdit: () => void;
    onHistory: () => void;
    onDelete: () => void;
};

export default function PracticeDropdownMenu({
    visible,
    anchor,
    onClose,
    onEdit,
    onHistory,
    onDelete,
}: Props) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable
                style={styles.overlay}
                onPress={onClose}
            >
                {anchor && (
                    <View
                        style={[
                            styles.menu,
                            {
                                top:
                                    anchor.y +
                                    anchor.height +
                                    8,
                                left: Math.max(
                                    20,
                                    anchor.x +
                                    anchor.width /
                                    2 -
                                    110
                                ),
                            },
                        ]}
                    >
                        <Pressable
                            style={styles.item}
                            onPress={onEdit}
                        >
                            <MaterialIcons
                                name="edit"
                                size={18}
                                color="#333"
                            />
                            <Text style={styles.text}>
                                Edit practice
                            </Text>
                        </Pressable>

                        <Pressable
                            style={styles.item}
                            onPress={onHistory}
                        >
                            <MaterialIcons
                                name="show-chart"
                                size={18}
                                color="#333"
                            />
                            <Text style={styles.text}>
                                Practice history
                            </Text>
                        </Pressable>

                        <Pressable
                            style={styles.item}
                            onPress={onDelete}
                        >
                            <MaterialIcons
                                name="delete-outline"
                                size={18}
                                color="#c62828"
                            />
                            <Text
                                style={styles.deleteText}
                            >
                                Delete practice
                            </Text>
                        </Pressable>
                    </View>
                )}
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
    },

    menu: {
        position: "absolute",
        width: 220,
        backgroundColor: "white",
        borderRadius: 10,
        paddingVertical: 6,
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        elevation: 8,
    },

    item: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingVertical: 12,
        paddingHorizontal: 14,
    },

    text: {
        fontSize: 15,
        color: "#333",
    },

    deleteText: {
        fontSize: 15,
        color: "#c62828",
    },
});