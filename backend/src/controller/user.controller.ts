import { asyncHandler } from "../utils/asyncHandler";
import type { Request, Response } from 'express';
import { loginType, loginValidation, SignUpType, SignUpValidation } from "../utils/validation.user";
import { ApiError } from "../utils/ApiError";
import { prisma } from "../utils/db";
import { ApiResponse } from "../utils/ApiResponse";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signUp = asyncHandler(async (req: Request<{}, {}, SignUpType>, res: Response) => {
    const validation = await SignUpValidation.safeParseAsync(req.body);
    if (!validation.success) {
        throw new ApiError(400, "Validation Error", validation.error);
    }
    const {email, password } = validation.data;

    const existingUser = await prisma.user.findUnique({
        where: {
            email
        }
    });
    // console.log(existingUser);
    
    if (existingUser) {
        throw new ApiError(409, "An account with this email already exists. Please login instead.");
    }
    const user = await prisma.user.create({
        data :{
            email,
            password:await bcrypt.hash(password, 10),
        }
    });
    
    return res
    .status(201)
    .json(new ApiResponse(201,user));
});


export const login = asyncHandler(async (req: Request<{},{},loginType>, res: Response) => {
    const validation = await loginValidation.safeParseAsync(req.body);

    if (!validation.success) {
         throw new ApiError(400, "Validation Error", validation.error);
    }

    const { email, password } = validation.data;

    const user = await prisma.user.findUnique({
        where: {
            email
        },
    });

    if (!user) {
        throw new ApiError(404, "Account not found. Please check your email or sign up.");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Incorrect password. Please try again.");
    }

    const payload  = {
        id : user.id,
        email : user.email,
    }

    const refreshToken = jwt.sign(
        payload,
        process.env.REFRESH_TOKEN_SECRET as string,
        {
            expiresIn: '7d'
        }
    );
    // console.log("refreshToken", refreshToken);
    
    const accessToken = jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_SECRET as string,  
        {
            expiresIn: '1d'
        }
    );

    const updatedUser = await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            refreshToken,
        }
    });

    const responseUser = {
        id: user.id,
        email: user.email,
    }

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'strict' as const,
    }

    return res
        .status(200)
        .cookie('refreshToken', refreshToken, options)
        .cookie('accessToken', accessToken, options)
        .json(new ApiResponse(200, { token: accessToken, user: responseUser }));
});

export const toggleShare = asyncHandler(async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.user?.id;
    if (!userId) {
        throw new ApiError(401, "UNAUTHORIZED");
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { sharedContents: true }
    });

    if (!user) {
        throw new ApiError(404, "USER_NOT_FOUND");
    }

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { shared: !user.shared }
    });

    if (updatedUser.shared) {
        let sharedContent = user.sharedContents;

        if (!sharedContent) {
            sharedContent = await prisma.sharedContent.create({
                data: { userId }
            });
        }

        return res.status(200).json(new ApiResponse(200, { 
            shared: true,
            shareLink: `/api/v1/share/${sharedContent.id}` 
        }));
    }

    return res.status(200).json(new ApiResponse(200, { shared: false, shareLink: null }));
});

export const getSharedContent = asyncHandler(async (req: Request<{ shareId: string }>, res: Response) => {
    const { shareId } = req.params;

    const sharedContent = await prisma.sharedContent.findUnique({
        where: { id: shareId },
        include: {
            user: {
                include: {
                    contents: true
                }
            }
        }
    });

    if (!sharedContent) {
        throw new ApiError(404, "SHARED_LINK_NOT_FOUND");
    }

    if (!sharedContent.user.shared) {
        throw new ApiError(403, "SHARING_DISABLED");
    }

    return res.status(200).json(new ApiResponse(200, {
        email: sharedContent.user.email,
        contents: sharedContent.user.contents
    }));
});

export const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "REFRESH_TOKEN_REQUIRED");
    }

    let decoded: { id: string; email: string };
    try {
        decoded = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET as string
        ) as { id: string; email: string };
    } catch (error) {
        throw new ApiError(401, "INVALID_REFRESH_TOKEN");
    }

    const user = await prisma.user.findUnique({
        where: { id: decoded.id }
    });

    if (!user || user.refreshToken !== incomingRefreshToken) {
        throw new ApiError(401, "INVALID_REFRESH_TOKEN");
    }

    const payload = {
        id: user.id,
        email: user.email,
    };

    const newAccessToken = jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: '1d' }
    );

    const newRefreshToken = jwt.sign(
        payload,
        process.env.REFRESH_TOKEN_SECRET as string,
        { expiresIn: '7d' }
    );

    await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: newRefreshToken }
    });

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'strict' as const,
    };

    return res
        .status(200)
        .cookie('refreshToken', newRefreshToken, options)
        .cookie('accessToken', newAccessToken, options)
        .json(new ApiResponse(200, { accessToken: newAccessToken }));
});