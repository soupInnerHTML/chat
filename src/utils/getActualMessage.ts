import {Message} from "../../__generated__/resolvers-types.ts";
import {gql, InMemoryCache, Reference} from "@apollo/client";
import {getTimestamp} from "./getTimestamp.ts";

interface Existed {
    id: string
    cache: InMemoryCache,
}

interface Incoming {
    updatedAt: string
    returnIncoming: Message | Reference
}

interface GetActualMessageParams {
    existing: Existed
    incoming: Incoming
}

export function getActualMessage({
    existing,
    incoming,
}: GetActualMessageParams) {
    const cachedMessage: Message | null = existing.cache.readFragment({
        id: existing.id,
        fragment: gql`
            fragment MessageData on Message {
                id
                updatedAt
                sender
                text
                status
            }
        `
    });

    const cachedMessageDate = cachedMessage ? getTimestamp(cachedMessage.updatedAt) : 0;
    const incomingDate = incoming.updatedAt ? getTimestamp(incoming.updatedAt) : 0
    return cachedMessageDate >= incomingDate ? cachedMessage : incoming.returnIncoming;

}