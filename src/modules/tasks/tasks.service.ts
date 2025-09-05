import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from './enum'; // <-- import enum

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  // Create a task (optionally linked to a message)
  async create(userId: string, dto: CreateTaskDto) {
    let title = dto.title;
    let description: string | undefined = dto.description ?? undefined;

    // If messageId is provided, use message content
    if (dto.messageId) {
      const message = await this.prisma.message.findUnique({
        where: { id: dto.messageId },
      });
      if (!message) throw new NotFoundException('Message not found');
      title = message.content?.slice(0, 50) || 'New Task from Message';
      description = message.content || '';

      
    }

    return this.prisma.task.create({
      data: {
        title: title!,        // <-- non-null assertion to satisfy Prisma
    description: description || '', // fallback if undefined
        creatorId: userId,
        assignedToId: dto.assignedToId ?? undefined,
        messageId: dto.messageId ?? undefined,
        status: dto.status ? (dto.status as any) : 'PENDING',
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      },
    });
  }


  async findAllForUser(userId: string) {
    return this.prisma.task.findMany({
      where: { OR: [{ creatorId: userId }, { assignedToId: userId }] },
      include: { creator: true, assignedTo: true },
    });
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: { creator: true, assignedTo: true },
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(id: string, dto: UpdateTaskDto) {
    return this.prisma.task.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status ? (dto.status as any) : 'PENDING',

        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.task.delete({ where: { id } });
  }
}
