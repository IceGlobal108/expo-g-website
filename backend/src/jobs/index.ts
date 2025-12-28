import { emailWorker } from "./workers/email";
import { imageWorker } from "./workers/image";
import { cacheWorker } from "./workers/cache";

export const workers = [emailWorker, imageWorker, cacheWorker];
