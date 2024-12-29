import css from "./ChatInput.module.css";
import {useSendMessageMutation} from "../../../graphql/hooks/useSendMessageMutation.ts";
import React, {FormEventHandler, memo, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPaperPlane} from "@fortawesome/free-solid-svg-icons";

export const ChatInput: React.FC = memo(() => {
    const {sendMessage} = useSendMessageMutation()
    const [messageText, setMessageText] = useState("");

    const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        setMessageText("")
        await sendMessage(messageText);
    }

    const disabled = !messageText.trim()

    return (
        <form onSubmit={onSubmit} className={css.sendForm}>
            <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className={css.textInput}
                placeholder="Message text"
            />
            <button
                type={"submit"}
                disabled={disabled}
                className={css.sendButton}
            >
                <FontAwesomeIcon icon={faPaperPlane} />
            </button>
        </form>
    );
});

