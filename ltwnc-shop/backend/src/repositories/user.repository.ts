import { User, UserRole } from "@prisma/client";
import { prisma } from "../models/prisma";

type CreateUserInput = {
  email: string;
  password: string;
  fullName: string;
  role?: UserRole;
};

export const userRepository = {
  findByEmail: (email: string) => {
    return prisma.user.findFirst({
      where: { email, deletedAt: null },
    });
  },

  findByEmailIncludingDeleted: (email: string) => {
    return prisma.user.findUnique({ where: { email } });
  },

  findById: (id: number) => {
    return prisma.user.findFirst({
      where: { id, deletedAt: null },
    });
  },

  create: (input: CreateUserInput): Promise<User> => {
    return prisma.user.create({
      data: {
        email: input.email,
        password: input.password,
        fullName: input.fullName,
        role: input.role ?? UserRole.USER,
      },
    });
  },

  updatePassword: (id: number, password: string) => {
    return prisma.user.update({
      where: { id },
      data: { password },
    });
  },

  softDelete: (id: number) => {
    return prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isActive: false,
      },
    });
  },
};
