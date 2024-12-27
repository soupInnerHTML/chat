import { gql } from "@apollo/client";

export const GET_MESSAGES = gql`
    query GetMessages($first: Int, $after: MessagesCursor) {
        messages(first: $first, after: $after) {
            edges {
                node {
                    id
                    text
                    status
                    updatedAt
                    sender
                }
                cursor
            }
            pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
            }
        }
    }
`;

export const GET_MESSAGES_COUNT = gql`
    query GetMessages {
        messages(first: -1) {
            edges {
                node {
                    id
                }
            }
        }
    }
`;
