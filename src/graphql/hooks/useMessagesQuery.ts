import {useQuery} from "@apollo/client";
import {Query} from "../../../__generated__/resolvers-types.ts";
import {GET_MESSAGES} from "../queries";
import {MESSAGES_LIMIT} from "../params.ts";

export function useMessagesQuery(totalMessagesCount: number) {
    const { loading, data, fetchMore } = useQuery<Query>(GET_MESSAGES, {
        variables: {
            after: String(totalMessagesCount - MESSAGES_LIMIT),
            first: MESSAGES_LIMIT
        },
        skip: !totalMessagesCount,
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'cache-first',
    });

    return {
        loading,
        data,
        fetchMore
    }
}