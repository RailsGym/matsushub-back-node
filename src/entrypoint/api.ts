import serverless from "serverless-http";
import express from "express";
import * as morgan from 'morgan'
const app = express();

// body-parser の設定 参考: https://qiita.com/atlansien/items/c587a0bf2f7f9022107c
app.use(express.json({ limit: '5mb'}));
app.use(express.urlencoded({ extended: true , limit: '5mb'}));

app.use((_, res: CustomResponse, next) => {
  res.header("Access-Control-Allow-Origin", process.env.FRONTEND_ORIGIN)
    .header("Access-Control-Allow-Headers", [
      'Content-Type',
      'X-Amz-Date',
      'Authorization',
      'X-Api-Key',
      'X-Amz-Security-Token',
      'X-Amz-User-Agent'])
  ;
  res.errorJson = (error) => {
    return res.status(error.status).json(error);
  };
  next();
});

const binaryMimeTypes = [
  'image/gif',
]
// morgan のカスタムトークンの定義
morgan.token('aws-lambda-request-id', function (req: CustomRequest, _) {
  return req.context.requestId;
})
const preFormat = JSON.stringify({
  'access-log': {
    'remote-addr': ':remote-addr',
    'method': ':method',
    'path': ':url',
    'status': ':status',
    'referrer': ':referrer',
    'user-agent': ':user-agent',
    'aws-lambda': {
      'request-id': ':aws-lambda-request-id'
    }
  }
});
app.use(morgan(preFormat));
import {APIGatewayEventRequestContext, APIGatewayProxyEvent, Context} from "aws-lambda";
import {CanvasController} from "../controllers/CanvasController";
import {PostgresTable} from "../infrastructure/db/postgres/PostgresTable";
import {Canvas} from "../models/canvas/Canvas";
import CanvasRepository from "../models/canvas/CanvasRepository";

const canvasTable = new PostgresTable<Canvas>(Canvas)
const canvasRepository = new CanvasRepository(canvasTable)
const canvasController = new CanvasController(canvasRepository)

interface CustomRequest extends express.Request {
  context: APIGatewayEventRequestContext;
}

interface ErrorResponse {
  status: number; //ステータスコードをそのまま入れる想定
  error: {
    code: string // 任意の文字列。なぜエラーになっているのかが端的にわかるようなものを想定（例: NOT_FOUND_USER）。また、APIの利用者側でハンドリングしてもよい想定。
    message: string // 任意の文字列。詳細なメッセージ内容を記載する
  };
}

export interface CustomResponse extends express.Response {
  errorJson: (error: ErrorResponse) => this
}

app.get('/canvases', async (req, res, next) => {
  return await canvasController.getCanvases(req, res, next)
})

export const handler = serverless(app, {
  request: (req: CustomRequest, event: APIGatewayProxyEvent, _context: Context) => {
    req.context = event.requestContext;
  },
  binary: binaryMimeTypes
});