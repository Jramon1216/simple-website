import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from '../styles/Home.module.scss'

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/',
})

export default function Home() {
    const [sentMessage, setSentMessage] = useState('');
    const [receivedMessages, setReceivedMessages] = useState([]);
    const [error, setError] = useState(null);

    const receiveMessage = async () => {
        return new Promise((resolve, reject) => {
            api.get('/receive/')
                .then(response => {
                    console.log('Receiving message...')
                    const receivedMessage = response.data['RECEIVED MESSAGE'];
                    setReceivedMessages(prevMessages => [...prevMessages, { text: receivedMessage, type: 'received' }]);
                    console.log('Message received!')
                    resolve(response.data)
                })
                .catch(error => {
                    console.error('Error fetching data: ', error)
                    setError(error)
                    reject(error)
                });
        });
    };

    const sendMessage = async () => {
        return new Promise((resolve, reject) => {
            api.post('/send/', { "user_message": sentMessage })
                .then(response => {
                    console.log(`Sending user message:'${sentMessage}'...`)
                    setReceivedMessages(prevMessages => [...prevMessages, { text: sentMessage, type: 'sent' }]);
                    setSentMessage('');
                    console.log('Message sent successfully!')
                    resolve(response.status)
                })
                .catch(error => {
                    console.error('Error sending data: ', error);
                    setError(error);
                    reject(error)
                })
        });
    };

    const handleInputChange = (e) => {
        setSentMessage(e.target.value);
    };

    const handleSendClick = async () => {
        try {
            await sendMessage();
        } catch (error) {
            setError(error);
        }
    };

    const handleReceiveClick = async () => {
        try {
            await receiveMessage();
        } catch (error) {
            setError(error);
        }
    };

    return (
        <>
            <h1>Send a message!</h1>
            <form onSubmit={e => e.preventDefault()}>
                <input
                    type="text"
                    placeholder="Send a Message"
                    value={sentMessage}
                    onChange={handleInputChange}
                />
                <input type="button" value="Send" onClick={handleSendClick}></input>
                <input type="button" value="Receive" onClick={handleReceiveClick}></input>

            </form>
            {error && <div>Error: {error.message}</div>}
            <div>
                {receivedMessages.map((msg, index) => (
                    <div key={index} className={msg.type === 'sent' ? styles.sent : styles.received}>
                        {msg.text}
                    </div>
                ))}
            </div>
        </>
    )
}