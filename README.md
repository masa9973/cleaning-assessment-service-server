# cleaning-assessment-service-server
## 清掃評価サービスのサーバー部分
### 役割
インフラ（resource）とアプリケーションロジック

### 仕組み
serverless.ymlに全てをimportする

### 勉強
filterは非破壊なので、plans.available = plans.available.filter()みたいな感じにしなきゃいけない

### serverのdeploy
schemaが変更されるとserverのdeployが必要, apiのschemaが変わるから
