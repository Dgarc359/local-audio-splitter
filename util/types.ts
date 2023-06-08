export type ConvertMessageEventPayload = {
  base64File: string,
  fileName: string,
}
export type MessageEventPayload = {
  type: "convert" | "read-temp-dir",
} & Partial<ConvertMessageEventPayload>;

