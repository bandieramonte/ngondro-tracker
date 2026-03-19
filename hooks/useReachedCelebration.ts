import { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";

export function useReachedCelebration() {
    const previousReachedRef = useRef<Record<string, boolean>>({});
    const celebrationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const sparkleAnimationsRef = useRef<Animated.CompositeAnimation[]>([]);
    const [celebratingId, setCelebratingId] = useState<string | null>(null);

    const celebrationFade = useRef(new Animated.Value(1)).current;
    const sparkle1 = useRef(new Animated.Value(0)).current;
    const sparkle2 = useRef(new Animated.Value(0)).current;
    const sparkle3 = useRef(new Animated.Value(0)).current;

    function stopAnimations() {
        sparkleAnimationsRef.current.forEach(animation => animation.stop());
        sparkleAnimationsRef.current = [];
    }

    function resetAnimatedValues() {
        celebrationFade.setValue(1);
        sparkle1.setValue(0);
        sparkle2.setValue(0);
        sparkle3.setValue(0);
    }

    function startCelebration(id: string) {
        if (celebrationTimeoutRef.current) {
            clearTimeout(celebrationTimeoutRef.current);
        }

        stopAnimations();

        setCelebratingId(id);
        resetAnimatedValues();

        const makeSparkle = (value: Animated.Value, delay: number) =>
            Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(value, {
                        toValue: 1,
                        duration: 900,
                        useNativeDriver: true,
                    }),
                    Animated.timing(value, {
                        toValue: 0,
                        duration: 900,
                        useNativeDriver: true,
                    }),
                ])
            );

        const a1 = makeSparkle(sparkle1, 0);
        const a2 = makeSparkle(sparkle2, 180);
        const a3 = makeSparkle(sparkle3, 360);

        sparkleAnimationsRef.current = [a1, a2, a3];

        a1.start();
        a2.start();
        a3.start();

        celebrationTimeoutRef.current = setTimeout(() => {
            Animated.timing(celebrationFade, {
                toValue: 0,
                duration: 2000,
                useNativeDriver: true,
            }).start(() => {
                stopAnimations();
                setCelebratingId(null);

                setTimeout(() => {
                    resetAnimatedValues();
                }, 0);
            });
        }, 3000);
    }

    function updateReachedState(items: { id: string; reached: boolean }[]) {
        const nextReachedMap: Record<string, boolean> = {};

        for (const item of items) {
            const reachedBefore = previousReachedRef.current[item.id] ?? false;
            nextReachedMap[item.id] = item.reached;

            if (item.reached && !reachedBefore) {
                startCelebration(item.id);
            }
        }

        previousReachedRef.current = nextReachedMap;
    }

    function isCelebrating(id: string) {
        return celebratingId === id;
    }

    useEffect(() => {
        return () => {
            if (celebrationTimeoutRef.current) {
                clearTimeout(celebrationTimeoutRef.current);
            }

            stopAnimations();
        };
    }, []);

    return {
        celebrationFade,
        sparkle1,
        sparkle2,
        sparkle3,
        updateReachedState,
        isCelebrating,
    };
}