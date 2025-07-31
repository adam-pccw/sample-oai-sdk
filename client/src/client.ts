import axios from "axios"

class Client{
    url: string = "" 

    constructor(value: string) {
        this.url = value;
    }

    async userMessage(message: string, sessionId: string): Promise<any> {
        try {
            const response = await axios.post(this.url + '/', { message, sessionId })
            return response.data
        } catch (e: any) {
            console.error('Error creating user:', e)
            return null
        }
    }

     async createSession(): Promise<any> {
        try {
            const response = await axios.get(this.url + '/createSession')
            return response.data
        } catch (e: any) {
            console.error('Error creating user:', e)
            return null
        }
    }
}

export default Client