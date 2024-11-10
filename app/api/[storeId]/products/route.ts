import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
    try {
        const { userId } = auth()
        const body = await req.json()

        const {
            name,
            price,
            stock,
            categoryId,
            colors,
            sizes,
            images,
            isFeatured,
            isArchived
        } = body;

        if (!userId) {
            return new NextResponse('Unauthenticated', { status: 401 })
        }
        if (!name) {
            return new NextResponse('Name is required', { status: 400 })
        }
        if (!images || !images.length) {
            return new NextResponse('images is required', { status: 400 })
        }
        if (!price) {
            return new NextResponse('Price Url is required', { status: 400 })
        }
        if (!stock) {
            return new NextResponse('Stock  is required', { status: 400 })
        }
        if (!categoryId) {
            return new NextResponse('Category id  is required', { status: 400 })
        }
        if (!colors || !colors.length) {
            return new NextResponse('Colors ids  is required', { status: 400 })
        }
        if (!sizes || !sizes.length) {
            return new NextResponse('Sizes ids  is required', { status: 400 })
        }
        
        if (!params.storeId) {
            return new NextResponse('Store id is required', { status: 400 })
        }

        const findStoreById = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })
        if (!findStoreById) {
            return new NextResponse('Unauthorized', { status: 403 })
        }
        const product = await prismadb.product.create({
            data: {
                name,
                price,
                isArchived,
                isFeatured,
                categoryId,
                stock,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string }) => image)
                        ]
                    }
                },
                colors: {
                    connect: colors.map((colorId: string) => ({ id: colorId }))
                },
                sizes: {
                    connect: sizes.map((sizeId: string) => ({ id: sizeId }))
                },
                storeId: params.storeId
            }
        })
        return NextResponse.json(product)
    } catch (error) {
        console.log('[PRODUCTSS_POST]', error);
        return new NextResponse("Internal error", { status: 500 })
    }
}


export async function GET(req: Request, { params }: { params: { storeId: string } }) {
    try {
        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get('categoryId') || undefined;
        const colors = searchParams.get('colors')?.split(',') || undefined;  // Expecting colors as comma-separated string
        const sizes = searchParams.get('sizes')?.split(',') || undefined;    // Expecting sizes as comma-separated string
        const isFeatured = searchParams.get('isFeatured') === 'true';        // Converts 'true' to true, else false

        if (!params.storeId) {
            return new NextResponse('Store id is required', { status: 400 });
        }

        const products = await prismadb.product.findMany({
            where: {
                storeId: params.storeId,
                categoryId,
                isFeatured: isFeatured || undefined,  // Only filter if true
                isArchived: false,
                colors: colors
                    ? {
                        some: {
                            id: { in: colors }
                        }
                    }
                    : undefined,
                sizes: sizes
                    ? {
                        some: {
                            id: { in: sizes }
                        }
                    }
                    : undefined
            },
            include: {
                images: true,
                category: true,
                colors: true,
                sizes: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(products);

    } catch (error) {
        console.log('[PRODUCTS_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
