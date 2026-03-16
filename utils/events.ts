type Callback = () => void;

let listeners: Callback[] = [];

export function subscribe(cb: Callback) {
    listeners.push(cb);
}

export function emit() {
    listeners.forEach(cb => cb());
}