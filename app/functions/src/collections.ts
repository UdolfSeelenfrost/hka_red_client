import {Request, Response} from "express";

const functionMappings = {
  "all": (req: Request, res: Response) => {
    return res.send("r/all");
  },
  "best": (req: Request, res: Response) => {
    return res.send("r/best");
  },
};

export function isCollection(sub: string) {
  return Object.keys(functionMappings).includes(sub);
}

export function loadCollection(sub: string, req: Request, res: Response) {
  return functionMappings[sub as keyof typeof functionMappings](req, res);
}
