import { Prisma } from '@prisma/client';

export type TunerContract = {
  id: number;
  ca_token?: string | null;
  ca_badge?: string | null;
  ca_survey?: string | null;
  ca_transac?: string | null;
  abi_survey?: Prisma.JsonValue | null;
  abi_transac?: Prisma.JsonValue | null;
  created_at: Date;
  updated_at: Date;
};
