import React from "react";
import styles from '../styles/Home.module.scss'


export default function Home() {
    return (
        <>
            <h1>Send a message!</h1>
            <form>
                <input type="text" placeholder="Send a Message"></input>
                <input type="submit" value="Send"></input>
            </form>
        </>
    )
}