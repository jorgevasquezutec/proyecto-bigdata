import { Kafka } from 'kafkajs';


const kafka = new Kafka({
    clientId: 'my-app3',
    brokers: ['192.168.0.15:8097', '192.168.0.15:8098', '192.168.0.15:8099', '192.168.0.15:8100']
});

const consumer = kafka.consumer(
    {
        groupId: 'test-group',
    });
const textError = 'Error  Kafka:';

const checkKafkaConnection = async () => {
    try {
        await consumer.connect();
        await consumer.subscribe({ topic: 'test-topic', fromBeginning: true });
        console.log('Conexión exitosa a Kafka');
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    // console.log(message.value)
                    let msg = message.value;
                    if (msg) {
                        let event = JSON.parse(msg.toString());
                        console.log("event", event);
                    }
                } catch (error) {
                    console.log(textError, error);
                }
            }
        })
        // Realiza más operaciones o lógica aquí después de una conexión exitosa
    } catch (error) {
        console.error('Error al conectarse a Kafka:', error);
    } finally {
        // await consumer.disconnect();
    }
};

checkKafkaConnection();