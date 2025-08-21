import axios from "axios"
import http from "http"

class Client{
    url: string = "" 
    timeout: number = 30000
    agent: http.Agent = new http.Agent({
        keepAlive: false,
        maxSockets: 10,
    });

    constructor(value: string) {
        this.url = value;
    }

    async userMessage(message: string, sessionId: string): Promise<any> {
        try {
            const response = await axios.post(
                this.url + '/',
                { message, sessionId },
                {
                    timeout: this.timeout,
                    httpAgent: this.agent,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }   
            )
            return response.data
        } catch (e: any) {
            console.error('Error posting user message:', e)
            return null
        }
    }

     async createSession(): Promise<any> {
        try {
            const response = await axios.get(
                this.url + '/createSession',
                { timeout: this.timeout, httpAgent: this.agent }
            )
            return response.data
        } catch (e: any) {
            console.error('Error creating session:', e)
            return null
        }
    }
}

export default Client