import { IRecordMastRepository, IScoreItemMastRepository, IScoreMastRepository, RecordMast, ScoreMast, timeStampToDateString } from 'cleaning-assessment-service-abr';

export class AddTestRecord {
    constructor(
        private recordMast: RecordMast,
        private recordRepository: IRecordMastRepository,
        private scoreRepository: IScoreMastRepository,
        private scoreItemRepository: IScoreItemMastRepository,
    ){}

    public async addTestRecordSingle(i: number) {
        // inputされたレコードの情報を微妙に変えて作成

        await this.recordRepository.addRecord(this.recordMast)
        const resRecord = await this.recordRepository.fetchRecordByRecordID(this.recordMast.recordID)
        if (resRecord) {
            // 時間は20分
            resRecord.cleaningTime = 20 * 60 * 60 * 1000
            // 日付を繰り返しの回数ごとに巻き戻す
            resRecord.recordDate = timeStampToDateString(resRecord.createdAt -  i * 86400000) // 1日
            await this.recordRepository.updateRecord(resRecord)
            // それに対して点数を適当に設定
            const scoreItems = await this.scoreItemRepository.fetchScoreItemsByHotelID(resRecord.recordHotelID)
            
            for (const scoreItem of scoreItems) {
                const newScore: ScoreMast = {
                    recordID: resRecord.recordID,
                    scoreID: '',
                    scorerUserID: '',
                    score: 10,
                    createdAt: 0,
                    scoreItemID: scoreItem.scoreItemID,
                    scoreCleanerID: resRecord.cleanerID,
                    scoreRoomID: resRecord.cleaningRoomID
                }
                newScore.score = Math.floor(10 % i)
                await this.scoreRepository.addScore(newScore)
            }
        }
    }
    // これを10回繰り返す
    public async addTestRecord() {
        for (let i = 0; i < 10; i++) {
            this.addTestRecordSingle(i)
        }
    }
}