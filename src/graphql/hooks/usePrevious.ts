import {useEffect, useRef} from "react";

interface UsePreviousReturn<T> {
    isSame: boolean;
    previous: T | undefined;
}

export function usePrevious<T extends unknown[]>(value: T): UsePreviousReturn<T> {
    const ref = useRef<T>();

    useEffect(() => {
        ref.current = value;
    }, [value]);

    const isSame = JSON.stringify(ref.current) === JSON.stringify(value)

    return {isSame, previous: ref.current};
}

export default usePrevious;
