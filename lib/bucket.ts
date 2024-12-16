import { getGCPCredentials } from '@/utils/configHelper';
import { Storage } from '@google-cloud/storage';


const storage = new Storage(getGCPCredentials());
const bucketName = 'tap-up-bucket';
const bucket = storage.bucket(bucketName);

export { bucket };