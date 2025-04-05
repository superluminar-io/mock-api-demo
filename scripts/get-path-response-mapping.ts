import * as nock from 'nock';

export const getPathResponseMapping = (mockResponses: nock.Definition[]): { path: string, response: any }[] => {
    return mockResponses.map(mockResponse => {
        const path = mockResponse.path as string;
        const pathWithoutLeadingSlash = path.startsWith('/') ? path.slice(1) : path;
        const response = mockResponse.response;
        return {
            path: pathWithoutLeadingSlash,
            response
        }
    });
}
