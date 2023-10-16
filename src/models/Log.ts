class Log {
  timestamp: Date;
  message: string;

  constructor(timestamp: Date, message: string) {
    this.timestamp = timestamp;
    this.message = message;
  }
}

export default Log;
