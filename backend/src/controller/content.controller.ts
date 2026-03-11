import { asyncHandler } from "../utils/asyncHandler";
import type { Request, Response } from "express";
import { ContentType, ContentUpdateType, ContentUpdateValidation, ContentValidation } from "../utils/validation.user";
import { ApiError } from "../utils/ApiError";
import { prisma } from "../utils/db";
import { ApiResponse } from "../utils/ApiResponse";

export const createContent = asyncHandler(async (req: Request<{}, {}, ContentType>, res: Response) => {
    // @ts-ignore
    const userId = req.user?.id;
    if (!userId) {
        throw new ApiError(401, "UNAUTHORIZED");
    }
    const validation = await ContentValidation.safeParseAsync(req.body);

    if (!validation.success) {
        throw new ApiError(400, "Validation Error", validation.error);
    }

    const { link, type, tags } = validation.data;

    const content = await prisma.content.create({
        data: {
            link,
            type,
            tags,
            userId
        }
    });

    return res
        .status(201)
        .json(new ApiResponse(201, content));
});

export const getAllContent = asyncHandler(async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.user?.id;
    if (!userId) {
        throw new ApiError(401, "UNAUTHORIZED");
    }

    const contents = await prisma.content.findMany({
        where: { userId }
    });

    return res.status(200).json(new ApiResponse(200, contents));
});

export const getContentById = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    // @ts-ignore
    const userId = req.user?.id;
    if (!userId) {
        throw new ApiError(401, "UNAUTHORIZED");
    }

    const { id } = req.params;

    const content = await prisma.content.findFirst({
        where: { id, userId }
    });

    if (!content) {
        throw new ApiError(404, "CONTENT_NOT_FOUND");
    }

    return res.status(200).json(new ApiResponse(200, content));
});

export const updateContent = asyncHandler(async (req: Request<{ id: string }, {}, ContentUpdateType>, res: Response) => {
    // @ts-ignore
    const userId = req.user?.id;
    if (!userId) {
        throw new ApiError(401, "UNAUTHORIZED");
    }

    const { id } = req.params;

    const existingContent = await prisma.content.findFirst({
        where: { id, userId }
    });

    if (!existingContent) {
        throw new ApiError(404, "CONTENT_NOT_FOUND");
    }

    const validation = await ContentUpdateValidation.safeParseAsync(req.body);

    if (!validation.success) {
        throw new ApiError(400, "Validation Error", validation.error);
    }

    const { link, type, tags } = validation.data;

    const content = await prisma.content.update({
        where: { id },
        data: {
            ...(link && { link }),
            ...(type && { type }),
            ...(tags && { tags })
        }
    });

    return res.status(200).json(new ApiResponse(200, content));
});

export const deleteContent = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    // @ts-ignore
    const userId = req.user?.id;
    if (!userId) {
        throw new ApiError(401, "UNAUTHORIZED");
    }

    const { id } = req.params;

    const existingContent = await prisma.content.findFirst({
        where: { id, userId }
    });

    if (!existingContent) {
        throw new ApiError(404, "CONTENT_NOT_FOUND");
    }

    await prisma.content.delete({
        where: { id }
    });

    return res.status(200).json(new ApiResponse(200, { message: "Content deleted successfully" }));
});