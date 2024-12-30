import {useMessagesCountQuery} from "./useMessagesCountQuery.ts";
import {useQuery} from "@apollo/client";
import {Query} from "../../../__generated__/resolvers-types.ts";
import {GET_MESSAGES} from "../queries";
import {MESSAGES_LIMIT} from "../params.ts";
import {useMemo} from "react";
import {getMessages} from "../../utils";
import {debounce} from "lodash-es";

export function useMessagesQuery() {
    const totalMessagesCount = useMessagesCountQuery()
    const { loading, data, fetchMore } = useQuery<Query>(GET_MESSAGES, {
        variables: { after: String(totalMessagesCount - MESSAGES_LIMIT)},
        skip: !totalMessagesCount,
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'cache-first',
    });

    const messagesLength = data?.messages.edges.length ?? 0
    const messages = useMemo(() => getMessages(data), [messagesLength]);

    const loadMoreMessages = (startCursor: number) => {
        fetchMore({
            variables: {
                after: String(startCursor - MESSAGES_LIMIT - 1),
                first: Math.min(MESSAGES_LIMIT, startCursor)
            },
            updateQuery: (previousQueryResult, {fetchMoreResult}) => {
                if (!fetchMoreResult) return previousQueryResult;

                return {
                    messages: {
                        ...fetchMoreResult.messages,
                        edges: [
                            ...fetchMoreResult.messages.edges,
                            ...previousQueryResult.messages.edges,
                        ],
                        pageInfo: {
                            ...fetchMoreResult.messages.pageInfo,
                            endCursor: previousQueryResult.messages.pageInfo.endCursor,
                            startCursor: fetchMoreResult.messages.pageInfo.startCursor,
                        },
                    },
                };
            },
        });
    };

    const loadMoreMessagesDebounced = useMemo(() => (
        debounce((startCursor) => {
            loadMoreMessages(startCursor)
        }, 50)
    ), [])

    return {
        loading: loading || !messages.length,
        messages,
        pageInfo: data?.messages.pageInfo,
        loadMoreMessages: loadMoreMessagesDebounced
    }
}