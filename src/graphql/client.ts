import {ApolloClient, ApolloLink, HttpLink, InMemoryCache, split} from "@apollo/client";
import {GraphQLWsLink} from "@apollo/client/link/subscriptions";
import {getMainDefinition} from "@apollo/client/utilities";
import {createClient} from "graphql-ws";
import {LocalStorageWrapper, persistCache} from "apollo3-cache-persist";
import {readActualMessages, mergeMessageCache} from "../utils";
import {errorLink, handleRecurringCustomerMessagesLink} from "./links";

const PORT = 4000;

const httpLink = new HttpLink({
  uri: (operation) =>
    `http://localhost:${PORT}/graphql?op=${operation.operationName}`,
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: `ws://localhost:${PORT}/graphql`,
  })
);

const link = ApolloLink.from([
    handleRecurringCustomerMessagesLink(),
    errorLink,
    split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === "OperationDefinition" &&
          definition.operation === "subscription"
        );
      },
      wsLink,
      httpLink
    )
]);

export const createApolloClient = async () => {

    const cache = new InMemoryCache();

    await persistCache({
        cache,
        storage: new LocalStorageWrapper(window.localStorage),
    })

    cache.policies.addTypePolicies({
        Query: {
            fields: {
                messages: {
                    keyArgs: false,
                    read(existing, {cache}) {
                        return readActualMessages(existing, cache)
                    }
                },
            },
        },
        Message: {
            merge(_, incoming, {readField, cache}) {
                return mergeMessageCache(incoming, readField, cache)
            },
        },
    })

    return new ApolloClient({
        link,
        cache,
    });
};
