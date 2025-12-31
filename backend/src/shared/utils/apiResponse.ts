import { Response } from 'express';
import { ApiResponse } from '../types/common.types';

export class ApiResponseUtil {
  static success<T>(
    res: Response,
    data: T,
    message: string = 'Success',
    statusCode: number = 200
  ): Response {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static error(
    res: Response,
    message: string = 'Error occurred',
    statusCode: number = 500
  ): Response {
    return res.status(statusCode).json({
      success: false,
      error: message,
    });
  }

  static paginated<T>(
    res: Response,
    items: T[],
    page: number,
    limit: number,
    total: number
  ): Response {
    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      data: {
        items,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
    });
  }
}