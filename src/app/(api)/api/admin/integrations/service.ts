import { prisma } from "@/lib/db";

export const deleteGoogleIntegration = () => {
  // delete db integration
  return prisma.$transaction([
    prisma.googleToken.delete({
      where: {
        integrationsId: "main_app",
      },
    }),
    prisma.integrations.update({
      where: {
        id: "main_app",
      },
      data: {
        GoogleCalendarConnect: false,
      },
    }),
  ]);
};

export const getGoogleIntegration = () => {
  return prisma.integrations.findUnique({
    where: {
      id: "main_app",
    },
    include: {
      GoogleToken: {
        select: {
          email: true,
        },
      },
    },
  });
};
