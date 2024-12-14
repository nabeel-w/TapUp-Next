import { Storage } from '@google-cloud/storage';


const storage = new Storage();
const bucketName = 'tap-up-bucket';
const bucket = storage.bucket(bucketName);

export { bucket };