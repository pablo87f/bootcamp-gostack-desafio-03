import Bee from 'bee-queue';
import OrderCreationMail from '../app/jobs/order-creation-mail.job';
import redisConfig from '../config/redis.config';

const jobs = [OrderCreationMail];

class Queue {
    constructor() {
        this.queues = {};
        this.init();
    }

    init() {
        jobs.forEach(({ key: jobKey, handle }) => {
            this.queues[jobKey] = {
                bee: new Bee(jobKey, {
                    redis: redisConfig,
                }),
                handle,
            };
        });
    }

    add(jobKey, jobData) {
        return this.queues[jobKey].bee.createJob(jobData).save();
    }

    processQueue() {
        jobs.forEach(job => {
            const { bee, handle } = this.queues[job.key];
            bee.on('failed', this.handleFailure).process(handle);
        });
    }

    handleFailure(job, err) {
        console.log(`Queue job ${job.queue.name}: FAILED`, err);
    }
}

export default new Queue();
