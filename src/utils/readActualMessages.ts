import {Message, MessagePage} from "../../__generated__/resolvers-types.ts";
import {InMemoryCache} from '@apollo/client';
import {getActualMessage} from "./getActualMessage.ts";

interface MaybeCachedMessage extends Message {
    __ref?: string
}

export function readActualMessages(existing: MessagePage | undefined, cache: InMemoryCache) {
    if (!existing) {
        return existing;
    }

    const edges = existing.edges.map((edge) => {
        const maybeCachedMessage = edge.node as MaybeCachedMessage;
        const node = getActualMessage({
            existing: {
                cache,
                id: maybeCachedMessage.__ref ?? `Message:${maybeCachedMessage.id}`,
            },
            incoming: {
                returnIncoming: edge.node,
                updatedAt: edge.node?.updatedAt,
            }
        })

        return {
            ...edge,
            node,
        };
    });

    return {
        ...existing,
        edges,
    };
}