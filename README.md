## 概要
matsuhubアプリで用いるAPIのServerless版

## Version
- Express v4.17.1
- TypeORM v0.2.29
- PostgreSQL v12.5

## 初期設定
### 前提
- ローカル端末は Mac を想定しています。他のOSを利用する場合は適宜読み替えてください
- Docker をインストール済みであること (Macの場合は Docker Desktop for Mac)
- node.js がインストール済みであること
- serverless framework がグローバルでインストール済みであること

### アプリ初期設定
依存関係のインストール
```
$ yarn
```

configファイルの作成
```
$ cp ormconfig.local-sample.json ormconfig.json
```

イメージのビルド
```
$ docker-compose build
```

データベースの初期設定
```
$ yarn run typeorm migration:run
$ yarn run typeorm -c test migration:run
```

### 起動・終了
Docker起動
```
$ docker-compose up -d
```

serverless offline での起動
```
$ sls offline --noPrependStageInUrl
```

serverless offline での起動（リモートデバッグを行いたい場合）
```
$ node --inspect node_modules/.bin/sls offline --noPrependStageInUrl
```

起動して、 `http://localhost:3000/canvases` にアクセスしてレスポンスがあれば起動完了。

Docker終了
```
$ docker-compose down
```