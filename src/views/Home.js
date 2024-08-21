import React, { useEffect, useState, useRef } from "react";
import classNames from "classnames";
import styles from '../styles/Home.module.scss'
import  api, { profanityCall } from '../api/api'

export default function Home() {
    const [sentMessage, setSentMessage] = useState('');
    const [receivedMessages, setReceivedMessages] = useState([]);
    const [errorMsg, setErrorMsg] = useState(null);
    const endOfMessagesRef = useRef(null);

    const receiveMessage = async () => {
        try {
            if (errorMsg) setErrorMsg(null)
            
            console.log('Receiving message...');
            const response = await api.get('/receive/')
            const receivedMessage = response.data['RECEIVED MESSAGE'];
            
            setReceivedMessages(prevMessages => [...prevMessages, { text: receivedMessage, type: 'received' }]);
            console.log('Message received!');
            
        } catch(error) {
            console.error('Error receiving message:', error);
            setErrorMsg(error.message || 'An unexpected error occurred please try again later')
        }
    };

    const sendMessage = async() => {
        try {
            if (errorMsg) setErrorMsg(null);

            console.log(`Sending user message "${sentMessage}"...`);
            const response = api.post('/send/', {"user_message": sentMessage});
            
            const msgScore = await profanityCall(sentMessage);
            if(msgScore < 0.8200) {
                setReceivedMessages(prevMessages => [...prevMessages, { text: sentMessage, type: 'sent' }]);
                setSentMessage('');
                console.log('Message sent successfully');
                return response.status
            } else {
                setErrorMsg('Please exclude any possible profanity in your message!!!');
                console.log('MESSAGE REJECTED');
                throw new Error('Possible profanity detected, rejecting message');
            }
        } catch(error) {
            console.error('Error sending message: ', error);
            setErrorMsg(error.message || 'An unexpected error occured please try again later');
            throw error
        }
    };

    const handleInputChange = (e) => {
        setSentMessage(e.target.value);
    };

    const handleSendClick = async () => {
        try {
            await sendMessage();
        } catch (error) {
            setErrorMsg(error);
        }
    };

    const handleReceiveClick = async () => {
        try {
            await receiveMessage();
        } catch (error) {
            setErrorMsg(error);
        }
    };

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [receivedMessages]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Send a message!</h1>
            </div>
            <hr />
            {errorMsg && <div>Error: {errorMsg}</div>}
            <div className={styles.chat}>
                {receivedMessages.map((msg, index) => (
                    <div key={index} className={msg.type === 'sent' ? styles.sent : styles.received}>
                        {msg.text}
                    </div>
                ))}
                <div ref={endOfMessagesRef} /> 
            </div>
                <hr/>
            <div className={styles.controls}>
                <form onSubmit={e => e.preventDefault()}>
                    <input type="button" value="Receive" onClick={handleReceiveClick} className={classNames(styles.buttons, styles.receiveButton)}/>
                    <input
                        type="text"
                        placeholder="Send a Message"
                        value={sentMessage}
                        onChange={handleInputChange}
                        className={styles.textBox}
                        minLength="1"
                        maxLength="100"
                    />
                    <input type="button" value="Send" onClick={handleSendClick} className={classNames(styles.buttons, styles.sendButton)} disabled={!sentMessage.trim()} />
                </form>
            </div>
        </div>
    );
};