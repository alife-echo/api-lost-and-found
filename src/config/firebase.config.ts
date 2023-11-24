import * as dotenv from 'dotenv'
dotenv.config()

export default {
    firebaseConfig : {
        apiKey: process.env.API_KEY as string,
        authDomain:process.env.AUTH_DOMAIN as string ,
        projectId: process.env.PROJECT_ID as string,
        storageBucket: process.env.STORAGE_BUCKET as string,
        messagingSenderId: process.env.MESSAGING_SENDER_ID as string,
        appId: process.env.APP_ID as string,
        measurementId: process.env.MEASURENMENT_ID as string
    }       
}