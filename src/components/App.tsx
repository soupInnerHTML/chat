import {createApolloClient} from "../graphql/client.ts";
import {ApolloClient, ApolloProvider, NormalizedCacheObject} from "@apollo/client";
import React, {useEffect, useState} from "react";
import {Chat} from "./Chat";

export const App: React.FC = () => {
    const [client, setClient] = useState<ApolloClient<NormalizedCacheObject> | null>(null);
    useEffect(() => {
        createApolloClient()
            .then(_client => setClient(_client))
            .catch(error => {
                console.error("Apollo Client initialization failed:", error);
            });
    }, [])

    if(!client) {
        return <p>Loading...</p>
    }

    return (
        <ApolloProvider client={client}>
            <Chat />
        </ApolloProvider>
    )
}