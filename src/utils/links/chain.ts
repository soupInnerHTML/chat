import {ApolloLink, Operation} from "@apollo/client";
import {Query} from "../../../__generated__/resolvers-types.ts";

export function chain() {
    return new ApolloLink((operation: Operation, forward) => {
        if(operation.operationName === 'GetMessages') {
            return forward(operation).map((response) => {
                // TODO fix types
                response.data.messages.chain = (response.data as Query).messages.edges.map(edge => edge.node.id).join(`-`)
                return response
            });
        }
        return forward(operation)
    });
}