import axios from 'axios';

const api = axios.create({
    // baseURL: 'https://simplesitebackend.ddns.net',
    baseURL: 'http://127.0.0.1:8000/'
});


const profanityCall = async (message) => {
    try {
        const response = await fetch('https://vector.profanity.dev', {

            method: 'POST',

            headers: { 'Content-Type': 'application/json' },

            body: JSON.stringify({ message }),

        });

        if (!response.ok) {
            throw new Error('Error getting ok response');
        }

        const result = await response.json();
        return result["score"];
    } catch (error) {
        console.error('Error in profanity checking process',error);
        throw new Error(error);
    }
}

export { profanityCall }
export default api;