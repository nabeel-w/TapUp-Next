import { Storage, StorageOptions } from '@google-cloud/storage';
import { getServiceAccount } from '@/utils/generateCredential';

const token = getServiceAccount();
const options: StorageOptions = { token: token }
const storage = new Storage(options);
const bucketName = 'tap-up-bucket';
const bucket = storage.bucket(bucketName);

export { bucket };