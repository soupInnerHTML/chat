import {useMessagesCountQuery} from "./useMessagesCountQuery.ts";
import {ApolloError, useQuery} from "@apollo/client";
import {Query} from "../../../__generated__/resolvers-types.ts";
import {GET_MESSAGES} from "../queries/getMessages.ts";
import {MESSAGES_LIMIT} from "../constants.ts";
import {useMemo, useState} from "react";
import {getMessages} from "../../utils/getMessages.ts";
import {debounce} from "lodash-es";

export function useMessagesQuery() {
    const totalMessagesCount = useMessagesCountQuery()
    const [error, setError] = useState<null | string>(null)

    const { loading, data, fetchMore } = useQuery<Query>(GET_MESSAGES, {
        variables: { after: String(totalMessagesCount - MESSAGES_LIMIT)},
        skip: !totalMessagesCount,
        notifyOnNetworkStatusChange: true,
        onError: e => setError(e.message),
        fetchPolicy: 'cache-first',
    });

    // TODO fix: use chain
    const messages = useMemo(() => getMessages(data), [data]);

    const loadMoreMessages = async (startCursor: number) => {
        try {
            setError(null)
            await fetchMore({
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
        } catch (error) {
            setError((error as ApolloError).message);
        }
    };

    const loadMoreMessagesDebounced = useMemo(() => debounce((startCursor) => {
        loadMoreMessages(startCursor)
    }, 50), [])


    return {
        loading: loading || !messages.length,
        error,
        setError,
        messages,
        pageInfo: data?.messages.pageInfo,
        loadMoreMessages: loadMoreMessagesDebounced
    }
}