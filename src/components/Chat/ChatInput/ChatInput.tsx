import css from "../Chat.module.css";
import {useSendMessageMutation} from "../../../graphql/hooks/useSendMessageMutation.ts";
import {FormEventHandler, useState} from "react";

export const ChatInput = () => {
    const {sendMessage, loading} = useSendMessageMutation()
    const [messageText, setMessageText] = useState<string>("");

    const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        await sendMessage({variables: {text: messageText}});
        setMessageText("")
    }

    const disabled = loading || !messageText.trim()

    return (
        <form onSubmit={onSubmit} className={css.footer}>
            <input
                title="Please enter a valid message. It cannot be empty or consist only of spaces."
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className={css.textInput}
                placeholder="Message text"
            />
            <button disabled={disabled}>Send</button>
        </form>
    );
};

