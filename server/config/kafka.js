import { Kafka } from 'kafkajs';
import dotenv from 'dotenv';

dotenv.config();


const kafka = new Kafka({
    clientId: 'my-app',
    brokers: process.env.BROKERS.split(','),
});



export const sendProducer = async (topic, message) => {
    const producer = kafka.producer();
    await producer.connect();
    await producer.send({
        topic,
        messages: [
            { value: JSON.stringify(message) },
        ],
    });
    await producer.disconnect();
}

export const makeConsumer = async (topic) => {
    const consumer = kafka.consumer({ groupId: 'node-app' })
    await consumer.connect()
    await consumer.subscribe({ topics: topic, fromBeginning: false })
    return consumer
}
