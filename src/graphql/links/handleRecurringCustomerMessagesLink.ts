import {Message, MessageSender} from "../../../__generated__/resolvers-types.ts";
import {ApolloLink, Operation} from "@apollo/client";
import {v4 as uuid} from 'uuid'

export function generateRecurringCustomerMessageId({id, sender}: Message): string {
    const hash = uuid()
    return `${id}-${sender}-${hash}`
}

export function handleRecurringCustomerMessagesLink() {
    return new ApolloLink((operation: Operation, forward) => {
        if (operation.operationName === 'OnMessageAdded') {
            return forward(operation).map((response) => {
                if (response.data) {
                    if ("messageAdded" in response.data &&
                        response.data.messageAdded &&
                        response.data.messageAdded.sender === MessageSender.Customer
                    ) {
                        response.data.messageAdded = {
                            ...response.data.messageAdded,
                            id: generateRecurringCustomerMessageId(response.data.messageAdded)
                        };
                    }
                }
                return response;
            });
        }

        return forward(operation);
    });
}
