const express = require('express');
const amqp = require('amqplib');

const app = express();
const port = 3000;

// RabbitMQ 연결 정보
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://admin:admin@my-rabbit.default.svc.cluster.local:5672';
const QUEUE_NAME = 'test-queue'; // Producer와 같은 큐 이름

// 메시지를 저장할 임시 메모리
let receivedMessages = [];

// RabbitMQ 연결 및 Consumer 설정
async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: false });

    console.log('Waiting for messages...');

    channel.consume(QUEUE_NAME, (msg) => {
      if (msg !== null) {
        const messageText = msg.content.toString();
        console.log('Received:', messageText);
        receivedMessages.push(messageText);
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error('Failed to connect RabbitMQ', error);
    setTimeout(connectRabbitMQ, 5000); // 연결 실패 시 5초 후 재시도
  }
}

// 받은 메시지를 확인할 수 있는 엔드포인트
app.get('/', (req, res) => {
  res.send(`
    <h1>RabbitMQ Consumer</h1>
    <h3>Received Messages:</h3>
    <ul>
      ${receivedMessages.map(msg => `<li>${msg}</li>`).join('')}
    </ul>
  `);
});

app.listen(port, () => {
  console.log(`Consumer server listening at http://localhost:${port}`);
  connectRabbitMQ(); // 서버가 뜨면 바로 RabbitMQ 연결 시도


});
