# cleaning-assessment-service-server
## 清掃評価サービスのサーバー部分
### 役割
インフラ（resource）とアプリケーションロジック

### 仕組み
serverless.ymlに全てをimportする

### 勉強
filterは非破壊なので、plans.available = plans.available.filter()みたいな感じにしなきゃいけない

### serverのdeploy
schemaが変更されるとserverのdeployが必要,<br>apiのschemaが変わるから

### serverlessについて
＝サーバーの管理が不要<br>
VPC内で管理→OpenSearch, Elasticache(Redis)はgatewayを通じて<br>
serverlessな奴ら(outbound free)とコミュニケーションとる<br>
serverのinternalとexternalの違いは、このVPCの中にあるか外にあるか
