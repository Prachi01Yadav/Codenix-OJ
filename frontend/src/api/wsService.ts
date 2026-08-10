import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { SubmissionResultDTO } from './types';

const WS_URL = import.meta.env.VITE_WS_URL || '/ws';

class WSService {
  private client: Client | null = null;
  private isConnected = false;
  private connectionPromise: Promise<void> | null = null;

  private connect(): Promise<void> {
    if (this.isConnected) return Promise.resolve();
    if (this.connectionPromise) return this.connectionPromise;

    this.connectionPromise = new Promise((resolve, reject) => {
      this.client = new Client({
        webSocketFactory: () => new SockJS(WS_URL),
        reconnectDelay: 5000,
        onConnect: () => {
          this.isConnected = true;
          resolve();
        },
        onStompError: (frame) => {
          console.error('Broker reported error: ' + frame.headers['message']);
          console.error('Additional details: ' + frame.body);
          reject(new Error(frame.headers['message']));
        },
        onWebSocketClose: () => {
          this.isConnected = false;
          this.connectionPromise = null;
        }
      });
      this.client.activate();
    });

    return this.connectionPromise;
  }

  async waitForSubmission(submissionId: number): Promise<SubmissionResultDTO> {
    await this.connect();
    
    return new Promise((resolve) => {
      const topic = `/topic/submissions/${submissionId}`;
      const subscription = this.client?.subscribe(topic, (message) => {
        const result: SubmissionResultDTO = JSON.parse(message.body);
        subscription?.unsubscribe();
        resolve(result);
      });
    });
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
    }
  }
}

export const wsService = new WSService();
