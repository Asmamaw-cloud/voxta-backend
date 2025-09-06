export class CreateConversationDto {
  userId!: string;
  title?: string;
}

export class SendMessageDto {
  userId!: string;
  question!: string;
  // optionally: model / temperature etc in future
}
