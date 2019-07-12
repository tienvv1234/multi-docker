const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});
const sub = redisClient.duplicate();
const redisPublisher = redisClient.duplicate();

function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

sub.on('message', (channel, message) => {
	console.log('channel', channel);
  console.log('message', message);
  const fibNumber = fib(parseInt(message));
  redisClient.hset('values', message, fibNumber);
  redisPublisher.publish('fibNumber', fibNumber);
});
sub.subscribe('insert');
