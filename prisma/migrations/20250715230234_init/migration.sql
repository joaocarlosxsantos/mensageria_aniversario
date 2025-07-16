-- CreateTable
CREATE TABLE "Contact" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "birthday" TIMESTAMP(3) NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageConfig" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "sendTime" TEXT NOT NULL,

    CONSTRAINT "MessageConfig_pkey" PRIMARY KEY ("id")
);
