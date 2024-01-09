import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodObject, object } from "zod";

//curring function for schema
export const userSchemaController =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      next();
    } catch (e: any) {
      res.status(400).send({ error: e.errors });
    }
  };
