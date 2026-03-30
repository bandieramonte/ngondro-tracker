import NetInfo from "@react-native-community/netinfo";

let isOnline = true;
let listeners: (() => void)[] = [];

export function initializeNetworkListener() {
    NetInfo.addEventListener((state) => {
        isOnline = !!state.isConnected;

        listeners.forEach((l) => l());
    });
}

export function getIsOnline() {
    return isOnline;
}

export function subscribeOnline(callback: () => void) {
    listeners.push(callback);
    return () => {
        listeners = listeners.filter((l) => l !== callback);
    };
}