const express = require('express');
const bodyParser = require('body-parser');
const amqp = require('amqplib');

const app = express();
const port = 3000;
let pushIndex = 0;
// RabbitMQ 연결 정보
const RABBITMQ_URL =  process.env.RABBITMQ_URL || 'amqp://admin:admin@my-rabbit.default.svc.cluster.local:5672';
const QUEUE_NAME = 'test-queue';                             // 보낼 큐 이름

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 
// HTML 폼 화면
app.get('/', (req, res) => {
  res.send(`
    <h1>RabbitMQ Producer</h1>
    <form action="/send" method="POST">
      <input name="message" placeholder="Enter Count to send" required/>
      <button type="submit">Send to RabbitMQ</button>
    </form>
  `);
});

// 버튼 클릭 시 메시지 RabbitMQ로 전송
app.post('/send', async (req, res) => {
  const message = req.body.message;
  console.log(req.body);
  try {
    // RabbitMQ 연결
    const start = Date.now();
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    const pushId = 'push_test_' + pushIndex++;
    // Queue 생성 (없으면)
    await channel.assertQueue(QUEUE_NAME, { durable: false });

    // 메시지 전송
    for(let i = 0; i < message; i++){
      const msg = pushId + ":token_" + i;
      channel.sendToQueue(QUEUE_NAME, Buffer.from(msg));
      console.log(`Sent: ${msg}`);
    }

    const elapsed = (Date.now() - start) + "ms";

    await channel.close();
    await connection.close();

    res.send(`<p>Message sent: ${message} in ${elapsed}</p><a href="/">Go back</a>`);
  } catch (err) {
    console.error('Failed to send message', err);
    res.status(500).send('Failed to send message');
  }
});

app.post('/send/push', async (req, res) => {
  const { pushId, tokenIds } = req.body;
  console.log(req.body);
  if (!pushId || !Array.isArray(tokenIds)) {
    return res.status(400).send('Invalid request format: pushId and tokenIds required');
  }

  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME, { durable: false });

    const start = Date.now();

    for (const tokenId of tokenIds) {
      const payload = `${pushId}:${tokenId}`;
      channel.sendToQueue(QUEUE_NAME, Buffer.from(payload));
      console.log(`Sent: ${payload}`);
    }

    const elapsed = (Date.now() - start) + "ms";

    await channel.close();
    await connection.close();

    res.send({
      status: "success",
      pushId,
      tokenCount: tokenIds.length,
      elapsed
    });
  } catch (err) {
    console.error('Failed to send JSON message', err);
    res.status(500).send('Failed to send JSON message');
  }
});

// 서버 시작
app.listen(port, () => {
  console.log(`Producer server listening at http://localhost:${port}`);
});
