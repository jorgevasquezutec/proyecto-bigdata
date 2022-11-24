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

    // initRun(topic).catch(e => console.error(`[example/consumer] ${e.message}`, e))

    // const errorTypes = ['unhandledRejection', 'uncaughtException']
    // const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

    // errorTypes.forEach(type => {
    //     process.on(type, async e => {
    //         try {
    //             console.log(`process.on ${type}`)
    //             console.error(e)
    //             await consumer.disconnect()
    //             process.exit(0)
    //         } catch (_) {
    //             process.exit(1)
    //         }
    //     })
    // })

    // signalTraps.forEach(type => {
    //     process.once(type, async () => {
    //         try {
    //             await consumer.disconnect()
    //         } finally {
    //             process.kill(process.pid, type)
    //         }
    //     })
    // })
}

// const initRun = async (topic) => {
//     const consumer = kafka.consumer({ groupId: 'node-app' })
//     await consumer.connect()
//     await consumer.subscribe({ topics: topic, fromBeginning: false })
//     return consumer
//     // await consumer.run({
//     //     // eachBatch: async ({ batch }) => {
//     //     //   console.log(batch)
//     //     // },
//     //     eachMessage: async ({ topic, partition, message }) => {
//     //         const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
//     //         console.log(`- ${prefix} ${message.key}#${message.value}`)
//     //     },
//     // })
// }
