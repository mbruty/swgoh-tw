import { worker, Args } from "../swgoh-api";
var queue = require("fastq")(worker, 1);

export type CallBack = (errror: any, result: any) => void;

export default function (args: Args, callback: CallBack) {
  queue.push(args, callback);
}
