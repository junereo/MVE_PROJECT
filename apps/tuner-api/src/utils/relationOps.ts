type RelationOp<T> = {
  op: 'create' | 'update' | 'delete';
  id?: string | number;
  where?: any; // optional unique 필드 (ex: provider_id)
  data?: Partial<T>;
};

type PrismaModelDelegate = {
  create: (args: any) => any;
  update: (args: any) => any;
  delete: (args: any) => any;
};

export function buildRelationOps<T>(
  model: PrismaModelDelegate,
  userIdKey: string,
  userId: string | number,
  ops: RelationOp<T>[]
): any[] {
  return ops.map((entry) => {
    const { op, id, where, data } = entry;

    switch (op) {
      case 'create':
        return model.create({
          data: {
            ...data,
            [userIdKey]: userId,
          },
        });

      case 'update':
        if (!id && !where) {
          throw new Error(`${model}.update: id 또는 where 조건이 필요합니다`);
        }
        return model.update({
          where: id ? { id } : where,
          data,
        });

      case 'delete':
        if (!id && !where) {
          throw new Error(`${model}.delete: id 또는 where 조건이 필요합니다`);
        }
        return model.delete({
          where: id ? { id } : where,
        });

      default:
        throw new Error(`알 수 없는 연산 종류: ${op}`);
    }
  });
}
