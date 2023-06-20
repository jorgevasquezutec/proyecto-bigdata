import { Kafka } from 'kafkajs';
import {BROKERS } from './app.js';


const kafka = new Kafka({
    clientId: 'my-app3',
    brokers: BROKERS,
});

const consumer = kafka.consumer({ groupId: 'test-group' });


export const sendProducer = async (topic, message) => {
    const producer = kafka.producer(
        {
            createPartitioner: Kafka.DefaultPartitioner,
        }
    );
    await producer.connect();
    await producer.send({
        topic,
        messages: [
            { value: JSON.stringify(message) },
        ],
    });
    await producer.disconnect();
}

export const makeConsumerPromise = async (topic, user) => {

    return new Promise(async (resolve, reject) => {
        // const consumer = kafka.consumer( {groupId: `consumer-${user._id}`})
        await consumer.connect()
        await consumer.subscribe({ topics: topic, fromBeginning: true })
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    // console.log(message.value)
                    let msg = message.value;
                    if (msg) {
                        let event = JSON.parse(msg.toString());
                        // console.log("event", event);
                        if (event.username === user.userName) {
                            resolve({
                                event: event,
                                topic: topic,
                                status: true,
                                consumer: consumer
                            })
                        }
                    }
                } catch (error) {
                    reject({
                        status: false,
                        error: error || textError,
                        consumer: consumer
                    })
                }
            }
        }).catch(async e => {
            console.error(`[example/consumer] ${e.message}`)
            reject({
                status: false,
                error: error.message || textError,
                consumer: consumer
            })
        })
    })


    // return consumer
}


export const makeConsumer = async (topic, callback = null) => {
    const textError = "Error al consumir el mensaje";
    await consumer.connect()
    await consumer.subscribe({ topics: topic, fromBeginning: false })
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            try {
                // console.log(message.value)
                let msg = message.value;
                if (msg) {
                    let event = JSON.parse(msg.toString());
                    // console.log("event", event);
                    if(callback){
                        callback(event, topic);
                    }
                    
                }
            } catch (error) {
                console.log(textError, error);
            }
        }})
}
