import {gql} from "@apollo/client";

export const MESSAGE_ADDED_SUBSCRIPTION = gql`
    subscription OnMessageAdded {
        messageAdded {
            id
            text
            status
            updatedAt
            sender
        }
    }
`;

export const MESSAGE_UPDATED_SUBSCRIPTION = gql`
    subscription OnMessageUpdated {
        messageUpdated {
            id
            text
            status
            updatedAt
            sender
        }
    }
`;
