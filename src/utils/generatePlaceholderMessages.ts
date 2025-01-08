import {PlaceholderMessage} from "../types/message.ts";

export const generatePlaceholderMessages = (amount: number): PlaceholderMessage[] => {
    return new Array(Math.max(0, amount))
}