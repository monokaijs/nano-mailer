import { NextRequest, NextResponse } from "next/server";
import { JWT } from "next-auth/jwt";
import { dbService } from "@/lib/services/db";
import { UserRole } from "@/lib/types/models/user";
import { authDecode } from "@/lib/utils/authDecode";
import { z } from "zod";

function unauthorized() {
  return NextResponse.json(
    { data: null, pagination: undefined, code: 401, message: "Please login." },
    { status: 401 }
  );
}

function forbidden() {
  return NextResponse.json(
    { data: null, pagination: undefined, code: 403, message: "You don't have permission to access this resource." },
    { status: 403 }
  );
}

function buildSuccessResponse(result: any) {
  const rawData = result?.data ?? result ?? null;
  const rawPagination = result?.pagination;
  const pagination = rawPagination ? { ...rawPagination, docs: undefined } : undefined;
  let message = "OK";
  let data = rawData;
  if (data && typeof data === "object" && "message" in data) {
    message = (data as any).message ?? message;
    const { message: _omit, ...rest } = data as any;
    data = rest;
  }
  return NextResponse.json({ data, pagination, code: 200, message }, { status: 200 });
}

function buildErrorResponse(error: any) {
  const statusCode = error?.code ?? error?.statusCode ?? 500;
  const message = error?.message || "Internal Server Error";
  return NextResponse.json(
    { data: null, pagination: undefined, code: statusCode, message },
    { status: statusCode }
  );
}

async function safeJson(req: NextRequest) {
  try {
    return await req.clone().json();
  } catch {
    return undefined;
  }
}

export type WithApiOptions<S extends z.ZodTypeAny | undefined = undefined> = {
  preventDb?: boolean;
  schema?: S;
  roles?: UserRole[];
  isPublic?: boolean;
};

type WithApiContextBase<P> = {
  params: P;
  query: URLSearchParams;
};

export type WithApiContext<P, S extends z.ZodTypeAny | undefined = undefined> = WithApiContextBase<P> &
  (S extends z.ZodTypeAny ? { data: z.infer<S> } : {});

export type WithApiHandler<Res, P, S extends z.ZodTypeAny | undefined> = (
  request: NextRequest,
  context: WithApiContext<P, S>,
  decoded?: JWT
) => Promise<Res> | Res;

type NextContextLike<P> = { params: P | Promise<P> };

export function withApi<
  P = unknown,
  Res = Response,
  S extends z.ZodTypeAny | undefined = undefined
>(handler: WithApiHandler<Res, P, S>, options: WithApiOptions<S> = {}) {
  const { preventDb = false, roles = [], isPublic = false, schema } = options;

  return async function wrappedHandler(
    request: NextRequest,
    nextCtxIn: NextContextLike<P>
  ): Promise<Response> {
    try {
      const params = await nextCtxIn.params;
      const baseCtx: WithApiContextBase<P> = {
        params,
        query: request.nextUrl.searchParams,
      };

      const nextCtx = (schema
        ? {
          ...baseCtx,
          data: await schema.parseAsync(await safeJson(request)),
        }
        : baseCtx) as WithApiContext<P, S>;

      if (!preventDb) await dbService.connect();

      const authHeader = request.headers.get("Authorization");
      const bearerToken =
        authHeader?.startsWith("Bearer ")
          ? authHeader.slice("Bearer ".length).trim()
          : undefined;

      const decoded = await authDecode(bearerToken);

      if (!isPublic) {
        if (!decoded) return unauthorized();
        if (roles.length > 0) {
          const userRole = decoded.role as UserRole | undefined;
          if (!userRole || !roles.includes(userRole)) return forbidden();
        }
      }

      const result = await handler(request, nextCtx, decoded);
      if (result instanceof NextResponse) return result;
      return buildSuccessResponse(result);
    } catch (error: any) {
      return buildErrorResponse(error);
    }
  };
}
