export class PaginationUtil {
    static getPaginationParams(
        page: string = '1',
        limit: string = '10'
    ): { skip: number; limit: number; page: number } {
        const pageNum = Math.max(1, parseInt(page, 10));
        const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
        const skip =(pageNum - 1) * limitNum;

        return { skip, limit: limitNum, page: pageNum };
    }
}