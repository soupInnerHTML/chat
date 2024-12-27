import {Query} from "../../__generated__/resolvers-types.ts";

export function getMessages(query: Query | undefined) {
    return query ? query.messages.edges.map(({ node }) => node) : []
}