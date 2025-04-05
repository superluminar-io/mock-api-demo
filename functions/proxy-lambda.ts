import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import mockRecordingsRaw from '../nock-recordings/api.json';
import * as nock from 'nock';

const mockRecordings: nock.Definition[] = Array.isArray(mockRecordingsRaw)
    ? mockRecordingsRaw
    : [];

export const handler = async (
    event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
    const pathKey = event.path;

    // find the recording in the mockRecordings array
    const recording = (mockRecordings as nock.Definition[]).find(
        (r: nock.Definition) => r.path === pathKey,
    );

    if (!recording) {
        return {
            statusCode: 404,
            body: JSON.stringify({ message: 'Not Found' }),
        };
    } else {
        return {
            statusCode: recording.status || 200,
            body: JSON.stringify(recording.response),
        };
    }
};
