# cleaning-assessment-service-server
## 清掃評価サービスのサーバー部分
### 役割
インフラ（resource）とアプリケーションロジック

### 仕組み
serverless.ymlに全てをimportする

### filter
filterは非破壊なので、plans.available = plans.available.filter()みたいな感じにしなきゃいけない

### serverのdeploy
schemaが変更されるとserverのdeployが必要,<br>
apiのschemaが変わるから<br>
serverのschema変えるの忘れがちなので気をつけよう<br>
codegenしてからプルリク上げるようにする


### serverlessについて
＝サーバーの管理が不要<br>
VPC内で管理→OpenSearch, Elasticache(Redis)はgatewayを通じて<br>
serverlessな奴ら(outbound free)とコミュニケーションとる<br>
serverのinternalとexternalの違いは、このVPCの中にあるか外にあるか

### Promise.all
const promises: Promise<any>[] = [...Plans, ...Plans];<br>
await Promise.all(promises);<br>
みたいな。パフォーマンスが良くなる<br>
処理時間をT1<T2<T3とすると、T1+T2+T3ではなくT3になる
```
const res = await Promise.all()
  return res[0]
```
とかで結果が返せる
