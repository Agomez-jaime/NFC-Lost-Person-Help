// Minimal ambient types for the Web NFC API (not yet part of TypeScript's
// built-in DOM lib). Only covers what this project uses.
// Spec: https://w3c.github.io/web-nfc/

interface NDEFRecordInit {
  recordType: string;
  data?: string;
  mediaType?: string;
}

interface NDEFMessageInit {
  records: NDEFRecordInit[];
}

interface NDEFWriteOptions {
  overwrite?: boolean;
  signal?: AbortSignal;
}

interface NDEFScanOptions {
  signal?: AbortSignal;
}

interface NDEFRecord {
  recordType: string;
  mediaType?: string;
  id?: string;
  data?: DataView;
  encoding?: string;
  lang?: string;
}

interface NDEFMessage {
  records: NDEFRecord[];
}

interface NDEFReadingEvent extends Event {
  serialNumber: string;
  message: NDEFMessage;
}

declare class NDEFReader extends EventTarget {
  onreading: ((this: NDEFReader, ev: NDEFReadingEvent) => unknown) | null;
  onreadingerror: ((this: NDEFReader, ev: Event) => unknown) | null;
  scan(options?: NDEFScanOptions): Promise<void>;
  write(message: NDEFMessageInit | string, options?: NDEFWriteOptions): Promise<void>;
}
