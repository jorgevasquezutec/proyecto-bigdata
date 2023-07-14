import { Kafka } from 'kafkajs';
import {BROKERS,TOPICS,TOPICS2 } from './app.js';


const kafka = new Kafka({
    clientId: 'my-app3',
    brokers: BROKERS,
});

const consumer = kafka.consumer({ groupId: 'test-group' });


export const createTopicIfNotExists = async () => {

    const admin = kafka.admin();
    await admin.connect();
    //List Topic
    const topicList = await admin.listTopics();
    //TOPIC = ['topic1', 'topic2']
    //TOPIC2 = ['topic1', 'topic2', 'topic3']
    if (TOPICS.every((topic) => topicList.includes(topic))) {
        console.log(`Topic ${TOPICS.join(",")} already exists`);
    } else {
        await admin.createTopics({
            topics: TOPICS.map((topic) => {
                return {
                    topic : topic,
                    numPartitions: 1,
                };
            }),
        });
        console.log(`Topic ${TOPICS.join(",")} created`);
    }

    if (TOPICS2.every((topic) => topicList.includes(topic))) {
        console.log(`Topic ${TOPICS2.join(",")} already exists`);
    }else {
        await admin.createTopics({
            topics: TOPICS2.map((topic) => {
                return {
                    topic : topic,
                    numPartitions: 5,
                };
            }),
        });
        console.log(`Topic ${TOPICS2.join(",")} created`);
    }

    await admin.disconnect();
}


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
