/* eslint-disable @typescript-eslint/no-explicit-any */

import { lsAccessToken } from "../constants";

export type WsMessageHandler = (data: any) => void;
export type WsErrorHandler = (error: any) => void;
export type WsVoidHandler = () => void;

export default class BaseWsService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private manuallyClosed = false;
  private lastUrl: string | null = null;

  public isConnected = false;

  constructor(
    private getTokenFn: () => Promise<string>
  ) {
    localStorage.getItem(lsAccessToken);
  }

  // Callbacks
  onConnected: WsVoidHandler | null = null;
  onDisconnected: WsVoidHandler | null = null;
  onError: WsErrorHandler | null = null;
  onMessage: WsMessageHandler | null = null;

  // ============================================================
  // 🔌 Connect
  // ============================================================
  async connect(url: string): Promise<void> {
    const token = await this.getTokenFn();
    if (!token) {
      console.warn("❌ WS ERROR: Token no encontrado");
      return;
    }
    const wsUrl = `${url}?token=${encodeURIComponent(token)}`;
    this.lastUrl = url;
    this.manuallyClosed = false;

    try {
      console.log("🔌 Conectando WS", wsUrl);

      this.ws = new WebSocket(wsUrl, []);

      this.ws.onopen = () => {
        console.log("🟢 WS conectado");
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.onConnected?.();
      };

      this.ws.onmessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          // console.log("📩 Recibiendo:", data['message']);
          this.onMessage?.(data['message']);
        } catch (e) {
          console.warn("⚠️ WS parse error:", e);
        }
      };

      this.ws.onclose = () => {
        console.log("🔴 WS cerrado");
        this.isConnected = false;
        this.onDisconnected?.();

        if (!this.manuallyClosed) this.scheduleReconnect();
      };

      this.ws.onerror = (err) => {
        console.error("❌ WS Error:", err);
        this.isConnected = false;
        this.onError?.(err);

        if (!this.manuallyClosed) this.scheduleReconnect();
      };

    } catch (err) {
      console.error("❌ WS error al conectar:", err);
      this.onError?.(err);
      this.scheduleReconnect();
    }
  }

  // ============================================================
  // ♻️ Reconexión automática tipo backoff
  // ============================================================
  private scheduleReconnect(): void {
    this.reconnectAttempts++;

    const delay = 2000 * this.reconnectAttempts; // 2s, 4s, 6s, 8s...
    console.log(`⏳ Reintentando WS en ${delay / 1000}s...`);

    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);

    this.reconnectTimer = setTimeout(() => {
      if (this.lastUrl) this.connect(this.lastUrl);
    }, delay);
  }

  // ============================================================
  // ✉️ Envío
  // ============================================================
  send(message: string): void {
    if (!this.isConnected || !this.ws) {
      console.warn("❌ No conectado, send cancelado");
      return;
    }
    this.ws.send(message);
  }

  sendJson(json: any): void {
    console.log("📩 Enviando:", JSON.stringify(json));
    this.send(JSON.stringify(json));
  }

  // ============================================================
  // 📩 Escuchar mensajes
  // ============================================================
  public listen(callback: WsMessageHandler): void {
    this.onMessage = callback;
  }
  // ============================================================
  // 🔌 Cerrar
  // ============================================================
  disconnect(): void {
    this.manuallyClosed = true;

    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);

    if (this.ws) {
      console.log("⚪ Cerrando WS manualmente");
      this.ws.close();
    }
  }
}
