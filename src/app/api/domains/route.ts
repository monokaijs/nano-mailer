import {withApi} from "@/lib/utils/withApi";
import {dbService} from "@/lib/services/db";
import {Domain} from "@/lib/types/models/domain";
import {FilterQuery} from "mongoose";
import {createDomainSchema} from "@/lib/validations/domain";

export const GET = withApi(async (request, context, decoded) => {
  const filter: FilterQuery<Domain> = {};
  if (!decoded) filter.isPublic = true;
  return dbService.domain.find(filter);
}, {
  isPublic: true,
});

export const POST = withApi(async (request, context, decoded) => {
  const data = context.data;
  return dbService.domain.create(data);
}, {
  schema: createDomainSchema,
});

export const PATCH = withApi(async (request, context, decoded) => {
  const body = await request.json();
  return dbService.domain.updateOne(body._id, body);
}, {
  schema: createDomainSchema,
});
