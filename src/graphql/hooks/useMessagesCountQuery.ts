import {useQuery} from "@apollo/client";
import {GET_MESSAGES_COUNT} from "../queries/getMessages.ts";
import {Query} from "../../../__generated__/resolvers-types.ts";

export const useMessagesCountQuery = () => {
    const {data, loading} = useQuery<Partial<Query>>(GET_MESSAGES_COUNT, {
        fetchPolicy: 'no-cache',
    })
    // +1 потому что GET_MESSAGES_COUNT загружает все элементы, кроме последнего
    // messages(first: -1)
    return loading ? 0 : (data?.messages?.edges.length ?? 0) + 1
}