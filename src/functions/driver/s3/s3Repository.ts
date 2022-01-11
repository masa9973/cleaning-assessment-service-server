import { IS3Repository } from 'stage3-abr';
import { S3Object } from 'stage3-abr/dist/entities/type';

export class S3Repository implements IS3Repository {
    fetchObject<T>(s3Object: S3Object): Promise<T> {
        throw new Error('Method not implemented.');
    }
    addFile(uniquePath: string, file: File): Promise<S3Object> {
        throw new Error('Method not implemented.');
    }
    getSampleImage(): S3Object {
        throw new Error('Method not implemented.');
    }
}