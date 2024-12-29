import {InMemoryCache, Reference} from "@apollo/client";
import {ReadFieldFunction} from "@apollo/client/cache/core/types/common";
import {getActualMessage} from "./getActualMessage.ts";

export const mergeMessageCache = (incoming: Reference, readField: ReadFieldFunction, cache: InMemoryCache) => {
    const updatedAt = readField("updatedAt", incoming) as string;

    return getActualMessage({
        existing: {
            cache,
            id: incoming.__ref
        },
        incoming: {
            returnIncoming: incoming,
            updatedAt
        }
    })
}
