import moment from "moment";
import morgan from "morgan";
import { Request, Response, NextFunction } from "express";

type CustomLogHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

const log = (format = "combined") => {
  const customLog = (message: string | Error) => {
    console.log(`INFO: ${message} ${moment().format("YYYY-MM-DD HH:mm:ss A")}`);
  };

  morgan.token("date", (req: Request, res: Response) => {
    return moment().format("YYYY-MM-DD HH:mm:ss A");
  });

  const middleware: CustomLogHandler = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    // Log your custom information here if needed
    const date = moment().format("YYYY-MM-DD HH:mm:ss A");
    const method = req.method;
    const url = req.url;
    const status = res.statusCode;
    const responseTime = res.getHeader("x-response-time") as string;

    console.log(
      `Custom Log: ${date} - ${method} ${url} ${status} ${responseTime} ms`
    );

    // Call morgan with the provided format
    morgan(format)(req, res, next);
  };

  return { info: customLog, middleware };
};

export default log;
