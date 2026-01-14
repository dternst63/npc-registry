import { Types } from "mongoose";

type MongoNpc = {
  _id: Types.ObjectId | string;
  __v?: number;
};

export const mapNpc = (npc: MongoNpc) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, __v: _unused, ...rest } = npc;

  return {
    id: _id instanceof Types.ObjectId ? _id.toString() : _id,
    ...rest,
  };
};
